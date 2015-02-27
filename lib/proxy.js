'use strict';

var async = /**@type{!require.Async}*/(require('async'));
var net = /**@type{!require.Net}*/(require('net'));
var http = /**@type{!require.Http}*/(require('http'));
var https = /**@type{!require.Https}*/(require('https'));
var util = /**@type{!require.Util}*/(require('util'));
var path = /**@type{!require.Path}*/(require('path'));
var events = /**@type{!require.Events}*/(require("events"));
var mkdirps = /**@type{!require.Mkdirps}*/(require('mkdirps'));
var url = /**@type{!require.Url}*/(require('url'));

module.exports = function() {
  return new Proxy();
};

module.exports.gunzip = require('./middleware/gunzip');

/**
 * @constructor
 * @return {?}
 */
var Proxy = function() {
  /**@type{!Array.<!Proxy.ReHandler>}*/
  this.onRequestHandlers = [];
  /**@type{!Array.<!Proxy.ErrorHandler>}*/
  this.onErrorHandlers = [];
  /**@type{!Array.<!Proxy.DataHandler>}*/
  this.onRequestDataHandlers = [];
  /**@type{!Array.<!Proxy.ReHandler>}*/
  this.onResponseHandlers = [];
  /**@type{!Array.<!Proxy.DataHandler>}*/
  this.onResponseDataHandlers = [];
  /**@type{!Object.<!string,{port:!number,server:!https.Server}>}*/
  this.sslServers = {};
};

/**
 * @param {?Proxy.Options=} options
 */
Proxy.prototype.listen = function(options) {
  var self = this;
  this.options = options || {};
  /**@type{!number}*/
  this.httpPort = options.port || 8080;
  /**@type{!string}*/
  this.sslCertCacheDir = options.sslCertCacheDir || path.resolve(process.env['HOME'], '.http-mitm-proxy');
  this.sslServers = {};
  mkdirps(this.sslCertCacheDir, function(err) {
    if (err) {
      self._onError(null, err);
    }
    self.httpServer = http.createServer();
    self.httpServer.on('connect', self._onHttpServerConnect.bind(self));
    self.httpServer.on('request', self._onHttpServerRequest.bind(self, false));
    self.httpServer.listen(self.httpPort);
  });
};

/**
 * @param {!Proxy.ErrorHandler} fn
 */
Proxy.prototype.onError = function(fn) {
  this.onErrorHandlers.push(fn);
};

/**
 * @param {!Proxy.ReHandler} fn
 */
Proxy.prototype.onRequest = function(fn) {
  this.onRequestHandlers.push(fn);
};

/**
 * @param {!Proxy.DataHandler} fn
 */
Proxy.prototype.onRequestData = function(fn) {
  this.onRequestDataHandlers.push(fn);
};

/**
 * @param {!Proxy.ReHandler} fn
 */
Proxy.prototype.onResponse = function(fn) {
  this.onResponseHandlers.push(fn);
};

/**
 * @param {!Proxy.DataHandler} fn
 */
Proxy.prototype.onResponseData = function(fn) {
  this.onResponseDataHandlers.push(fn);
};

/**
 * @param {!Proxy.Module} mod
 */
Proxy.prototype.use = function(mod) {
  if (mod.onError) {
    this.onError(mod.onError);
  }
  if (mod.onCertificateRequired) {
      this.onCertificateRequired = mod.onCertificateRequired;
  }
  if (mod.onCertificateMissing) {
      this.onCertificateMissing = mod.onCertificateMissing;
  }
  if (mod.onRequest) {
    this.onRequest(mod.onRequest);
  }
  if (mod.onRequestData) {
    this.onRequestData(mod.onRequestData);
  }
  if (mod.onResponse) {
    this.onResponse(mod.onResponse);
  }
  if (mod.onResponseData) {
    this.onResponseData(mod.onResponseData);
  }
};

