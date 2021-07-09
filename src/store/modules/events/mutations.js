export const SET_EVENTS = 'SET_EVENTS';
export const SET_FILTER_PLATE = 'SET_FILTER_PLATE';
export const SET_FILTER_DATE = 'SET_FILTER_DATE';
export const SET_NUMBER_PAGE = 'SET_NUMBER_PAGE';
export const SET_ROWS_PER_PAGE = 'SET_ROWS_PER_PAGE';
export const SET_ROWS_NUMBER = 'SET_ROWS_NUMBER';
export const SET_FILTER_BY_ALLOW_LIST = 'SET_FILTER_BY_ALLOW_LIST';

export const mutations = {
  [SET_EVENTS]: (state, events) => {
    state.events = events;
  },
  [SET_FILTER_PLATE]: (state, plate) => {
    state.plateFilter = plate;
  },
  [SET_FILTER_DATE]: (state, date) => {
    state.dateFilter = date;
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
  [SET_FILTER_BY_ALLOW_LIST]: (state, enableAllowList) => {
    state.enableAllowList = enableAllowList;
  },
};
