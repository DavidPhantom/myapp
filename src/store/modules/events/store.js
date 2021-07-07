import { getters } from './getters';
import { mutations } from './mutations';
import { actions } from './actions';

export const getInitialState = () => ({
  events: [],
  rows: 5,
  plateFilter: '',
  dateFilter: '',
  page: 1,
  rowsNumber: 0,
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
