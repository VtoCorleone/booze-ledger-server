'use strict';

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/booze-ledger-test',
  },
  sequelize: {
    uri: 'sqlite://',
    options: {
      logging: false,
      storage: 'test.sqlite',
      define: {
        timestamps: false,
      },
    },
  },

  // Set logging levels
  logger: {
    streams: function () {
      return {
        bunyanExpress: [],
        bunyanExpressError: [],
        fusion: [],
      };
    },

    excludes: ['response-hrtime', 'req-headers', 'res-headers'],
  },
};
