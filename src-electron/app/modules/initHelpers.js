import {
  FETCH_CHECKPOINT_ROWS_COUNT_CHANNEL,
  ADD_ROW_CHANNEL,
  REMOVE_ROW_CHANNEL,
  FETCH_CHECKPOINT_BY_PAGE_CHANNEL,
} from '../utils/invoke.types';

import {
  fetchCheckpointRowsCount, addRow, removeRow,
  fetchCheckpointByPage,
} from './fetchDatabaseService';

const { ipcMain } = require('electron');

function initHandlers() {
  ipcMain.handle(FETCH_CHECKPOINT_ROWS_COUNT_CHANNEL,
    async (event, data) => fetchCheckpointRowsCount(global.knex, data));

  ipcMain.handle(ADD_ROW_CHANNEL,
    async (event, data) => {
      await addRow(global.knex, data);
    });

  ipcMain.handle(REMOVE_ROW_CHANNEL,
    async (event, data) => {
      await removeRow(global.knex, data);
    });

  ipcMain.handle(FETCH_CHECKPOINT_BY_PAGE_CHANNEL,
    async (event, data) => fetchCheckpointByPage(global.knex, data));
}

export {
  initHandlers,
};
