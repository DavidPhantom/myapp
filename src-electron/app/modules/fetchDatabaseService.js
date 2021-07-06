import {
  setDate,
} from '../utils/helper';

async function fetchCheckpoint(knex, tableName) {
  const data = await knex(tableName)
    .orderBy('id', 'desc');
  const dataForTable = setDate(data);
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