/**
 * @param {!http.IncomingMessage} req
 * @param {!net.Socket} socket
 * @param {!Buffer} head
 */
Proxy.prototype._onHttpServerConnect = function(req, socket, head) {
  var self = this;

  // URL is in the form 'hostname:port'
  var parts = req.url.split(':', 2);
  var hostname = parts[0];
  var port = parts[1] || 80;

  if (port == 443) {
    var sslServer = this.sslServers[hostname];
    if (sslServer) {
      return makeConnection(sslServer.port);
    } else {
      return openHttpsServer(hostname, function(err, port) {
        if (err) {
          return self._onError(null, err);
        }
        return makeConnection(port);
      });
    }
  } else {
    return makeConnection(this.httpPort);
  }

  /**
   * @param {!number} port
   */
  function makeConnection(port) {
    // open a TCP connection to the remote host
    var conn = net.connect(port, 'localhost', function() {
      // respond to the client that the connection was made
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
      // create a tunnel between the two hosts
      socket.pipe(conn);
      return conn.pipe(socket);
    });
  }

  /**
   * @param {!Proxy.CertFiles} files
   * @param {!function(?Error, !{key:!Buffer,cert:!Buffer}=):undefined} callback
   */
  function readCertificates(files, callback) {
    var fs = /**@type{!require.Fs}*/(require('fs'));
    fs.readFile(files.keyFile, function(err, keyFileData) {
      if (err) {
        return callback(err);
      }
      fs.readFile(files.certFile, function(err, certFileData) {
        if (err) {
          return callback(err);
        }
        if (!keyFileData || !certFileData) {
          return callback(new Error("Could not read key or cert."));
        }
        callback(null, {
          key: keyFileData,
          cert: certFileData
        });
      });
    });
  }

  /**
   * @param {!https.ServerOptions} httpsOptions
   * @param {!function(?Error,!number):undefined} callback
   */
  function startHttpsServer(httpsOptions, callback) {
    console.log('starting server for ' + hostname);
    var httpsServer = https.createServer(httpsOptions);
    httpsServer.on('connect', self._onHttpServerConnect.bind(self));
    httpsServer.on('request', self._onHttpServerRequest.bind(self, true));
    httpsServer.listen(function() {
      var openPort = httpsServer.address().port;
      console.log('server started for %s on port %d', hostname, openPort);

      self.sslServers[hostname] = {
        port: openPort,
        server: httpsServer
      };
      callback(null, openPort);
    });
  }

  /**
   * @param {!string} hostname
   * @param {!function(?Error,!number):undefined} callback
   */
  function openHttpsServer(hostname, callback) {
    self.onCertificateRequired(hostname, function (err, files) {
      if (err) {
        return callback(err, 0);
      }
      if (!files) {
        return callback(new Error("Could not read certificates."), 0);
      }
      readCertificates(files, function (err, certs) {
        if (err) {
          if (!files) {
            return callback(new Error("Could not read certificates."), 0);
          }
          return self.onCertificateMissing(files, function (err, files) {
            if (err) {
              return callback(err, 0);
            }
            if (!files) {
              return callback(new Error("Could not read certificates."), 0);
            }
            readCertificates(files, function (err, certs) {
              if (err) {
                return callback(err, 0);
              }
              if (!certs) {
                return callback(new Error("Could not read certificates."), 0);
              }
              startHttpsServer(certs, callback);
            });
          });
        }
        if (!certs) {
          return callback(new Error("Could not read certificates."), 0);
        }
        startHttpsServer(certs, callback);
      });
    });
  }
};

/**
 * @param {!string} hostname
 * @param {!function(?Error,?Proxy.CertFiles):undefined} callback
 */
Proxy.prototype.onCertificateRequired = function(hostname, callback) {
  var self = this;

  return callback(null, {
    keyFile: path.resolve(self.sslCertCacheDir, hostname + '-key.pem'),
    certFile: path.resolve(self.sslCertCacheDir, hostname + '-cert.pem')
  });
};

