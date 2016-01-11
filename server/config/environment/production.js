'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:     process.env.OPENSHIFT_NODEJS_IP ||
          process.env.IP ||
          undefined,

  // Server port
  port:   process.env.OPENSHIFT_NODEJS_PORT ||
          process.env.PORT ||
          8080,

  // MongoDB connection options
  mongo: {
    uri:  process.env.MONGOLAB_URI ||
          process.env.MONGOHQ_URL ||
          process.env.OPENSHIFT_MONGODB_DB_URL +
          process.env.OPENSHIFT_APP_NAME ||
          'mongodb://localhost/booze-ledger'
  },

  // Set logging levels
  logger: {
    streams: function (path) {
      return {
        'bunyan_express': [
          {
            level: 'warn',
            stream: process.stdout
          },
          {
            level: 'info',
            path: path + '/logs/logs.log'
          }
        ],
        'bunyan_express_error': [
          {
            level: 'warn',
            stream: process.stdout
          },
          {
            level: 'warn',
            path: path + '/logs/express_error_logs.log'
          }
        ],
        'fusion': [
          {
            level: 'warn',
            stream: process.stdout
          },
          {
            level: 'info',
            path: path + '/logs/logs.log'
          }
        ]
      }
    },
    excludes: ['response-hrtime', 'req-headers', 'res-headers']
  }
};
