export const SET_SMTP = 'SET_SMTP';
export const UPDATE_SMTP_MUTATION = 'UPDATE_SMTP_MUTATION';

export const mutations = {
  [SET_SMTP]: (state, data) => {
    /* eslint-disable */
    state.smtp = data[0];
  },

  [UPDATE_SMTP_MUTATION]: (state, smtp) => {
    state.smtp = smtp;
  },
};
