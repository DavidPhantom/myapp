import { knex } from '@/client';

import { SET_SMTP, UPDATE_SMTP_MUTATION } from './mutations';

export const FETCH_SMTP = 'example/fetchSmtp';
export const UPDATE_SMTP_ACTION = 'example/updateSmtp';


export const actions = {
    [FETCH_SMTP]: async (context) => {
        knex('smtp')
            .then(data => {
                context.commit(SET_SMTP, data);
            });
    },

    [UPDATE_SMTP_ACTION]: async (context, smtp) => {
        const res = await knex('smtp')
            .where({ id: 1 })
            .update(smtp);
        context.commit(UPDATE_SMTP_MUTATION, smtp);
        return res;
    },
};
