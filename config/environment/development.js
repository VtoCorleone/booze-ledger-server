'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/booze-ledger-dev',
  },

  // Seed database on startup
  seedDB: true,

  // Set logging levels
  logger: {
    streams: function (path) {
      return {
        bunyanExpress: [
          {
            level: 'debug',
            stream: process.stdout,
          },
          {
            level: 'debug',
            path: path + '/logs/logs.log',
          },
        ],
        bunyanExpressError: [
          {
            level: 'warn',
            stream: process.stdout,
          },
          {
            level: 'warn',
            path: path + '/logs/express_error_logs.log',
          },
        ],
        fusion: [
          {
            level: 'debug',
            stream: process.stdout,
          },
          {
            level: 'info',
            path: path + '/logs/logs.log',
          },
        ],
      };
    },

    excludes: ['response-hrtime', 'req-headers', 'res-headers'],
  },
};
