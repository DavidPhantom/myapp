import { getters } from './getters';
import { mutations } from './mutations';
import { actions } from './actions';

export const getInitialState = () => ({
  allowList: [],
  rows: 5,
  page: 1,
  rowsNumber: 0,
  allowListFilter: '',
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
