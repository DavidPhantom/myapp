<template>
  <q-dialog v-model="editAlertModalWindowIsOpened">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Edit alert</div>
        <q-space />
        <q-btn editAlertModalWindowIsOpened="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section align="right">
        <form
          @submit.prevent.stop="edit"
          style="min-width: 240px"
        >
          <q-input
            v-model="email"
            filled type="email"
            :rules="[val => !!val || 'Email is missing', isValidEmail]"
          />

          <q-btn label="OK" type="submit" color="primary" />
        </form>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script>
import {
  EDIT_ALERT,
} from 'src/store/modules/alerts/actions';

import { isValidEmail } from 'src/utils/helper.js';

export default {
  name: 'AlertsEditor',
  data() {
    return {
      email: '',
      editAlertModalWindowIsOpened: false,
    };
  },
  methods: {
    isValidEmail,
    open(email, rowIdx) {
      this.email = email;
      this.editedRowIdx = rowIdx;
      this.editAlertModalWindowIsOpened = true;
    },
    edit() {
      this.$store.dispatch(EDIT_ALERT, {
        idx: this.editedRowIdx,
        address: this.email,
      });
      this.editAlertModalWindowIsOpened = false;
    },
  },
};
</script>
