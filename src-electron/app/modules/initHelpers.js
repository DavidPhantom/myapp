import {
  FETCH_CHECKPOINT_EVENTS,
  FETCH_CHECKPOINT_EVENTS_ADD_EVENT,
  FETCH_CHECKPOINT_EVENTS_REMOVE_EVENT,
} from '../utils/invoke.types';

import {
  fetchCheckpointEvents,
  fetchCheckpointEventsAddEvent,
  fetchCheckpointEventsRemoveEvent,
} from './eventsDatabaseService';

const { ipcMain } = require('electron');

function initHandlers() {
  ipcMain.handle(FETCH_CHECKPOINT_EVENTS,
    async () => fetchCheckpointEvents(global.knex));

  ipcMain.handle(FETCH_CHECKPOINT_EVENTS_ADD_EVENT,
    async (event, dataEvent) => {
      await fetchCheckpointEventsAddEvent(global.knex, dataEvent);
    });

  ipcMain.handle(FETCH_CHECKPOINT_EVENTS_REMOVE_EVENT,
    async (event, eventIndex) => {
      await fetchCheckpointEventsRemoveEvent(global.knex, eventIndex);
    });
}

export {
  initHandlers,
};
