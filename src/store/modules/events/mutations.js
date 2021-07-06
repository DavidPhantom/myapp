export const SET_EVENTS = 'SET_EVENTS';

export const mutations = {
  [SET_EVENTS]: (state, events) => {
    state.events = events;
  },
};