/**
 * @param {!Proxy.CertFiles} files
 * @param {!function(?Error,!Proxy.CertFiles=):undefined} callback
 */
Proxy.prototype.onCertificateMissing = function(files, callback) {
  callback(new Error("could not find file: " + files.keyFile + " and/or " + files.certFile));
};

/**
 * @param {?Proxy.Context} ctx
 * @param {!Error} err
 */
Proxy.prototype._onError = function(ctx, err) {
  this.onErrorHandlers.forEach(function(handler) {
    return handler(ctx, err);
  });
  if (ctx) {
    ctx.onErrorHandlers.forEach(function(handler) {
      return handler(ctx, err);
    });
  }
};

/**
 * @param {!boolean} isSSL
 * @param {!http.IncomingMessage} clientToProxyRequest
 * @param {!http.ServerResponse} proxyToClientResponse
 */
Proxy.prototype._onHttpServerRequest = function(isSSL, clientToProxyRequest, proxyToClientResponse) {
  var self = this;
  clientToProxyRequest.pause();
  var hostPort = Proxy.parseHostAndPort(clientToProxyRequest, isSSL ? 443 : 80);
  var /**@type{!Proxy.Context}*/
      ctx = {
    isSSL: isSSL,
    clientToProxyRequest: clientToProxyRequest,
    proxyToClientResponse: proxyToClientResponse,
    proxyToServerRequest: null,
    proxyToServerRequestOptions: {
      method: clientToProxyRequest.method,
      path: clientToProxyRequest.url,
      host: hostPort.host,
      port: hostPort.port,
      headers: clientToProxyRequest.headers,
      agent: false
    },
    serverToProxyResponse: null,
    onRequestHandlers: [],
    onErrorHandlers: [],
    onRequestDataHandlers: [],
    onResponseHandlers: [],
    onResponseDataHandlers: [],
    requestFilters: [],
    responseFilters: [],
    /**@param{!Proxy.ReHandler} fn*/
    onRequest: function(fn) {
      ctx.onRequestHandlers.push(fn);
    },
    /**@param{!Proxy.ErrorHandler} fn*/
    onError: function(fn) {
      ctx.onErrorHandlers.push(fn);
    },
    /**@param{!Proxy.DataHandler} fn*/
    onRequestData: function(fn) {
      ctx.onRequestDataHandlers.push(fn);
    },
    /**@param{!Proxy.FinalRequestFilter} filter*/
    addRequestFilter: function(filter) {
      ctx.requestFilters.push(filter);
    },
    /**@param{!Proxy.ReHandler} fn*/
    onResponse: function(fn) {
      ctx.onResponseHandlers.push(fn);
    },
    /**@param{!Proxy.DataHandler} fn*/
    onResponseData: function(fn) {
      ctx.onResponseDataHandlers.push(fn);
    },
    /**@param{!Proxy.FinalResponseFilter} filter*/
    addResponseFilter: function(filter) {
      ctx.responseFilters.push(filter);
    },
    /**@param{!Proxy.Module} mod*/
    use: function(mod) {
      if (mod.onError) {
        ctx.onError(mod.onError);
      }
      if (mod.onRequest) {
        ctx.onRequest(mod.onRequest);
      }
      if (mod.onRequestData) {
        ctx.onRequestData(mod.onRequestData);
      }
      if (mod.onResponse) {
        ctx.onResponse(mod.onResponse);
      }
      if (mod.onResponseData) {
        ctx.onResponseData(mod.onResponseData);
      }
    }
  };

  return self._onRequest(ctx, function(err) {
    if (err) {
      return self._onError(ctx, err);
    }
    return makeProxyToServerRequest();
  });

  function makeProxyToServerRequest() {
    var proto = ctx.isSSL ? https : http;
    ctx.proxyToServerRequest = proto.request(ctx.proxyToServerRequestOptions, proxyToServerRequestComplete);
    ctx.requestFilters.push(new Proxy.FinalRequestFilter(self, ctx));
    var /**@type{!stream.Readable}*/
        prevRequestPipeElem = ctx.clientToProxyRequest;
    ctx.requestFilters.forEach(function(filter) {
      prevRequestPipeElem = prevRequestPipeElem.pipe(filter);
    });
    ctx.clientToProxyRequest.resume();
  }

  /**
   * @param {!http.IncomingMessage} serverToProxyResponse
   */
  function proxyToServerRequestComplete(serverToProxyResponse) {
    serverToProxyResponse.pause();
    ctx.serverToProxyResponse = serverToProxyResponse;
    return self._onResponse(ctx, function(err) {
      if (err) {
        return self._onError(ctx, err);
      }
      ctx.serverToProxyResponse.headers['transfer-encoding'] = 'chunked';
      ctx.serverToProxyResponse.headers['connection'] = 'close';
      ctx.proxyToClientResponse.writeHead(ctx.serverToProxyResponse.statusCode, ctx.serverToProxyResponse.headers);
      ctx.responseFilters.push(new Proxy.FinalResponseFilter(self, ctx));
      var /**@type{!stream.Readable}*/
          prevResponsePipeElem = ctx.serverToProxyResponse;
      ctx.responseFilters.forEach(function(filter) {
        prevResponsePipeElem = prevResponsePipeElem.pipe(filter);
      });
      return ctx.serverToProxyResponse.resume();
    });
  }
};

