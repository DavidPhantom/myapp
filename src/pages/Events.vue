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
      :data="events"
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
  FETCH_CHECKPOINT_EVENTS_COUNT,
  ADD_EVENT, REMOVE_EVENT,
  SAVE_FILTER_BY_PLATE, SAVE_FILTER_BY_DATE,
  FETCH_CHECKPOINT_EVENTS_BY_PAGE,
} from 'src/store/modules/events/actions';
import {
  EVENTS, PLATE, ROWS, DATE, NUMBER_PAGE, ROWS_NUMBER,
} from 'src/store/modules/events/getters';
import {
  convertToUnixTimestamp, getTodayUnixTimestamp,
  notifyGeneral, convertToTimestamp,
} from '../../src-electron/app/utils/helper';

export const messageEventAddSuccess = 'Event was added successfully';
export const messageEventRemoveSuccess = 'Event was removed successfully';
export const messagePlateError = 'Enter plate number';
export const messageCameraError = 'Enter camera name';
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
    };
  },
  created() {
    this.filter.plateFilter = this.$store.getters[PLATE];
    this.filter.dateFilter = this.$store.getters[DATE];
  },
  async beforeMount() {
    this.pagination.rowsPerPage = this.$store.getters[ROWS];
    this.pagination.page = this.$store.getters[NUMBER_PAGE];
    await this.onRequest({
      pagination: this.pagination,
    });
  },
  methods: {
    async onRequest(props) {
      const {
        page, rowsPerPage,
      } = props.pagination;
      this.loading = true;
      try {
        const dataForEventsCount = {
          plateFilter: this.filter.plateFilter,
          dateFilter: this.filter.dateFilter,
        };
        await this.$store.dispatch(FETCH_CHECKPOINT_EVENTS_COUNT, dataForEventsCount);
        this.pagination.rowsNumber = this.$store.getters[ROWS_NUMBER];
        const dataForEventsByPage = {
          pageNumber: page - 1,
          eventsPerPage: rowsPerPage,
          plateFilter: this.filter.plateFilter,
          dateFilter: this.filter.dateFilter,
        };
        await this.$store.dispatch(FETCH_CHECKPOINT_EVENTS_BY_PAGE, dataForEventsByPage);
      } catch (e) {
        console.error(e);
      } finally {
        this.events = await this.$store.getters[EVENTS];
        this.pagination.page = page;
        this.pagination.rowsPerPage = rowsPerPage;
        this.loading = false;
      }
    },
    handlePlate() {
      this.plateIsIncorrect = false;
    },
    handleCamera() {
      this.cameraIsIncorrect = false;
    },
    async handlePlateFilter(val) {
      this.filter.plateFilter = val;
      await this.$store.dispatch(SAVE_FILTER_BY_PLATE, this.filter.plateFilter);
    },
    async handleDateFilter() {
      let date;
      let dateFrom;
      let dateTo;
      if (this.filter.dateFilter) {
        if (this.filter.dateFilter.from && this.filter.dateFilter.to) {
          dateFrom = this.filter.dateFilter.from;
          dateTo = this.filter.dateFilter.to;
        } else {
          dateFrom = this.filter.dateFilter;
          dateTo = dateFrom;
        }
        const dateFromTimeStamp = convertToTimestamp(dateFrom);
        const dateToTimeStamp = convertToTimestamp(dateTo) + 24 * 60 * 60;
        date = {
          dateFrom: dateFromTimeStamp,
          dateTo: dateToTimeStamp,
        };
      } else {
        date = '';
      }
      this.filter.dateFilter = date;
      await this.$store.dispatch(SAVE_FILTER_BY_DATE, this.filter.dateFilter);
    },
    async addEvent() {
      if (this.checkPlateAndCamera()) {
        const dateEvent = await this.setDate();
        if (dateEvent) {
          const event = { plate: this.plate, date: dateEvent, camera: this.camera };
          await this.$store.dispatch(ADD_EVENT, event);
          await this.onRequest({
            pagination: this.pagination,
          });
          await this.resetData();
          this.addEventModalWindowIsOpened = false;
          await this.notifyEventAddSuccess();
          return true;
        }
      }
      return false;
    },
    async removeEvent(eventIndex) {
      await this.$store.dispatch(REMOVE_EVENT, eventIndex);
      await this.onRequest({
        pagination: this.pagination,
      });
      await this.notifyEventRemoveSuccess();
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
