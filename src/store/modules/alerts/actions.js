import {
  ADD_NEW_ALERT_MUTATION,
  UNSET_ALERT,
} from './mutations';

export const ADD_NEW_ALERT_ACTION = 'alerts/addNewAlert';
export const REMOVE_ALERT = 'alerts/removeAlert';

export const actions = {
  [ADD_NEW_ALERT_ACTION]: (context, address) => {
    context.commit(ADD_NEW_ALERT_MUTATION, address);
  },

  [REMOVE_ALERT]: (context, alertIdx) => {
    context.commit(UNSET_ALERT, alertIdx);
  },
};
