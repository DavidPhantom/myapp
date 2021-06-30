import { getters } from './getters';
import { mutations } from './mutations';
import { actions } from './actions';

const initialAlerts = [
  {
    id: 0,
    type: 'E-mail',
    address: 'test@test.ru',
  },
  {
    id: 1,
    type: 'E-mail',
    address: 'awd@test.ru',
  },
  {
    id: 2,
    type: 'E-mail',
    address: '123@test.ru',
  },
  {
    id: 3,
    type: 'E-mail',
    address: 'tddddest@test.ru',
  },
  {
    id: 4,
    type: 'E-mail',
    address: 'hi@test.ru',
  },
  {
    id: 5,
    type: 'E-mail',
    address: 'test@test.ru',
  },
  {
    id: 6,
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
