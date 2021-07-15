<template>
  <q-dialog v-model="addEventModalWindowIsOpened" v-on:keyup.enter="addEvent">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{$t('addEvent')}}</div>
        <q-space />
        <q-btn addEventModalWindowIsOpened="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <form class="common-form" v-on:submit.prevent="">
          <q-input
            type="text"
            :class="
                plateIsIncorrect && 'common-form__error-input'
              "
            :placeholder="$t('plateNumber')"
            v-model="plate"
            @input="handlePlate"
          />
          <div class="col-5">
            <q-input readonly outlined v-model="dateToInputValue">
              <template v-slot:append>
                <q-icon
                  name="close"
                  @click="clearDateFilter"
                  class="cursor-pointer"
                />
              </template>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date class="q-ma-xs" v-model="date"
                            mask="YYYY-MM-DD"
                            @input="handleDate">
                    </q-date>
                    <q-time class="q-ma-xs"
                      v-model="time"
                      format24h
                            mask="HH:MM"
                            @input="handleTime"
                    />
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup
                             unelevated no-caps
                             :label="$t('close')" color="primary" flat />
                    </div>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <q-input
            type="text"
            :class="
                cameraIsIncorrect && 'common-form__error-input'
              "
            :placeholder="$t('cameraName')"
            v-model="camera"
            @input="handleCamera"
          />
        </form>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn v-close-popup
               unelevated no-caps
               :label="$t('close')" color="primary" flat />
        <q-btn flat unelevated no-caps :label="$t('save')" color="primary" @click="addEvent" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {
  ADD_EVENT,
} from 'src/store/modules/events/actions';
import {
  convertToUnixTimestamp, getTodayUnixTimestamp,
  notifyGeneral,
} from '../../../src-electron/app/utils/helper';

export const messageEventAddSuccess = 'Event was added successfully';
export const messagePlateError = 'Enter plate number';
export const messageCameraError = 'Enter camera name';

export default {
  name: 'EventAdd',
  data() {
    return {
      addEventModalWindowIsOpened: false,
      dateToInputValue: '-',
      plate: '',
      camera: '',
      date: '',
      time: '',
      plateIsIncorrect: false,
      cameraIsIncorrect: false,
    };
  },
  methods: {
    show() {
      this.addEventModalWindowIsOpened = true;
    },
    handlePlate() {
      this.plateIsIncorrect = false;
    },
    handleCamera() {
      this.cameraIsIncorrect = false;
    },
    async clearDateFilter() {
      this.dateToInputValue = '-';
    },
    async addEvent() {
      if (this.checkPlateAndCamera()) {
        const dateEvent = await this.setDate();
        if (dateEvent) {
          const event = { plate: this.plate, date: dateEvent, camera: this.camera };
          await this.$store.dispatch(ADD_EVENT, event);
          await this.resetData();
          this.addEventModalWindowIsOpened = false;
          await this.notifyEventAddSuccess();
          await this.$emit('addEventSuccessfully');
        }
      }
      return false;
    },
    checkPlateAndCamera() {
      if (!this.plate) {
        this.plateIsIncorrect = true;
        this.notifyPlateError();
        return false;
      }
      if (!this.camera) {
        this.cameraIsIncorrect = true;
        this.notifyCameraError();
        return false;
      }
      return true;
    },
    async handleDate() {
      this.dateToInputValue = `${this.date}`;
    },
    async handleTime() {
      this.dateToInputValue = `${this.date} ${this.time}`;
    },
    setDate() {
      let dateEvent;
      if (!this.date || !this.time) {
        dateEvent = getTodayUnixTimestamp();
      } else {
        dateEvent = new Date(`${this.date} ${this.time}`).getTime();
        dateEvent = convertToUnixTimestamp(dateEvent);
      }
      return dateEvent;
    },
    resetData() {
      this.plate = '';
      this.camera = '';
      this.date = '';
      this.time = '';
    },
    async notifyEventAddSuccess() {
      await notifyGeneral(messageEventAddSuccess, 'green', this.$q);
    },
    async notifyPlateError() {
      await notifyGeneral(messagePlateError, 'red', this.$q);
    },
    async notifyCameraError() {
      await notifyGeneral(messageCameraError, 'red', this.$q);
    },
  },
};
</script>

<style scoped>

</style>
