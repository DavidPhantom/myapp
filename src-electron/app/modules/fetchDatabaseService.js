import {
  setDate,
} from '../utils/helper';

async function fetchCheckpoint(knex, tableName) {
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

async function addRow(knex, data) {
  await knex(data.tableName).insert(data.rowTable);
}

async function removeRow(knex, data) {
  await knex(data.tableName).where('id', data.rowIndex).del();
}

export {
  fetchCheckpoint, addRow, removeRow,
};
