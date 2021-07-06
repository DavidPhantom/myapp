export const SET_EVENTS = 'SET_EVENTS';
export const SET_FILTER_PLATE = 'SET_FILTER_PLATE';
export const SET_FILTER_DATE = 'SET_FILTER_DATE';
export const SET_NUMBER_PAGE = 'SET_NUMBER_PAGE';

export const mutations = {
  [SET_EVENTS]: (state, events) => {
    state.events = events;
  },
  [SET_FILTER_PLATE]: (state, plate) => {
    state.plateFilter = plate;
  },
  [SET_FILTER_DATE]: (state, date) => {
    state.dateFilter = date;
  },
  [SET_NUMBER_PAGE]: (state, page) => {
    state.page = page;
  },
};
