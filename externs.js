/**
 * @type {!require.Process}
 */
var process;
/**
 * @constructor
 * @param {*=} opt_message
 * @param {*=} opt_file
 * @param {*=} opt_line
 * @return {!Error}
 * @nosideeffects
 */
function Error(opt_message, opt_file, opt_line) {}
/**
 * @param {?=} opt_yr_num
 * @param {?=} opt_mo_num
 * @param {?=} opt_day_num
 * @param {?=} opt_hr_num
 * @param {?=} opt_min_num
 * @param {?=} opt_sec_num
 * @param {?=} opt_ms_num
 * @constructor
 * @return {string}
 * @nosideeffects
 */
function Date(opt_yr_num, opt_mo_num, opt_day_num, opt_hr_num, opt_min_num,
    opt_sec_num, opt_ms_num) {}

/**
 * @return {number}
 * @nosideeffects
 */
Date.now = function() {};
/**
 * @constructor
 * @param {*=} opt_str
 * @return {string}
 * @nosideeffects
 */
function String(opt_str) {}
/**
 * @this {String|string}
 * @param {number} begin
 * @param {number=} opt_end
 * @return {string}
 * @nosideeffects
 */
String.prototype.slice = function(begin, opt_end) {};
/**
 * @this {String|string}
 * @param {*} regexp
 * @return {!Array.<string>}
 */
String.prototype.match = function (regexp) {"use strict";};
/**
 * @this {String|string}
 * @param {*=} opt_separator
 * @param {number=} opt_limit
 * @return {!Array.<string>}
 * @nosideeffects
 */
String.prototype.split = function(opt_separator, opt_limit) {};
/**
 * @param {!string} str
 * @param {!number} base
 * @return {!number}
 */
function parseInt(str, base) {"use strict"; }
/**
 * @constructor
 * @param {...*} var_args
 * @nosideeffects
 * @throws {Error}
 */
function Function(var_args) {}
/**
 * @param {Object|undefined} selfObj
 *     point when the function is run. If the value is null or undefined, it
 *     will default to the global object.
 * @param {...*} var_args
 *     applied to fn.
 * @return {!Function} A
 *     bind() was invoked as a method.
 * @nosideeffects
 */
Function.prototype.bind = function(selfObj, var_args) {};
/**
 * @param {...*} var_args
 * @return {*}
 */
Function.prototype.call = function(var_args) {};
/**
 * @constructor
 * @param {...*} var_args
 * @return {!Array.<?>}
 * @nosideeffects
 * @template T
 */
function Array(var_args) {}
/**
 * Mutates an array by appending the given elements and returning the new
 * length of the array.
 *
 * @param {...T} var_args
 * @return {number} The
 * @this {{length: number}|Array.<T>}
 * @template T
 * @modifies {this}
 */
Array.prototype.push = function(var_args) {};
/**
 * @type {number}
 */
Array.prototype.length;
/**
 * Returns a new array comprised of this array joined with other array(s)
 * and/or value(s).
 *
 * @param {...*} var_args
 * @return {!Array.<?>}
 * @this {*}
 * @nosideeffects
 */
Array.prototype.concat = function(var_args) {};
/**
 * Available in ECMAScript 5, Mozilla 1.6+.
 * @param {?function(this:S, T, number=, !Array.<T>=): ?} callback
 * @param {S=} opt_thisobj
 * @this {{length: number}|Array.<T>|string}
 * @template T,S
 */
Array.prototype.forEach = function(callback, opt_thisobj) {};
/**
 * @param {!string} module
 * @return {!require.Url|!require.Http|!require.Tls|!require.Https|!require.Net}
 */
function require(module) {"use strict"; }

/**@typedef{{
    parse:!function(!string,!boolean=):!URL
}}*/
require.Url;
/**@typedef{{
    spawn:!function(!string, !Array.<!string>):!events.EventEmitter
}}*/
require.ChildProcess;
/**@typedef{{
    exists:!function(!string,!function(!boolean)):undefined,
    existsSync:!function(!string):!boolean,
    readFile:!function(!string,!function(?Error,?Buffer)),
    readFileSync:!function(!string):!Buffer
}}*/
require.Fs;

/**
 * @constructor
 */
require.HttpConnectionListener = function () {"use script"; };
/**
 * @param {!http.Server} server
 * @param {!net.Socket} socket
 */
