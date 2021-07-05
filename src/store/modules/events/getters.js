export const EVENTS = 'events/getEvents';

export const getters = {
  [EVENTS]: (state) => state.checkpointEventListForTable,
};
