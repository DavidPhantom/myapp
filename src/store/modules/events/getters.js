export const EVENTS = 'events/getEvents';
export const ROWS = 'events/getRows';

export const getters = {
  [EVENTS]: (state) => state.events,
  [ROWS]: (state) => state.rows,
};
