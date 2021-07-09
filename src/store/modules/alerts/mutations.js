export const SET_ALERTS = 'SET_ALERTS';
export const SET_NUMBER_PAGE = 'SET_NUMBER_PAGE';
export const SET_ROWS_PER_PAGE = 'SET_ROWS_PER_PAGE';
export const SET_ROWS_NUMBER = 'SET_ROWS_NUMBER';
export const SET_FILTER_EMAIL = 'SET_FILTER_EMAIL';

export const mutations = {
  [SET_ALERTS]: (state, alerts) => {
    state.alerts = alerts;
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
  [SET_FILTER_EMAIL]: (state, email) => {
    state.emailFilter = email;
  },
};
