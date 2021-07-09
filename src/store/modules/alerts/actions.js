import {
  ADD_ROW_CHANNEL,
  REMOVE_ROW_CHANNEL,
  FETCH_CHECKPOINT_BY_PAGE_CHANNEL,
} from 'app/src-electron/app/utils/invoke.types';
import {
  SET_ALERTS,
  SET_NUMBER_PAGE,
  SET_ROWS_PER_PAGE,
  SET_ROWS_NUMBER,
  SET_FILTER_EMAIL,
} from './mutations';

const ALERTS_TABLE = 'alerts';

export const FETCH_CHECKPOINT_ALERTS_BY_PAGE = 'alerts/fetchCheckpointAlertsByPage';
export const ADD_ALERT = 'alerts/addAlert';
export const REMOVE_ALERT = 'alerts/removeAlert';
export const SAVE_FILTER_BY_EMAIL = 'alerts/saveFilterByEmail';

export const actions = {
  [FETCH_CHECKPOINT_ALERTS_BY_PAGE]: async (context, dataForAlertsByPage) => {
    const data = {
      tableName: ALERTS_TABLE,
      page: dataForAlertsByPage.pageNumber,
      rowsPerPage: dataForAlertsByPage.alertsPerPage,
      maskFilter: { column: 'address', mask: dataForAlertsByPage.emailFilter },
    };
    const alerts = await window.invoke(FETCH_CHECKPOINT_BY_PAGE_CHANNEL, data);
    alerts.tableByPage = alerts.tableByPage.map((el, key) => ({
      ...el,
      num: (dataForAlertsByPage.alertsPerPage * dataForAlertsByPage.pageNumber + 1) + key,
    }));

    context.commit(SET_ROWS_NUMBER, alerts.rowsCount);
    context.commit(SET_ALERTS, alerts.tableByPage);
    context.commit(SET_NUMBER_PAGE, dataForAlertsByPage.pageNumber + 1);
    context.commit(SET_ROWS_PER_PAGE, dataForAlertsByPage.alertsPerPage);
  },
  [ADD_ALERT]: async (context, alert) => {
    const data = { tableName: ALERTS_TABLE, rowTable: alert };
    await window.invoke(ADD_ROW_CHANNEL, data);
  },
  [REMOVE_ALERT]: async (context, alertIndex) => {
    const data = { tableName: ALERTS_TABLE, rowIndex: alertIndex };
    await window.invoke(REMOVE_ROW_CHANNEL, data);
  },
  [SAVE_FILTER_BY_EMAIL]: async (context, email) => {
    context.commit(SET_FILTER_EMAIL, email);
  },
};
