import {
  setDate,
} from '../utils/helper';

async function fetchCheckpointChannel(knex, tableName) {
  let dataForTable;
  function setData(data) {
    if (!data.length) {
      data = [];
      return data;
    }
    data = setDate(data);
    return data;
  }
  await knex(tableName)
    .orderBy('id', 'desc')
    .then((data) => {
      dataForTable = setData(data);
    });
  return dataForTable;
}

async function fetchCheckpointsAddChannel(knex, data) {
  await knex(data.tableName).insert(data.rowTable);
}

async function fetchCheckpointRemoveChannel(knex, data) {
  await knex(data.tableName).where('id', data.rowIndex).del();
}

export {
  fetchCheckpointChannel,
  fetchCheckpointsAddChannel, fetchCheckpointRemoveChannel,
};
