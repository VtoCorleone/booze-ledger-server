import bunyan from 'bunyan';
import bunyan_express from 'express-bunyan-logger';
import config from '../config/environment';

function setSessionId (req, res) {
  return {
    session_id: req.sessionID
  }
}

/* LOGGING LEVELS

 "fatal" (60): The service/app is going to stop or become unusable now. An operator should definitely look into this soon.
 "error" (50): Fatal for a particular request, but the service/app continues servicing other requests. An operator should look at this soon(ish).
 "warn"  (40): A note on something that should probably be looked at by an operator eventually.
 "info"  (30): Detail on regular operation.
 "debug" (20): Anything else, i.e. too verbose to be included in "info" level.
 "trace" (10): Logging from external libraries used by your app or very detailed application logging.
 */

let streams = config.logger.streams(__dirname).bunyan_express || [];
let excludes = config.logger.excludes || [];

let express_logger = bunyan_express({
  name: 'bunyan-express',
  streams: streams,
  serializers: bunyan.stdSerializers,
  format: ':remote-address :incoming :method :url HTTP/:http-version :status-code :res-headers[content-length] :referer :user-agent[family] :user-agent[major].:user-agent[minor].:user-agent[patch] :user-agent[os] :response-time ms',
  excludes: excludes,
  includesFn: setSessionId
});

let express_logger_error = bunyan_express.errorLogger({
  name: 'boozie-error',
  streams: streams,
  serializers: bunyan.stdSerializers,
  includesFn: setSessionId
});

let log = bunyan.createLogger({
  name: 'boozie',
  streams: streams,
  serializers: bunyan.stdSerializers,
  includesFn: setSessionId
});

export { express_logger, express_logger_error, log }
