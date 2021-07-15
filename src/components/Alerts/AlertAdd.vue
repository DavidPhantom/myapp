<template>
  <q-dialog v-model="addAlertModalWindowIsOpened" v-on:keyup.enter="addAlert">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{$t('addAlert')}}</div>
        <q-space />
        <q-btn addAlertModalWindowIsOpened="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <form class="common-form" v-on:submit.prevent="">
          <q-input
            type="email"
            :class="
                emailIsIncorrect && 'common-form__error-input'
              "
            placeholder="email"
            v-model="email"
            @input="handleEmail"
          />
        </form>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn v-close-popup
               unelevated no-caps
               :label="$t('close')" color="primary" flat />
        <q-btn flat unelevated no-caps :label="$t('save')" color="primary" @click="addAlert" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ADD_ALERT } from 'src/store/modules/alerts/actions';
import {
  notifyGeneral,
} from '../../../src-electron/app/utils/helper';

export const messageAlertAddSuccess = 'Alert was added successfully';
export const messageEmailError = 'Enter correct email';

export default {
  name: 'EventAdd',
  data() {
    return {
      addAlertModalWindowIsOpened: false,
      emailIsIncorrect: false,
      email: '',
    };
  },
  methods: {
    show() {
      this.addAlertModalWindowIsOpened = true;
    },
    handleEmail() {
      this.emailIsIncorrect = false;
    },
    async addAlert() {
      if (this.checkEmail()) {
        const alert = { type: 'Email', address: this.email };
        await this.$store.dispatch(ADD_ALERT, alert);
        this.email = '';
        this.addAlertModalWindowIsOpened = false;
        await this.notifyAlertAddSuccess();
        await this.$emit('addAlertSuccessfully');
        return true;
      }
      return false;
    },
    checkEmail() {
      if (!this.email.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)) {
        this.emailIsIncorrect = true;
        this.notifyEmailError();
        return false;
      }
      return true;
    },
    async notifyEmailError() {
      await notifyGeneral(messageEmailError, 'red', this.$q);
    },
    async notifyAlertAddSuccess() {
      await notifyGeneral(messageAlertAddSuccess, 'green', this.$q);
    },
  },
};
</script>

<style scoped>

</style>
