import { EventEmitter } from 'events';

export const eventBus = new EventEmitter();

export const BOOK_EVENTS = {
  CREATED: 'created',
  UPDATED: 'updated',
  REPLACED: 'replaced',
  DELETED: 'deleted',
};
