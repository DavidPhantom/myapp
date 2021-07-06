<template>
  <div class="q-pa-md">
    <q-btn label="Add event" color="primary" @click="addEventModalWindowIsOpened = true" />
    <q-dialog v-model="addEventModalWindowIsOpened" v-on:keyup.enter="addEvent">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Add event</div>
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
              placeholder="Plate Number"
              v-model="plate"
              @input="handlePlate"
            />
            <div class="q-pa-md">
              <q-date
                v-model="date"
                landscape
              />
            </div>
            <div class="q-pa-md">
              <q-time
                v-model="time"
                format24h
              />
            </div>
            <q-input
              type="text"
              :class="
                cameraIsIncorrect && 'common-form__error-input'
              "
              placeholder="Camera Name"
              v-model="camera"
              @input="handleCamera"
            />
          </form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" @click="addEvent" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-card-section>
      <q-input
        type="text"
        placeholder="Find Plate Number"
        v-model="filter.plateFilter"
        @input="handlePlateFilter"
      />
      <div class="q-pa-md">
        <q-date v-model="filter.dateFilter" range @input="handleDateFilter"/>
      </div>
    </q-card-section>
    <q-table
      title="Events"
      :data="eventsForTable"
      :columns="columns"
      row-key="name"
      :pagination.sync="pagination"
      :loading="loading"
      :filter="filter"
      @request="onRequest"
    >
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            color="negative"
            icon-right="delete"
            no-caps
            flat
            dense
            @click="removeEvent(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import {
  FETCH_CHECKPOINT_EVENTS,
  FETCH_CHECKPOINT_ADD_EVENTS,
  FETCH_CHECKPOINT_REMOVE_EVENTS,
} from 'src/store/modules/events/actions';

import { EVENTS, ROWS } from 'src/store/modules/events/getters';

import {
  convertToUnixTimestamp, getTodayUnixTimestamp,
  notifyGeneral, convertToTimestamp,
} from '../../src-electron/app/utils/helper';

export const messageEventAddSuccess = 'Event was added successfully';
export const messageEventRemoveSuccess = 'Event was removed successfully';
export const messagePlateError = 'Enter plate number';
export const messageCameraError = 'Enter camera name';
const toGetCount = 'count';
const toGetData = 'data';

