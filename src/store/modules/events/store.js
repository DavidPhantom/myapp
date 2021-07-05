import { getters } from './getters';
import { mutations } from './mutations';
import { actions } from './actions';

export const getInitialState = () => ({
  checkpointEventListForTable: [],
  rows: 5,
  page: 0,
  plateFilterVal: null,
  dateFilterVal: null,
});

const state = {
  ...getInitialState(),
};

export default {
  state,
  getters,
  mutations,
  actions,
};
