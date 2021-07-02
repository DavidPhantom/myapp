import {
  FETCH_CHECKPOINT_EVENTS,
  FETCH_CHECKPOINT_EVENTS_BY_PAGE_NUM,
  FETCH_CHECKPOINT_EVENTS_ADD_EVENT,
  FETCH_CHECKPOINT_EVENTS_EDIT_EVENT,
  FETCH_CHECKPOINT_EVENTS_REMOVE_EVENT,
  FETCH_CHECKPOINT_EVENTS_FILTER,
  SET_FILTER_PLATE,
  SET_FILTER_DATE,
} from '../utils/helper';

import {
  fetchCheckpointEvents,
  fetchCheckpointEventsByPageNum,
  fetchCheckpointEventsAddEvent,
  fetchCheckpointEventsRemoveEvent,
  fetchCheckpointEventsEditEvent,
  fetchCheckpointEventsFilter,
  setFilterPlate,
  setFilterDate,
} from './eventsDatabaseService';

const { ipcMain } = require('electron');

function initHandlers() {
  ipcMain.handle(SET_FILTER_PLATE,
    async (event, plate) => {
      await setFilterPlate(event, global.knex, plate);
    });

  ipcMain.handle(SET_FILTER_DATE,
    async (event, date) => {
      await setFilterDate(event, global.knex, date);
    });

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

  ipcMain.handle(FETCH_CHECKPOINT_EVENTS_FILTER,
    async (event) => fetchCheckpointEventsFilter(event, global.knex));
}

export {
  initHandlers,
};
