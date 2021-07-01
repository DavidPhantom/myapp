import {
  ADD_NEW_ALERT_MUTATION,
  UNSET_ALERT,
  CHANGE_ALERT,
} from './mutations';

export const ADD_NEW_ALERT_ACTION = 'alerts/addNewAlert';
export const REMOVE_ALERT = 'alerts/removeAlert';
export const EDIT_ALERT = 'alerts/editAlert';

export const actions = {
  [ADD_NEW_ALERT_ACTION]: (context, address) => {
    context.commit(ADD_NEW_ALERT_MUTATION, address);
  },

  [REMOVE_ALERT]: (context, alertIdx) => {
    context.commit(UNSET_ALERT, alertIdx);
  },

  [EDIT_ALERT]: (context, data) => {
    context.commit(CHANGE_ALERT, data);
  },
};
