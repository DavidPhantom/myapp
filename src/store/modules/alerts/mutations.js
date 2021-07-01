export const ADD_NEW_ALERT_MUTATION = 'ADD_NEW_ALERT_MUTATION';
export const UNSET_ALERT = 'UNSET_ALERT';
export const CHANGE_ALERT = 'CHANGE_ALERT';

export const mutations = {
  [ADD_NEW_ALERT_MUTATION]: (state, address) => {
    state.alerts.push({
      id: state.alerts.length,
      type: 'E-mail',
      address,
    });
  },
  [UNSET_ALERT]: (state, alertIdx) => {
    state.alerts = [
      ...state.alerts.filter((row, idx) => idx !== alertIdx),
    ];
  },
  [CHANGE_ALERT]: (state, data) => {
    const { address, idx } = data;
    state.alerts[idx].address = address;
  },
};