/**
 * @constructor
 * @extends events.EventEmitter
 * @implements stream.Writable
 * @param {!Proxy} proxy
 * @param {!Proxy.Context} ctx
 */
Proxy.FinalRequestFilter = function(proxy, ctx) {
  events.EventEmitter.call(this);
  this.writable = true;

  /**
   * @param {!Buffer} chunk
   */
  this.write = function(chunk) {
    proxy._onRequestData(ctx, chunk, function(err, chunk) {
      if (err) {
        return proxy._onError(ctx, err);
      }
      if (chunk) {
        ctx.proxyToServerRequest.write(chunk);
      }
    });
    return true;
  };

  /**
   * @param {?Buffer} chunk
   */
  this.end = function(chunk) {
    if (chunk) {
      return proxy._onRequestData(ctx, chunk, function(err, chunk) {
        if (err) {
          return proxy._onError(ctx, err);
        }
        return ctx.proxyToServerRequest.end(chunk);
      });
    } else {
      return ctx.proxyToServerRequest.end(chunk);
    }
  };
};
util.inherits(Proxy.FinalRequestFilter, events.EventEmitter);

/**
 * @constructor
 * @extends events.EventEmitter
 * @implements stream.Writable
 * @param {!Proxy} proxy
 * @param {!Proxy.Context} ctx
 */
Proxy.FinalResponseFilter = function(proxy, ctx) {
  events.EventEmitter.call(this);
  this.writable = true;

  /**
   * @param {!Buffer} chunk
   */
  this.write = function(chunk) {
    proxy._onResponseData(ctx, chunk, function(err, chunk) {
      if (err) {
        return proxy._onError(ctx, err);
      }
      if (chunk) {
        ctx.proxyToClientResponse.write(chunk);
      }
    });
    return true;
  };

  /**
   * @param {?Buffer} chunk
   */
  this.end = function(chunk) {
    if (chunk) {
      return proxy._onResponseData(ctx, chunk, function(err, chunk) {
        if (err) {
          return proxy._onError(ctx, err);
        }
        return ctx.proxyToClientResponse.end(chunk);
      });
    } else {
      return ctx.proxyToClientResponse.end(chunk);
    }
  };

  return this;
};
util.inherits(Proxy.FinalResponseFilter, events.EventEmitter);

/**
 * @param {!Proxy.Context} ctx
 * @param {!function(?Error)} callback
 */
