import {
  FETCH_CHECKPOINT_EVENTS,
  FETCH_CHECKPOINT_EVENTS_BY_PAGE_NUM,
  FETCH_CHECKPOINT_EVENTS_ADD_EVENT,
  FETCH_CHECKPOINT_EVENTS_REMOVE_EVENT,
  FETCH_CHECKPOINT_EVENTS_FILTER,
  SET_FILTER_PLATE,
  SET_FILTER_DATE,
} from '../utils/invoke.types';

import {
  fetchCheckpointEvents,
  fetchCheckpointEventsByPageNum,
  fetchCheckpointEventsAddEvent,
  fetchCheckpointEventsRemoveEvent,
  fetchCheckpointEventsFilter,
  setFilterPlate,
  setFilterDate,
} from './eventsDatabaseService';

const { ipcMain } = require('electron');

function initHandlers() {
  ipcMain.handle(SET_FILTER_PLATE,
    async (event, plate) => {
      await setFilterPlate(global.knex, plate);
    });

  ipcMain.handle(SET_FILTER_DATE,
    async (event, date) => {
      await setFilterDate(global.knex, date);
    });

  ipcMain.handle(FETCH_CHECKPOINT_EVENTS,
    async () => fetchCheckpointEvents(global.knex));

  ipcMain.handle(FETCH_CHECKPOINT_EVENTS_BY_PAGE_NUM,
    async (event, page) => fetchCheckpointEventsByPageNum(global.knex, page));

  ipcMain.handle(FETCH_CHECKPOINT_EVENTS_ADD_EVENT,
    async (event, dataEvent) => fetchCheckpointEventsAddEvent(global.knex, dataEvent));

  ipcMain.handle(FETCH_CHECKPOINT_EVENTS_REMOVE_EVENT,
    async (event, eventIndex) => fetchCheckpointEventsRemoveEvent(global.knex, eventIndex));

  ipcMain.handle(FETCH_CHECKPOINT_EVENTS_FILTER,
    async () => fetchCheckpointEventsFilter(global.knex));
}

export {
  initHandlers,
};
