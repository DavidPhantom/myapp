import {
  FETCH_CHECKPOINT_CHANNEL,
  ADD_ROW_CHANNEL,
  REMOVE_ROW_CHANNEL,
} from '../utils/invoke.types';

import {
  fetchCheckpoint, addRow, removeRow,
} from './fetchDatabaseService';

const { ipcMain } = require('electron');

function initHandlers() {
  ipcMain.handle(FETCH_CHECKPOINT_CHANNEL,
    async (event, data) => fetchCheckpoint(global.knex, data));

  ipcMain.handle(ADD_ROW_CHANNEL,
    async (event, data) => {
      await addRow(global.knex, data);
    });

  ipcMain.handle(REMOVE_ROW_CHANNEL,
    async (event, data) => {
      await removeRow(global.knex, data);
    });
}

export {
  initHandlers,
};
