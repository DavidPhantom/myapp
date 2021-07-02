<template>
  <div class="q-pa-md">
    <q-btn label="Add event" color="primary" @click="addRowModalWindowIsOpened = true" />
    <q-dialog v-model="addRowModalWindowIsOpened" v-on:keyup.enter="addEvent">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Add event</div>
          <q-space />
          <q-btn addRowModalWindowIsOpened="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <form class="common-form" v-on:submit.prevent="">
            <input
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
            <input
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
        <input
          type="text"
          placeholder="Find Plate Number"
          v-model="plateSearch"
          @input="handleCarNumber"
        />
      <div class="q-pa-md">
        <q-date v-model="calendarDate" range @input="handleCalendarDate"/>
      </div>
    </q-card-section>
    <q-table
      title="Events"
      :data="events"
      :columns="columns"
      row-key="name"
      hide-bottom
    >
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <!--<q-btn
            color="blue"
            icon-right="edit"
            no-caps
            flat
            dense
            @click="[editRowModalWindowIsOpened = true, editRow(props.row)]"
          />
          <q-dialog v-model="editRowModalWindowIsOpened" v-on:keyup.enter="editEvent">
            <q-card>
              <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">Edit event</div>
                <q-space />
                <q-btn editRowModalWindowIsOpened="close" flat round dense v-close-popup />
              </q-card-section>

              <q-card-section>
                <form class="common-form" v-on:submit.prevent="">
                  <input
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
                  <input
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
                <q-btn flat label="OK" color="primary" @click="editEvent" />
              </q-card-actions>
            </q-card>
          </q-dialog>-->
          <q-btn
            color="negative"
            icon-right="delete"
            no-caps
            flat
            dense
            @click="removeRow(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>
    <div class="q-pa-lg flex flex-center">
      <q-pagination
        v-model="current"
        :max="pagesNum"
        direction-links
        @input="handlePage"
      />
    </div>
  </div>
</template>

<script>

import {
  FETCH_CHECKPOINT_EVENTS,
  FETCH_CHECKPOINT_EVENTS_BY_PAGE_NUM,
  FETCH_CHECKPOINT_EVENTS_ADD_EVENT,
  FETCH_CHECKPOINT_EVENTS_EDIT_EVENT,
  FETCH_CHECKPOINT_EVENTS_REMOVE_EVENT,
  FETCH_CHECKPOINT_EVENTS_FILTER,
  SET_FILTER_PLATE, SET_FILTER_DATE,
  convertToUnixTimestamp, getTodayUnixTimestamp,
  generateYearMonthAndDateFromJSTimestamp,
  generateHoursMinutesAndSecondsFromJSTimestamp,
  notifyGeneral, convertToTimestamp,
} from '../../src-electron/app/utils/helper';

export const messageEventAddSuccess = 'Event was added successfully';
export const messageEventEditSuccess = 'Event was edited successfully';
export const messageEventRemoveSuccess = 'Event was removed successfully';
export const messagePlateError = 'Enter plate number';
export const messageCameraError = 'Enter camera name';

