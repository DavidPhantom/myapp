export const ALERTS = 'alerts/getAlerts';
export const ROWS = 'alerts/getRows';
export const NUMBER_PAGE = 'alerts/getNumberPage';
export const ROWS_NUMBER = 'alerts/getRowsNumber';
export const EMAIL = 'alerts/getEmailFilter';

export const getters = {
  [ALERTS]: (state) => state.alerts,
  [ROWS]: (state) => state.rows,
  [NUMBER_PAGE]: (state) => state.page,
  [ROWS_NUMBER]: (state) => state.rowsNumber,
  [EMAIL]: (state) => state.emailFilter,
};