export default {
  name: 'Events',
  data() {
    return {
      filter: { plateFilter: '', dateFilter: '' },
      loading: false,
      pagination: {
        page: 1,
        rowsPerPage: 0,
        rowsNumber: 0,
      },
      addEventModalWindowIsOpened: false,
      eventIndex: 0,
      plate: '',
      camera: '',
      date: '',
      time: '',
      plateIsIncorrect: false,
      cameraIsIncorrect: false,
      columns: [
        {
          name: 'id',
          required: true,
          label: 'ID',
          align: 'left',
          field: 'id',
          sortable: true,
        },
        {
          name: 'plate', align: 'center', label: 'Plate', field: 'plate', sortable: true,
        },
        {
          name: 'date', align: 'center', label: 'Date', field: 'date', sortable: true,
        },
        {
          name: 'camera', align: 'center', label: 'Camera', field: 'camera', sortable: true,
        },
        {
          name: 'action',
          label: 'Remove',
          align: 'center',
          field: 'action',
        },
      ],
      events: [],
      eventsForTable: [],
    };
  },
  async beforeMount() {
    await this.$store.dispatch(FETCH_CHECKPOINT_EVENTS);
    this.events = this.$store.getters[EVENTS];
    this.pagination.rowsPerPage = this.$store.getters[ROWS];
    this.onRequest({
      pagination: this.pagination,
      filter: { plateFilter: '', dateFilter: '' },
    });
  },
  methods: {
    onRequest(props) {
      const {
        page, rowsPerPage,
      } = props.pagination;
      this.loading = true;
      try {
        this.pagination.rowsNumber = this.getEventsNumberCount();
        const fetchCount = rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;
        const startRow = (page - 1) * rowsPerPage;
        const returnedData = this.fetchFromServerEventsData(startRow, fetchCount);
        this.eventsForTable.splice(0, this.eventsForTable.length, ...returnedData);
        this.pagination.page = page;
        this.pagination.rowsPerPage = rowsPerPage;
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },

    fetchFromServerEventsData(startEvent, count) {
      let data = [];
      if (!this.filter.plateFilter && !this.filter.dateFilter) {
        data = this.events;
      } else {
        data = this.getCountOrData(data, toGetData);
      }
      return data.slice(startEvent, startEvent + count);
    },

    getEventsNumberCount() {
      if (!this.filter.plateFilter && !this.filter.dateFilter) {
        return this.events.length;
      }
      const count = 0;
      return this.getCountOrData(count, toGetCount);
    },

    getCountOrData(countOrData, val) {
      if (this.filter.plateFilter && this.filter.dateFilter) {
        const carNumber = this.filter.plateFilter.replace(/\*/g, '.*');
        let date;
        this.events.forEach((event) => {
          date = convertToTimestamp(event.date);
          if (this.checkPlate(event.plate, carNumber) && this.checkDate(date)) {
            countOrData = this.switchCountOrData(countOrData, val, event);
          }
        });
        return countOrData;
      }
      if (this.filter.plateFilter) {
        const carNumber = this.filter.plateFilter.replace(/\*/g, '.*');
        this.events.forEach((event) => {
          if (this.checkPlate(event.plate, carNumber)) {
            countOrData = this.switchCountOrData(countOrData, val, event);
          }
        });
      }
      if (this.filter.dateFilter) {
        let date;
        this.events.forEach((event) => {
          date = convertToTimestamp(event.date);
          if (this.checkDate(date)) {
            countOrData = this.switchCountOrData(countOrData, val, event);
          }
        });
      }
      return countOrData;
    },

    switchCountOrData(countOrData, val, event) {
      switch (val) {
        case toGetCount:
          countOrData += 1;
          break;
        case toGetData:
          countOrData.push(event);
          break;
        default:
          countOrData += 1;
          break;
      }
      return countOrData;
    },

    checkPlate(plate, carNumber) {
      return plate.toUpperCase().match(carNumber.toUpperCase());
    },

    checkDate(date) {
      if (date >= this.filter.dateFilter.dateFrom
        && date <= this.filter.dateFilter.dateTo) return true;
      return false;
    },

    handlePlate() {
      this.plateIsIncorrect = false;
    },

    handleCamera() {
      this.cameraIsIncorrect = false;
    },

    async handlePlateFilter(e) {
      this.filter.plateFilter = e.target.value;
    },

    async handleDateFilter() {
      let date;
      if (this.filter.dateFilter) {
        const dateFrom = this.filter.dateFilter.from;
        const dateTo = this.filter.dateFilter.to;
        const dateFromTimeStamp = convertToTimestamp(dateFrom);
        const dateToTimeStamp = convertToTimestamp(dateTo) + 24 * 60 * 60;
        date = { dateFrom: dateFromTimeStamp, dateTo: dateToTimeStamp };
      } else {
        date = null;
      }
      this.filter.dateFilter = date;
    },

    async addEvent() {
      const dateEvent = await this.checkPlateCameraAndDate();
      if (dateEvent) {
        const event = { plate: this.plate, date: dateEvent, camera: this.camera };
        await this.$store.dispatch(FETCH_CHECKPOINT_ADD_EVENTS, event);
        this.events = this.$store.getters[EVENTS];
        this.onRequest({
          pagination: this.pagination,
        });
        await this.resetData();
        this.addEventModalWindowIsOpened = false;
        await this.notifyEventAddSuccess();
        return true;
      }

      return false;
    },

    async removeEvent(eventIndex) {
      await this.$store.dispatch(FETCH_CHECKPOINT_REMOVE_EVENTS, eventIndex);
      this.events = this.$store.getters[EVENTS];
      this.onRequest({
        pagination: this.pagination,
      });
      await this.notifyEventRemoveSuccess();
    },

    checkPlateCameraAndDate() {
      let dateEvent;
      if (!this.plate) {
        this.plateIsIncorrect = true;
        this.notifyPlateError();
        return null;
      }
      if (!this.camera) {
        this.cameraIsIncorrect = true;
        this.notifyCameraError();
        return null;
      }
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

    async notifyEventRemoveSuccess() {
      await notifyGeneral(messageEventRemoveSuccess, 'grey', this.$q);
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
