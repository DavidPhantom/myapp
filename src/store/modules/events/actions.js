import {
  FETCH_CHECKPOINT_CHANNEL,
  ADD_ROW_CHANNEL,
  REMOVE_ROW_CHANNEL,
} from 'app/src-electron/app/utils/invoke.types';
import {
  SET_EVENTS,
} from './mutations';

const EVENTS_TABLE = 'events';

export const FETCH_CHECKPOINT_EVENTS = 'events/fetchCheckpointEvents';
export const ADD_EVENT = 'events/addEvent';
export const REMOVE_EVENT = 'events/removeEvent';

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
};
