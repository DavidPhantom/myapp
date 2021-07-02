import {
  FETCH_CHECKPOINT_EVENTS,
  FETCH_CHECKPOINT_EVENTS_BY_PAGE_NUM,
  FETCH_CHECKPOINT_EVENTS_ADD_EVENT,
  FETCH_CHECKPOINT_EVENTS_EDIT_EVENT,
  FETCH_CHECKPOINT_EVENTS_REMOVE_EVENT,
} from '../utils/helper';

import {
  fetchCheckpointEvents,
  fetchCheckpointEventsByPageNum,
  fetchCheckpointEventsAddEvent,
  fetchCheckpointEventsRemoveEvent,
  fetchCheckpointEventsEditEvent,
} from './eventsDatabaseService';

const { ipcMain } = require('electron');

function initHandlers() {
  ipcMain.handle(FETCH_CHECKPOINT_EVENTS,
    async (event) => fetchCheckpointEvents(event, global.knex));

  ipcMain.handle(FETCH_CHECKPOINT_EVENTS_BY_PAGE_NUM,
    async (event, page) => fetchCheckpointEventsByPageNum(event, global.knex, page));

  ipcMain.handle(FETCH_CHECKPOINT_EVENTS_ADD_EVENT,
    async (event, row) => fetchCheckpointEventsAddEvent(event, global.knex, row));

  ipcMain.handle(FETCH_CHECKPOINT_EVENTS_REMOVE_EVENT,
    async (event, rowIdx) => fetchCheckpointEventsRemoveEvent(event, global.knex, rowIdx));

  ipcMain.handle(FETCH_CHECKPOINT_EVENTS_EDIT_EVENT,
    async (event, dataLocal) => {
      await fetchCheckpointEventsEditEvent(event, global.knex,
        dataLocal.curRowIdx, dataLocal.curRow);
    });
}

export {
  initHandlers,
};