export default {
  name: 'Events',
  data() {
    return {
      addRowModalWindowIsOpened: false,
      editRowModalWindowIsOpened: false,
      current: 1,
      page: 0,
      pagesNum: 0,
      countEvents: 0,
      rowIdx: 0,
      plate: '',
      camera: '',
      date: '',
      time: '',
      plateSearch: '',
      calendarDate: { from: '', to: '' },
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
  async beforeMount() {
    const data = await window.invoke(FETCH_CHECKPOINT_EVENTS);
    this.events = data.checkpointEventListForTable;
    await this.setPagesNumAndCountEvents(data);
  },

  methods: {
    async addEvent() {
      const dateForRow = await this.checkPlateCameraAndDate();
      if (dateForRow) {
        const row = { plate: this.plate, date: dateForRow, camera: this.camera };
        const data = await window.invoke(FETCH_CHECKPOINT_EVENTS_ADD_EVENT, row);
        await this.setPagesNumAndCountEvents(data);
        await this.changeVisibleTableContent(this.page - 1);
        await this.resetData();
        this.addRowModalWindowIsOpened = false;
        await this.notifyEventAddSuccess();
        return true;
      }

      return false;
    },

    async editEvent() {
      const dateForRow = await this.checkPlateCameraAndDate();
      if (dateForRow) {
        const row = { plate: this.plate, date: dateForRow, camera: this.camera };
        const dataLocal = { curRowIdx: this.rowIdx, curRow: row };
        await window.invoke(FETCH_CHECKPOINT_EVENTS_EDIT_EVENT, dataLocal);
        await this.changeVisibleTableContent(this.page - 1);
        await this.resetData();
        this.editRowModalWindowIsOpened = false;
        await this.notifyEventEditSuccess();
        return true;
      }

      return false;
    },

    handlePage(e) {
      this.page = e;
      this.changeVisibleTableContent(this.page - 1);
    },

    handlePlate() {
      this.plateIsIncorrect = false;
    },

    handleCamera() {
      this.cameraIsIncorrect = false;
    },

    async handleCarNumber(e) {
      await this.setFilterAndFilterData(SET_FILTER_PLATE, e.target.value);
    },

    async handleCalendarDate() {
      let date;
      if (this.calendarDate) {
        const dateFrom = this.calendarDate.from;
        const dateTo = this.calendarDate.to;
        const dateFromInt = convertToTimestamp(dateFrom);
        const dateToInt = convertToTimestamp(dateTo) + 24 * 60 * 60;
        date = { dateFrom: dateFromInt, dateTo: dateToInt };
      } else {
        date = null;
      }
      await this.setFilterAndFilterData(SET_FILTER_DATE, date);
    },

    editRow(row) {
      this.rowIdx = row.id;
      this.plate = row.plate;
      const dateForRow = new Date(`${row.date}`);
      this.date = generateYearMonthAndDateFromJSTimestamp(dateForRow);
      this.time = generateHoursMinutesAndSecondsFromJSTimestamp(dateForRow);
      this.camera = row.camera;
    },

    async removeRow(rowIdx) {
      const data = await window.invoke(FETCH_CHECKPOINT_EVENTS_REMOVE_EVENT, rowIdx);
      await this.setPagesNumAndCountEvents(data);
      await this.changeVisibleTableContent(this.page - 1);
      await this.notifyEventRemoveSuccess();
    },

    async setFilterAndFilterData(filter, filterData) {
      await window.invoke(filter, filterData);
      const data = await window.invoke(FETCH_CHECKPOINT_EVENTS_FILTER);
      await this.setPagesNumAndCountEvents(data);
      await this.changeVisibleTableContent(this.page - 1);
    },

    async changeVisibleTableContent(page) {
      const data = await window.invoke(FETCH_CHECKPOINT_EVENTS_BY_PAGE_NUM, page);
      this.events = data.checkpointEventListForTable;
    },

    checkPlateCameraAndDate() {
      let dateForRow;
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
        dateForRow = getTodayUnixTimestamp();
      } else {
        dateForRow = new Date(`${this.date} ${this.time}`).getTime();
        dateForRow = convertToUnixTimestamp(dateForRow);
      }
      return dateForRow;
    },

    resetData() {
      this.plate = '';
      this.camera = '';
      this.date = '';
      this.time = '';
    },

    setPagesNumAndCountEvents(data) {
      this.pagesNum = data.checkpointEventsPagesNum;
      this.countEvents = data.checkpointEventsNum;
    },

    async notifyEventAddSuccess() {
      await notifyGeneral(messageEventAddSuccess, 'green', this.$q);
    },

    async notifyEventEditSuccess() {
      await notifyGeneral(messageEventEditSuccess, 'blue', this.$q);
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
