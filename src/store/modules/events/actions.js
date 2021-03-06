import {
  ADD_ROW_CHANNEL,
  REMOVE_ROW_CHANNEL,
  FETCH_CHECKPOINT_BY_PAGE_CHANNEL,
} from 'app/src-electron/app/utils/invoke.types';
import {
  SET_EVENTS,
  SET_FILTER_PLATE,
  SET_FILTER_DATE,
  SET_NUMBER_PAGE,
  SET_ROWS_PER_PAGE,
  SET_ROWS_NUMBER,
  SET_FILTER_BY_ALLOW_LIST,
} from './mutations';

const EVENTS_TABLE = 'events';

export const FETCH_CHECKPOINT_EVENTS_BY_PAGE = 'events/fetchCheckpointEventsByPage';
export const ADD_EVENT = 'events/addEvent';
export const REMOVE_EVENT = 'events/removeEvent';
export const SAVE_FILTER_BY_PLATE = 'events/saveFilterByPlate';
export const SAVE_FILTER_BY_DATE = 'events/saveFilterByDate';
export const SAVE_FILTER_BY_ALLOW_LIST = 'events/saveFilterByAllowList';

export const actions = {
  [FETCH_CHECKPOINT_EVENTS_BY_PAGE]: async (context, dataForEventsByPage) => {
    const data = {
      tableName: EVENTS_TABLE,
      page: dataForEventsByPage.pageNumber,
      rowsPerPage: dataForEventsByPage.eventsPerPage,
      maskFilter: { column: 'plate', mask: dataForEventsByPage.plateFilter },
      dateFilter: dataForEventsByPage.dateFilter,
      enableAllowList: dataForEventsByPage.enableAllowList,
    };
    const events = await window.invoke(FETCH_CHECKPOINT_BY_PAGE_CHANNEL, data);
    events.tableByPage = events.tableByPage.map((el, key) => ({
      ...el,
      num: (dataForEventsByPage.eventsPerPage * dataForEventsByPage.pageNumber + 1) + key,
    }));

    context.commit(SET_ROWS_NUMBER, events.rowsCount);
    context.commit(SET_EVENTS, events.tableByPage);
    context.commit(SET_NUMBER_PAGE, dataForEventsByPage.pageNumber + 1);
    context.commit(SET_ROWS_PER_PAGE, dataForEventsByPage.eventsPerPage);
  },
  [ADD_EVENT]: async (context, event) => {
    const data = { tableName: EVENTS_TABLE, rowTable: event };
    await window.invoke(ADD_ROW_CHANNEL, data);
  },
  [REMOVE_EVENT]: async (context, eventIndex) => {
    const data = { tableName: EVENTS_TABLE, rowIndex: eventIndex };
    await window.invoke(REMOVE_ROW_CHANNEL, data);
  },
  [SAVE_FILTER_BY_PLATE]: async (context, plate) => {
    context.commit(SET_FILTER_PLATE, plate);
  },
  [SAVE_FILTER_BY_DATE]: async (context, date) => {
    context.commit(SET_FILTER_DATE, date);
  },
  [SAVE_FILTER_BY_ALLOW_LIST]: async (context, enableAllowList) => {
    context.commit(SET_FILTER_BY_ALLOW_LIST, enableAllowList);
  },
};