require.HttpConnectionListener.prototype.call = function (server, socket) {"use strict"; };
/**@typedef{{
    env:!Object.<!string,!string>
}}*/
require.Process;
/**@typedef{{
    resolve:!function(!string,!string):!string
}}*/
require.Path;
/**@typedef{!function(!string,!function(?Error))}*/
require.Mkdirps;
/**@typedef{{
    forEach:!function(!Array.<*>,!function(?,function(?Error):undefined):undefined,!function(?Error):undefined),
    auto:!function(!Object,!function(?Error,?Object))
}}*/
require.Async;
/**@typedef{{
    inherits:!function(!Object,!Object):undefined
}}*/
require.Util;
/**@typedef{{
    request:!function(!Object,!function(!http.IncomingMessage):undefined=):!http.ClientRequest,
    createServer:!function(!Function=):!http.Server,
    _connectionListener:!require.HttpConnectionListener
}}*/
require.Http;
/**@typedef{{
    request:!function(!Object,!function(!http.IncomingMessage):undefined=):!http.ClientRequest,
    createServer:!function(!https.ServerOptions,!Function=):!https.Server
}}*/
require.Https;
/**@typedef{{
    connect:!function(!number,!string=,!function()=):!net.Socket,
    createServer:!function(!Function):!net.Server
}}*/
require.Net;
/**@typedef{{
    log:!function(!string):undefined
}}*/
require.Stream;
/**@typedef{{
    createServer:!function(!Function):!tls.Server,
    createSecurePair:!function(!tls.SecureContext,!boolean,!boolean,!boolean):!tls.SecurePair,
    createSecureContext:!function(!Object):!tls.SecureContext
}}*/
require.Tls;
/**@typedef{{
    log:!function(...*):undefined
}}*/
require.Console;
/**@typedef{{
    log:!function(*):undefined,
    EventEmitter:!function(new:events.EventEmitter)
}}*/
require.Events;

/**@typedef{{
    protocol:!string,
    hostname:!string,
    port:!number,
    path:!string
}}*/
var URL;

/**
 * @type {!require.Url}
 */
var url;
/**
 * @type {!require.Events}
 */
var events;
/**
 * @constructor
 */
events.EventEmitter = function () {"use strict"; };
/**
 * @param {!string} event
 * @param {!Function} listener
 * @return {!events.EventEmitter}
 */
events.EventEmitter.prototype.addListener = function (event, listener) {"use strict"; };
/**
 * @param {!string} event
 * @param {!Function} listener
 * @return {!events.EventEmitter}
 */
events.EventEmitter.prototype.removeListener = function (event, listener) {"use strict"; };
/**
 * @param {!string} event
 * @param {!Function} listener
 */
events.EventEmitter.prototype.on = function (event, listener) {"use strict"; };
/**
 * @type {!require.Console}
 */
var console;
/**
 * @constructor
 */
function Buffer() {"use strict"; }
/**
 * @return {!string}
 */
Buffer.prototype.toString = function () {"use strict"; };
/**
 * @type {!require.Http}
 */
var http;
/**
 * @constructor
 * @implements stream.Writable
 * @extends events.EventEmitter
 */
http.ClientRequest = function () {"use strict"; };
/**
 * @param {?Buffer=} chunk
 * @return {undefined}
 */
http.ClientRequest.prototype.end = function (chunk) {"use strict"; };
/**
 * @param {!Buffer} chunk
 * @param {!string=} encoding
 * @return {!boolean}
 */
http.ClientRequest.prototype.write = function (chunk, encoding) {"use strict"; };
/**
 * @constructor
 * @implements stream.Readable
 * @extends events.EventEmitter
 */
http.IncomingMessage = function () {"use strict"; };
/**
 * @type {?{pair:*}}
 */
http.IncomingMessage.prototype.client;
/**
 * @type {!string}
 */
http.IncomingMessage.prototype.url;
/**
 * @param {!stream.Writable} destination
 * @return {!stream.Readable}
 */
http.IncomingMessage.prototype.pipe = function (destination) {"use strict"; };
/**
 * @type {!{host:!string}}
 */
http.IncomingMessage.prototype.headers;
/**
 * @type {!string}
 */
http.IncomingMessage.prototype.method;
/**
 * @type {!string}
 */
http.IncomingMessage.prototype.url;
/**
 * @type {!number}
 */
http.IncomingMessage.prototype.statusCode;
/**
 * @param {?Buffer=} chunk
 * @return {undefined}
 */
http.IncomingMessage.prototype.end = function (chunk) {"use strict"; };
/**
 * @return {undefined}
 */
http.IncomingMessage.prototype.pause = function () {"use strict"; };
/**
 * @return {undefined}
 */
http.IncomingMessage.prototype.resume = function () {"use strict"; };
/**
 * @constructor
 * @implements stream.Writable
 * @extends events.EventEmitter
 */
