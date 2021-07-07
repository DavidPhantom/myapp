import {
  setDate,
} from '../utils/helper';

function filterByPlateAndDate({ plateFilter, dateFilter, tableName }, dataForTable) {
  if (plateFilter) {
    const mask = plateFilter.replace(/\*/g, '%');
    dataForTable = dataForTable.where(`${tableName}.plate`, 'like', `%${mask}%`);
  }
  if (dateFilter) {
    const { dateFrom, dateTo } = dateFilter;
    dataForTable = dataForTable.whereBetween(`${tableName}.date`, [dateFrom, dateTo]);
  }
  return dataForTable;
}

async function fetchCheckpointRowsByPage(knex,
  {
    tableName, rowsPerPage, page, plateFilter, dateFilter,
  }) {
  let dataRowsCount = knex(tableName);
  let dataTableRowsByPage = knex(tableName)
    .orderBy('id', 'desc');
  dataRowsCount = filterByPlateAndDate({
    plateFilter, dateFilter, tableName,
  }, dataRowsCount);
  dataTableRowsByPage = filterByPlateAndDate({
    plateFilter, dateFilter, tableName,
  }, dataTableRowsByPage);
  await dataTableRowsByPage.limit(rowsPerPage)
    .offset(page * rowsPerPage)
    .then((data) => {
      data = setDate(data);
      dataTableRowsByPage = data;
    });
  await dataRowsCount.count(`${tableName}.id`, { as: 'count' })
    .then((data) => {
      dataRowsCount = data[0].count;
    });
  return { rowsCount: dataRowsCount, tableByPage: dataTableRowsByPage };
}

async function addRow(knex,
  {
    tableName, rowTable,
  }) {
  await knex(tableName).insert(rowTable);
}

async function removeRow(knex,
  {
    tableName, rowIndex,
  }) {
  await knex(tableName).where('id', rowIndex).del();
}

export {
  addRow, removeRow,
  fetchCheckpointRowsByPage,
};
