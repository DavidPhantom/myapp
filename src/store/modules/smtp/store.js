import { getters } from './getters';
import { mutations } from './mutations';
import { actions } from './actions';

export const getInitialState = () => ({
    smtp: {
        login: '',
        password: '',
        port: '',
        email_from: '',
        host: '',
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