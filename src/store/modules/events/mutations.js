export const SET_EVENTS = 'SET_EVENTS';
export const ADD_NEW_EVENT_MUTATION = 'ADD_NEW_EVENT_MUTATION';
export const UNSET_EVENT = 'UNSET_EVENT';

export const mutations = {
  [SET_EVENTS]: (state, events) => {
    state.checkpointEventListForTable = events;
  },
  [ADD_NEW_EVENT_MUTATION]: (state, event) => {
    state.checkpointEventListForTable.push({
      id: state.checkpointEventListForTable.length,
      plate: event.plate,
      date: event.date,
      camera: event.camera,
    });
  },
  [UNSET_EVENT]: (state, eventIndex) => {
    state.checkpointEventListForTable = [
      ...state.checkpointEventListForTable.filter((row, idx) => idx !== eventIndex),
    ];
  },
};
