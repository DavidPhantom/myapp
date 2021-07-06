import { getters } from './getters';
import { mutations } from './mutations';
import { actions } from './actions';

export const getInitialState = () => ({
  events: [],
  rows: 5,
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
