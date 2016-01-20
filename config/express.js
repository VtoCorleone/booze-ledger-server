/**
 * Express configuration
 */

'use strict';

import morgan from 'morgan';
import compression from 'compression';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import errorHandler from 'errorhandler';
import config from './environment';
import passport from 'passport';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
let MongoStore = connectMongo(session);

export default function (app) {
  const env = app.get('env');

  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());

  // Persist sessions with mongoStore / sequelizeStore
  // We need to enable sessions for passport-twitter because it's an
  // oauth 1.0 strategy, and Lusca depends on sessions
  app.use(session({
    secret: config.secrets.session,
    saveUninitialized: true,
    resave: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      db: 'booze-ledger',
    }),
  }));

  if (env === 'production') {
    app.use(morgan('dev'));
  }

  if (env === 'development') {
    app.use(require('connect-livereload')());
  }

  if (env === 'development' || env === 'test') {
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
}
