import { getters } from './getters';
import { mutations } from './mutations';
import { actions } from './actions';

export const getInitialState = () => ({
  smtp: {
    login: 'test',
    password: 'test',
    port: 'test',
    email_from: 'test',
    host: 'test',
  },
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
