import {
  FETCH_CHECKPOINT_EVENTS_CHANNEL,
  FETCH_CHECKPOINT_EVENTS_ADD_EVENT_CHANNEL,
  FETCH_CHECKPOINT_EVENTS_REMOVE_EVENT_CHANNEL,
} from '../utils/invoke.types';

import {
  fetchCheckpointEvents,
  fetchCheckpointEventsAddEvent,
  fetchCheckpointEventsRemoveEvent,
} from './eventsDatabaseService';

const { ipcMain } = require('electron');

function initHandlers() {
  ipcMain.handle(FETCH_CHECKPOINT_EVENTS_CHANNEL,
    async () => fetchCheckpointEvents(global.knex));

  ipcMain.handle(FETCH_CHECKPOINT_EVENTS_ADD_EVENT_CHANNEL,
    async (event, dataEvent) => {
      await fetchCheckpointEventsAddEvent(global.knex, dataEvent);
    });

  ipcMain.handle(FETCH_CHECKPOINT_EVENTS_REMOVE_EVENT_CHANNEL,
    async (event, eventIndex) => {
      await fetchCheckpointEventsRemoveEvent(global.knex, eventIndex);
    });
}

export {
  initHandlers,
};
