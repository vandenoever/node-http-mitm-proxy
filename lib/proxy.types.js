
/**@typedef{{
  port:(!number|undefined),
  sslCertCacheDir:(!string|undefined)
}}*/
Proxy.Options;

/**@typedef{!function(!Proxy.Context,!function(?Error):undefined):undefined}*/
Proxy.ReHandler;

/**@typedef{!function(!Proxy.Context,!Buffer,!function(?Error,?Buffer):undefined):undefined}*/
Proxy.DataHandler;

/**@typedef{!function(?Proxy.Context,!Error):undefined}*/
Proxy.ErrorHandler;

/**@typedef{{
  method: !string,
  path: !string,
  host: !string,
  port: !number,
  headers: {host:!string},
  agent: !boolean
}}*/
Proxy.RequestOptions;

/**@typedef{{
  isSSL:!boolean,
  clientToProxyRequest:!http.IncomingMessage,
  proxyToClientResponse:!http.ServerResponse,
  proxyToServerRequest:?http.ClientRequest,
  proxyToServerRequestOptions:!Proxy.RequestOptions,
  serverToProxyResponse:?http.IncomingMessage,
  onRequestHandlers:!Array.<!Proxy.ReHandler>,
  onErrorHandlers:!Array.<!Proxy.ErrorHandler>,
  onRequestDataHandlers:!Array.<!Proxy.DataHandler>,
  onResponseHandlers:!Array.<!Proxy.ReHandler>,
  onResponseDataHandlers:!Array.<!Proxy.DataHandler>,
  requestFilters:!Array.<!Proxy.FinalRequestFilter>,
  responseFilters:!Array.<!Proxy.FinalResponseFilter>,
  onRequest:!function(!Proxy.ReHandler):undefined,
  onError:!function(!Proxy.ErrorHandler):undefined,
  onRequestData:!function(!Proxy.DataHandler):undefined,
  addRequestFilter:!function(!Proxy.FinalRequestFilter):undefined,
  onResponse:!function(!Proxy.ReHandler):undefined,
  onResponseData:!function(!Proxy.DataHandler):undefined,
  addResponseFilter:!function(!Proxy.FinalResponseFilter):undefined,
  use:!function(!Proxy.Module):undefined
}}*/
Proxy.Context;

/**@typedef{{
  keyFile:!string,
  certFile:!string
}}*/
Proxy.CertFiles;

/**@typedef{{
  onError:(!Proxy.ErrorHandler|undefined),
  onCertificateRequired:(!function(!string,!function(?Error,?Proxy.CertFiles))|undefined),
  onCertificateMissing:(!function(!Proxy.CertFiles,!function(?Error,!Proxy.CertFiles=))|undefined),
  onRequest:(!Proxy.ReHandler|undefined),
  onRequestData:(!Proxy.DataHandler|undefined),
  onResponse:(!Proxy.ReHandler|undefined),
  onResponseData:(!Proxy.DataHandler|undefined)
}}*/
Proxy.Module;
