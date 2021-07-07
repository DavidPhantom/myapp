import {
  FETCH_CHECKPOINT_CHANNEL,
  ADD_ROW_CHANNEL,
  REMOVE_ROW_CHANNEL,
} from 'app/src-electron/app/utils/invoke.types';
import {
  SET_EVENTS,
  SET_FILTER_PLATE,
  SET_FILTER_DATE,
  SET_NUMBER_PAGE,
  SET_ROWS_PER_PAGE,
} from './mutations';

const EVENTS_TABLE = 'events';

export const FETCH_CHECKPOINT_EVENTS = 'events/fetchCheckpointEvents';
export const ADD_EVENT = 'events/addEvent';
export const REMOVE_EVENT = 'events/removeEvent';
export const SAVE_FILTER_BY_PLATE = 'events/saveFilterByPlate';
export const SAVE_FILTER_BY_DATE = 'events/saveFilterByDate';
export const CURRENT_NUMBER_PAGE = 'events/currentNumberPage';
export const CURRENT_ROWS_PER_PAGE = 'events/rowsPerPage';

export const actions = {
  [FETCH_CHECKPOINT_EVENTS]: async (context) => {
    const events = await window.invoke(FETCH_CHECKPOINT_CHANNEL, EVENTS_TABLE);
    context.commit(SET_EVENTS, events);
  },
  [ADD_EVENT]: async (context, event) => {
    const data = { tableName: EVENTS_TABLE, rowTable: event };
    await window.invoke(ADD_ROW_CHANNEL, data);
    const events = await window.invoke(FETCH_CHECKPOINT_CHANNEL, EVENTS_TABLE);
    context.commit(SET_EVENTS, events);
  },
  [REMOVE_EVENT]: async (context, eventIndex) => {
    const data = { tableName: EVENTS_TABLE, rowIndex: eventIndex };
    await window.invoke(REMOVE_ROW_CHANNEL, data);
    const events = await window.invoke(FETCH_CHECKPOINT_CHANNEL, EVENTS_TABLE);
    context.commit(SET_EVENTS, events);
  },
  [SAVE_FILTER_BY_PLATE]: async (context, plate) => {
    context.commit(SET_FILTER_PLATE, plate);
  },
  [SAVE_FILTER_BY_DATE]: async (context, date) => {
    context.commit(SET_FILTER_DATE, date);
  },
  [CURRENT_NUMBER_PAGE]: async (context, page) => {
    context.commit(SET_NUMBER_PAGE, page);
  },
  [CURRENT_ROWS_PER_PAGE]: async (context, rowsPerPage) => {
    context.commit(SET_ROWS_PER_PAGE, rowsPerPage);
  },
};
