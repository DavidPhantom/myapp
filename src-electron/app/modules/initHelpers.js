import {
  ADD_ROW_CHANNEL,
  REMOVE_ROW_CHANNEL,
  FETCH_CHECKPOINT_BY_PAGE_CHANNEL,
} from '../utils/invoke.types';

import {
  addRow, removeRow,
  fetchCheckpointRowsByPage,
} from './invokeDatabaseService';

const { ipcMain } = require('electron');

function initHandlers() {
  ipcMain.handle(ADD_ROW_CHANNEL,
    async (event, data) => {
      await addRow(global.knex, data);
    });

  ipcMain.handle(REMOVE_ROW_CHANNEL,
    async (event, data) => {
      await removeRow(global.knex, data);
    });

  ipcMain.handle(FETCH_CHECKPOINT_BY_PAGE_CHANNEL,
    async (event, data) => fetchCheckpointRowsByPage(global.knex, data));
}

export {
  initHandlers,
};