Proxy.prototype._onRequest = function(ctx, callback) {
  /**
   * @param {!Proxy.ReHandler} fn
   * @param {!function(?Error):undefined} callback
   */
  function iterator(fn, callback) {
    return fn(ctx, callback);
  }
  async.forEach(this.onRequestHandlers.concat(ctx.onRequestHandlers), iterator, callback);
};

/**
 * @param {!Proxy.Context} ctx
 * @param {!Buffer} chunk
 * @param {!function(?Error,?Buffer):undefined} callback
 */
Proxy.prototype._onRequestData = function(ctx, chunk, callback) {
  var self = this;
  /**
   * @param {!Proxy.DataHandler} fn
   * @param {!function(?Error):undefined} callback
   */
  function iterator(fn, callback) {
    return fn(ctx, chunk, function(err, newChunk) {
      if (err) {
        return callback(err);
      }
      if (newChunk) {
        chunk = newChunk;
      }
      return callback(null);
    });
  }
  async.forEach(this.onRequestDataHandlers.concat(ctx.onRequestDataHandlers), iterator, function(err) {
    if (err) {
      return self._onError(ctx, err);
    }
    return callback(null, chunk);
  });
};

/**
 * @param {!Proxy.Context} ctx
 * @param {!function(?Error):undefined} callback
 */
Proxy.prototype._onResponse = function(ctx, callback) {
  /**
   * @param {!Proxy.ReHandler} fn
   * @param {!function(?Error):undefined} callback
   */
  function iterator(fn, callback) {
    return fn(ctx, callback);
  }
  async.forEach(this.onResponseHandlers.concat(ctx.onResponseHandlers), iterator, callback);
};

/**
 * @param {!Proxy.Context} ctx
 * @param {!Buffer} chunk
 * @param {!function(?Error,?Buffer):undefined} callback
 */
Proxy.prototype._onResponseData = function(ctx, chunk, callback) {
  var self = this;
  /**
   * @param {!Proxy.DataHandler} fn
   * @param {!function(?Error):undefined} callback
   */
  function iterator(fn, callback) {
    return fn(ctx, chunk, function(err, newChunk) {
      if (err) {
        return callback(err);
      }
      if (newChunk) {
        chunk = newChunk;
      }
      return callback(null);
    });
  }
  async.forEach(this.onResponseDataHandlers.concat(ctx.onResponseDataHandlers), iterator, function (err) {
    if (err) {
      return self._onError(ctx, err);
    }
    return callback(null, chunk);
  });
};

/**
 * @param {!http.IncomingMessage} req
 * @param {!number} defaultPort
 * @return {?{host:!string,port:!number}}
 */
Proxy.parseHostAndPort = function(req, defaultPort) {
  var host = req.headers.host;
  if (!host) {
    return null;
  }
  var hostPort = Proxy.parseHost(host, defaultPort);

  // this handles paths which include the full url. This could happen if it's a proxy
  var m = req.url.match(/^http:\/\/([^\/]*)\/?(.*)$/);
  if (m) {
    var parsedUrl = url.parse(req.url);
    hostPort.host = parsedUrl.hostname;
    hostPort.port = parsedUrl.port;
    req.url = parsedUrl.path;
  }

  return hostPort;
};

/**
 * @param {!string} hostString
 * @param {!number} defaultPort
 * @return {?{host:!string,port:!number}}
 */
Proxy.parseHost = function(hostString, defaultPort) {
  var m = hostString.match(/^http:\/\/(.*)/);
  if (m) {
    var parsedUrl = url.parse(hostString);
    return {
      host: parsedUrl.hostname,
      port: parsedUrl.port
    };
  }

  var hostPort = hostString.split(':');
  var host = hostPort[0];
  var port = hostPort.length === 2 ? +hostPort[1] : defaultPort;

  return {
    host: host,
    port: port
  };
};
