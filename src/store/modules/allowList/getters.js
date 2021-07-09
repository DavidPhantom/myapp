export const ALLOW_LIST = 'allowList/getAllowList';
export const ROWS = 'allowList/getRows';
export const NUMBER_PAGE = 'allowList/getNumberPage';
export const ROWS_NUMBER = 'allowList/getRowsNumber';
export const ALLOW_PLATE = 'allowList/getAllowPlateFilter';

export const getters = {
  [ALLOW_LIST]: (state) => state.allowList,
  [ROWS]: (state) => state.rows,
  [NUMBER_PAGE]: (state) => state.page,
  [ROWS_NUMBER]: (state) => state.rowsNumber,
  [ALLOW_PLATE]: (state) => state.allowListFilter,
};
