import { getters } from './getters';
import { mutations } from './mutations';
import { actions } from './actions';

const initialAlerts = [
  {
    type: 'E-mail',
    address: 'test@test.ru',
  },
];

export const getInitialState = () => ({
  alerts: [...initialAlerts],
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
