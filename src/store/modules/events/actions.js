import {
  FETCH_CHECKPOINT_CHANNEL,
  FETCH_CHECKPOINT_ADD_CHANNEL,
  FETCH_CHECKPOINT_REMOVE_CHANNEL,
} from 'app/src-electron/app/utils/invoke.types';
import {
  SET_EVENTS,
} from './mutations';

const EVENTS_TABLE = 'events';

export const FETCH_CHECKPOINT_EVENTS = 'events/fetchCheckpointEvents';
export const FETCH_CHECKPOINT_ADD_EVENTS = 'events/fetchCheckpointEventsAddEvent';
export const FETCH_CHECKPOINT_REMOVE_EVENTS = 'events/fetchCheckpointEventsRemoveEvent';

export const actions = {
  [FETCH_CHECKPOINT_EVENTS]: async (context) => {
    const events = await window.invoke(FETCH_CHECKPOINT_CHANNEL, EVENTS_TABLE);
    context.commit(SET_EVENTS, events);
  },
  [FETCH_CHECKPOINT_ADD_EVENTS]: async (context, event) => {
    const data = { tableName: EVENTS_TABLE, rowTable: event };
    await window.invoke(FETCH_CHECKPOINT_ADD_CHANNEL, data);
    const events = await window.invoke(FETCH_CHECKPOINT_CHANNEL, EVENTS_TABLE);
    context.commit(SET_EVENTS, events);
  },
  [FETCH_CHECKPOINT_REMOVE_EVENTS]: async (context, eventIndex) => {
    const data = { tableName: EVENTS_TABLE, rowIndex: eventIndex };
    await window.invoke(FETCH_CHECKPOINT_REMOVE_CHANNEL, data);
    const events = await window.invoke(FETCH_CHECKPOINT_CHANNEL, EVENTS_TABLE);
    context.commit(SET_EVENTS, events);
  },
};
