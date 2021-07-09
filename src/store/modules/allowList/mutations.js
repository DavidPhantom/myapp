export const SET_ALLOW_LIST = 'SET_ALLOW_LIST';
export const SET_NUMBER_PAGE = 'SET_NUMBER_PAGE';
export const SET_ROWS_PER_PAGE = 'SET_ROWS_PER_PAGE';
export const SET_ROWS_NUMBER = 'SET_ROWS_NUMBER';
export const SET_FILTER_ALLOW_PLATE = 'SET_FILTER_ALLOW_PLATE';

export const mutations = {
  [SET_ALLOW_LIST]: (state, allowList) => {
    state.allowList = allowList;
  },
  [SET_NUMBER_PAGE]: (state, page) => {
    state.page = page;
  },
  [SET_ROWS_PER_PAGE]: (state, rowsPerPage) => {
    state.rows = rowsPerPage;
  },
  [SET_ROWS_NUMBER]: (state, rowsNumber) => {
    state.rowsNumber = rowsNumber;
  },
  [SET_FILTER_ALLOW_PLATE]: (state, allowPlateFilter) => {
    state.allowListFilter = allowPlateFilter;
  },
};
