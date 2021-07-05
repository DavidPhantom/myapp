import {
  SET_EVENTS,
  ADD_NEW_EVENT_MUTATION,
  UNSET_EVENT,
} from './mutations';

export const FETCH_CHECKPOINT_EVENTS = 'events/fetchCheckpointEvents';
export const FETCH_CHECKPOINT_ADD_EVENTS = 'events/fetchCheckpointEventsAddEvent';
export const FETCH_CHECKPOINT_REMOVE_EVENTS = 'events/fetchCheckpointEventsRemoveEvent';

export const actions = {
  [FETCH_CHECKPOINT_EVENTS]: (context, events) => {
    context.commit(SET_EVENTS, events);
  },
  [FETCH_CHECKPOINT_ADD_EVENTS]: (context, event) => {
    context.commit(ADD_NEW_EVENT_MUTATION, event);
  },
  [FETCH_CHECKPOINT_REMOVE_EVENTS]: (context, eventIndex) => {
    context.commit(UNSET_EVENT, eventIndex);
  },
};
