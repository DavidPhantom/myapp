import {
  setDate,
} from '../utils/helper';

function filterByPlateAndDate(data, dataForTable) {
  let mask; let dateFrom; let
    dateTo;
  if (data.plateFilter) {
    mask = data.plateFilter.replace(/\*/g, '%');
    dataForTable = dataForTable.where(`${data.tableName}.plate`, 'like', `%${mask}%`);
  }
  if (data.dateFilter) {
    dateFrom = data.dateFilter.dateFrom;
    dateTo = data.dateFilter.dateTo;
    dataForTable = dataForTable.whereBetween(`${data.tableName}.date`, [dateFrom, dateTo]);
  }
  return dataForTable;
}

async function fetchCheckpointRowsCount(knex, data) {
  let dataForTable = knex(data.tableName);
  dataForTable = filterByPlateAndDate(data, dataForTable);
  await dataForTable.count(`${data.tableName}.id`, { as: 'count' })
    .then((dataRowsCount) => {
      dataForTable = dataRowsCount[0].count;
    });
  return dataForTable;
}

async function fetchCheckpointByPage(knex, data) {
  let dataForTable = knex(data.tableName)
    .orderBy('id', 'desc');
  dataForTable = filterByPlateAndDate(data, dataForTable);
  await dataForTable.limit(data.rowsPerPage)
    .offset(data.page * data.rowsPerPage)
    .then((dataByPage) => {
      dataByPage = setDate(dataByPage);
      dataForTable = dataByPage;
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
  fetchCheckpointRowsCount, addRow, removeRow,
  fetchCheckpointByPage,
};
