/**
 * User model events
 */

'use strict';

import {EventEmitter} from 'events';
import User from './user.model';
let UserEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
UserEvents.setMaxListeners(0);

// Model events
const events = {
  save: 'save',
  remove: 'remove',
};

function emitEvent(event) {
  return function (doc) {
    UserEvents.emit(event + ':' + doc._id, doc);
    UserEvents.emit(event, doc);
  };
}

// Register the event emitter to the model events
for (let e in events) {
  let userEvent = events[e];
  User.schema.post(e, emitEvent(userEvent));
}

export default UserEvents;
