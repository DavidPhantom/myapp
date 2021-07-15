<template>
  <q-dialog v-model="addAllowListModalWindowIsOpened" v-on:keyup.enter="addAllowList">
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
                allowPlateIsIncorrect && 'common-form__error-input'
              "
            :placeholder="$t('plateNumber')"
            v-model="allowPlate"
            @input="handleAllowList"
          />
        </form>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn v-close-popup
               unelevated no-caps
               :label="$t('close')" color="primary" flat />
        <q-btn flat unelevated no-caps :label="$t('save')" color="primary" @click="addAllowList" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {
  ADD_ALLOW_PLATE,
} from 'src/store/modules/allowList/actions';
import {
  notifyGeneral,
} from '../../../src-electron/app/utils/helper';

export const messageAllowPlateAddSuccess = 'Allow plate was added successfully';
export const messageAllowPlateError = 'Enter correct allow plate';

export default {
  name: 'EventAdd',
  data() {
    return {
      addAllowListModalWindowIsOpened: false,
      allowPlateIsIncorrect: false,
      allowPlate: '',
    };
  },
  methods: {
    show() {
      this.addAllowListModalWindowIsOpened = true;
    },
    handleAllowList() {
      this.allowPlateIsIncorrect = false;
    },
    async addAllowList() {
      if (this.checkAllowPlate()) {
        const allowPLate = { plate: this.allowPlate };
        await this.$store.dispatch(ADD_ALLOW_PLATE, allowPLate);
        this.allowPlate = '';
        this.addAllowListModalWindowIsOpened = false;
        await this.notifyAllowPlateAddSuccess();
        await this.$emit('addAllowListSuccessfully');
        return true;
      }
      return false;
    },
    checkAllowPlate() {
      if (!this.allowPlate) {
        this.allowPlateIsIncorrect = true;
        this.notifyAllowPlateError();
        return false;
      }
      return true;
    },
    async notifyAllowPlateError() {
      await notifyGeneral(messageAllowPlateError, 'red', this.$q);
    },
    async notifyAllowPlateAddSuccess() {
      await notifyGeneral(messageAllowPlateAddSuccess, 'green', this.$q);
    },
  },
};
</script>

<style scoped>

</style>
