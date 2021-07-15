import {
  setDate,
} from '../utils/helper';

function filterByMaskDateAllowList({
  maskFilter, dateFilter, tableName, enableAllowList,
}, dataForTable) {
  if (maskFilter.mask) {
    const mask = maskFilter.mask.replace(/\*/g, '%');
    dataForTable = dataForTable.where(`${tableName}.${maskFilter.column}`, 'like', `%${mask}%`);
  }
  if (dateFilter) {
    const { dateFrom, dateTo } = dateFilter;
    dataForTable = dataForTable.whereBetween(`${tableName}.date`, [dateFrom, dateTo]);
  }
  if (enableAllowList) {
    dataForTable = dataForTable.select({
      id: `${tableName}.id`,
      plate: `${tableName}.plate`,
      date: `${tableName}.date`,
      camera: `${tableName}.camera`,
    }).join('allowList', `${tableName}.plate`, '=', 'allowList.plate');
  }
  return dataForTable;
}

async function fetchCheckpointRowsByPage(knex,
  {
    tableName, rowsPerPage, page, maskFilter = { column: '', mask: '' }, dateFilter = '',
    enableAllowList = false,
  }) {
  let dataRowsCount = knex(tableName);
  let dataTableRowsByPage = knex(tableName)
    .orderBy('id', 'desc');
  dataRowsCount = filterByMaskDateAllowList({
    maskFilter, dateFilter, tableName, enableAllowList,
  }, dataRowsCount);
  dataTableRowsByPage = filterByMaskDateAllowList({
    maskFilter, dateFilter, tableName, enableAllowList,
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
