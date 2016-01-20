'use strict';

import bunyan from 'bunyan';
import bunyanExpress from 'express-bunyan-logger';
import config from '../config/environment';

function setSessionId(req) {
  return {
    sessionId: req.sessionID,
  };
}

/* LOGGING LEVELS

 "fatal" (60): The service/app is going to stop or become unusable now.
               An operator should definitely look into this soon.
 "error" (50): Fatal for a particular request, but the service/app continues
               servicing other requests. An operator should look at this soon(ish).
 "warn"  (40): A note on something that should probably be looked at by an operator eventually.
 "info"  (30): Detail on regular operation.
 "debug" (20): Anything else, i.e. too verbose to be included in "info" level.
 "trace" (10): Logging from external libraries used by your app or very detailed
               application logging.
 */

const excludes = config.logger.excludes || [];
const reqFormat = ':remote-address :incoming :method :url HTTP/:http-version :status-code ' +
':res-headers[content-length] :referer :user-agent[family] ' +
':user-agent[major].:user-agent[minor].:user-agent[patch] :user-agent[os] :response-time ms';

export const expressLogger = bunyanExpress({
  name: 'fusionExpress',
  streams: config.logger.streams(__dirname).bunyanExpress || [],
  serializers: bunyan.stdSerializers,
  format: reqFormat,
  excludes: excludes,
  includesFn: setSessionId,
});

export const expressLoggerError = bunyanExpress.errorLogger({
  name: 'fusionExpressError',
  streams: config.logger.streams(__dirname).bunyanExpressError || [],
  serializers: bunyan.stdSerializers,
  includesFn: setSessionId,
});

export const log = bunyan.createLogger({
  name: 'fusion',
  streams: config.logger.streams(__dirname).fusion || [],
  serializers: bunyan.stdSerializers,
  includesFn: setSessionId,
});
