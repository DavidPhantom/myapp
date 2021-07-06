export const EVENTS = 'events/getEvents';
export const ROWS = 'events/getRows';
export const PLATE = 'events/getPlate';
export const DATE = 'events/getDate';
export const NUMBER_PAGE = 'events/getNumberPage';

export const getters = {
  [EVENTS]: (state) => state.events,
  [ROWS]: (state) => state.rows,
  [PLATE]: (state) => state.plateFilter,
  [DATE]: (state) => state.dateFilter,
  [NUMBER_PAGE]: (state) => state.page,
};
