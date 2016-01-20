/**
 * Main application file
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import config from '../config/environment';
import http from 'http';
import cors from 'cors';
import { expressLogger, expressLoggerError } from '../logger';

// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function (err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

// Populate databases with sample data
if (config.seedDB) {
  require('../config/seed');
}

// Setup server
let app = express();
app.use(cors());
let server = http.createServer(app);
let socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client',
});
require('../config/socketio')(socketio);
require('../config/express')(app);
app.use(expressLogger);
require('./routes')(app);
app.use(expressLoggerError);

// Start server
function startServer() {
  server.listen(config.port, config.ip, function () {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;
