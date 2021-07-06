import {
  FETCH_CHECKPOINT_CHANNEL,
  FETCH_CHECKPOINT_ADD_CHANNEL,
  FETCH_CHECKPOINT_REMOVE_CHANNEL,
} from '../utils/invoke.types';

import {
  fetchCheckpointChannel,
  fetchCheckpointsAddChannel,
  fetchCheckpointRemoveChannel,
} from './fetchDatabaseService';

const { ipcMain } = require('electron');

function initHandlers() {
  ipcMain.handle(FETCH_CHECKPOINT_CHANNEL,
    async (event, data) => fetchCheckpointChannel(global.knex, data));

  ipcMain.handle(FETCH_CHECKPOINT_ADD_CHANNEL,
    async (event, data) => {
      await fetchCheckpointsAddChannel(global.knex, data);
    });

  ipcMain.handle(FETCH_CHECKPOINT_REMOVE_CHANNEL,
    async (event, data) => {
      await fetchCheckpointRemoveChannel(global.knex, data);
    });
}

export {
  initHandlers,
};