http.ServerResponse = function () {"use strict"; };
/**
 * @param {!number} statusCode
 * @param {!Object.<!string,!string>} headers
 */
http.ServerResponse.prototype.writeHead = function (statusCode, headers) {"use strict"; };
/**
 * @param {!Buffer} chunk
 * @param {!string=} encoding
 * @return {!boolean}
 */
http.ServerResponse.prototype.write = function (chunk, encoding) {"use strict"; };
/**
 * @param {?Buffer=} chunk
 * @return {undefined}
 */
http.ServerResponse.prototype.end = function (chunk) {"use strict"; };
/**
 * @constructor
 * @extends events.EventEmitter
 * @param {!function(!http.IncomingMessage,!http.ServerResponse)} handler
 */
http.Server = function (handler) {"use strict"; };
/**
 * @param {!number} port
 * @param {!string=} name
 */
http.Server.prototype.listen = function (port, name) {"use strict"; };
/**@typedef{{
    hostname: !string,
    port: !number,
    path: !string,
    headers: !Object.<!string,!string>,
    method: !string 
}}*/
http.RequestOptions;
/**
 * @type {!require.Https}
 */
var https;
/**@typedef{{
    key: !Buffer,
    cert: !Buffer
}}*/
https.ServerOptions;
/**
 * @constructor
 * @extends events.EventEmitter
 * @param {!https.ServerOptions} options
 */
https.Server = function (options) {"use strict"; };
/**
 * @param {!function():undefined} listeningCallback
 */
https.Server.prototype.listen = function (listeningCallback) {"use strict"; };
/**
 * @return {!{port:!number,family:!string,address:!string}}
 */
https.Server.prototype.address = function () {"use strict;" };
/**
 * @type {!require.Net}
 */
var net;
/**
 * @type {!require.Stream}
 */
var stream;
/**
 * @interface
 */
stream.Readable = function () {"use strict"; };
/**
 * @param {!stream.Writable} destination
 * @return {!stream.Readable}
 */
stream.Readable.prototype.pipe = function (destination) {"use strict"; };
/**
 * @interface
 */
stream.Writable = function () {"use strict"; };
/**
 * @param {!Buffer} chunk
 * @param {!string=} encoding
 * @return {!boolean}
 */
stream.Writable.prototype.write = function (chunk, encoding) {"use strict"; };
/**
 * @interface
 * @extends stream.Readable
 * @extends stream.Writable
 */
stream.Duplex = function () {"use strict"; };
/**
 * @constructor
 */
net.Server = function () {"use strict"; };
/**
 * @param {!number} port
 * @param {!string=} name
 */
net.Server.prototype.listen = function (port, name) {"use strict"; };
/**
 * @constructor
 * @implements stream.Duplex
 * @extends events.EventEmitter
 */
net.Socket = function () {"use strict"; };
/**
 * @param {!stream.Writable} destination
 * @return {!stream.Readable}
 */
net.Socket.prototype.pipe = function (destination) {"use strict"; };
/**
 * @type {!number}
 */
net.Socket.prototype.fd;
/**
 * @param {!Buffer|!string} chunk
 * @param {!string=} encoding
 * @return {!boolean}
 */
net.Socket.prototype.write = function (chunk, encoding) {"use strict"; };
/**
 * @type {!require.Tls}
 */
var tls;
/**
 * @constructor
 */
tls.Server = function () {"use strict"; };
/**
 * @constructor
 */
tls.SecureContext = function () {"use strict"; };
/**
 * @constructor
 */
tls.SecurePair = function () {"use strict"; };
/**
 * @type {!tls.TLSSocket}
 */
tls.SecurePair.prototype.cleartext;
/**
 * @type {!number}
 */
tls.SecurePair.prototype.fd;
/**
 * @type {!stream.Duplex}
 */
tls.SecurePair.prototype.encrypted;
/**
 * @param {!string} event
 * @param {!Function} listener
 */
tls.SecurePair.prototype.on = function (event, listener) {"use strict"; };
/**
 * @constructor
 * @extends net.Socket
 */
tls.TLSSocket = function () {"use strict"; };
/**
 * @type {!boolean}
 */
tls.TLSSocket.prototype._controlReleased;
/**
 * @param {!string} event
 * @param {*=} data
 */
tls.TLSSocket.prototype.emit = function (event, data) {"use strict"; };
/**
 * @param {!tls.SecureContext} context
 * @param {!boolean} isServer
 * @param {!boolean} requestCert
 * @param {!boolean} rejectUnauthorized
 * @return {!tls.SecurePair}
 */
tls.createSecurePair = function (context, isServer, requestCert, rejectUnauthorized) {"use strict"; };
/**@type{!Object}*/
var module = {};
