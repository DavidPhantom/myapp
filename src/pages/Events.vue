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
              type="plate"
              :class="
                plateIsIncorrect && 'common-form__error-input'
              "
              placeholder="plate"
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
              type="camera"
              :class="
                cameraIsIncorrect && 'common-form__error-input'
              "
              placeholder="camera"
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
    <q-table
      title="Events"
      :data="events"
      :columns="columns"
      row-key="name"
      hide-bottom
    >
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
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
                    type="plate"
                    :class="
                plateIsIncorrect && 'common-form__error-input'
              "
                    placeholder="plate"
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
                    type="camera"
                    :class="
                cameraIsIncorrect && 'common-form__error-input'
              "
                    placeholder="camera"
                    v-model="camera"
                    @input="handleCamera"
                  />
                </form>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="OK" color="primary" @click="editEvent" />
              </q-card-actions>
            </q-card>
          </q-dialog>
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
  convertToUnixTimestamp, getTodayUnixTimestamp,
  generateYearMonthAndDateFromJSTimestamp,
  generateHoursMinutesAndSecondsFromJSTimestamp,
} from '../../src-electron/app/utils/helper';

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
          label: 'Edit/Remove',
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
    this.pagesNum = data.checkpointEventsPagesNum;
    this.countEvents = data.checkpointEventsNum;
  },

  methods: {
    async addEvent() {
      let dateCur;
      if (!this.plate) {
        this.plateIsIncorrect = true;
        this.$q.notify({
          message: 'Enter plate',
          color: 'red',
        });
        return false;
      }
      if (!this.camera) {
        this.cameraIsIncorrect = true;
        this.$q.notify({
          message: 'Enter camera',
          color: 'red',
        });
        return false;
      }
      if (!this.date || !this.time) {
        dateCur = getTodayUnixTimestamp();
      } else {
        dateCur = new Date(`${this.date} ${this.time}`).getTime();
        dateCur = convertToUnixTimestamp(dateCur);
      }
      const row = { plate: this.plate, date: dateCur, camera: this.camera };
      const data = await window.invoke(FETCH_CHECKPOINT_EVENTS_ADD_EVENT, row);
      this.pagesNum = data.checkpointEventsPagesNum;
      this.countEvents = data.checkpointEventsNum;
      await this.changeVisibleTableContent(this.page - 1);
      this.plate = '';
      this.camera = '';
      this.date = '';
      this.time = '';
      this.addRowModalWindowIsOpened = false;
      this.$q.notify({
        message: 'Event was added successfully',
        color: 'green',
      });
      return true;
    },

    async editEvent() {
      let dateCur;
      if (!this.plate) {
        this.plateIsIncorrect = true;
        this.$q.notify({
          message: 'Enter plate',
          color: 'red',
        });
        return false;
      }
      if (!this.camera) {
        this.cameraIsIncorrect = true;
        this.$q.notify({
          message: 'Enter camera',
          color: 'red',
        });
        return false;
      }
      if (!this.date || !this.time) {
        dateCur = getTodayUnixTimestamp();
      } else {
        dateCur = new Date(`${this.date} ${this.time}`).getTime();
        dateCur = convertToUnixTimestamp(dateCur);
      }
      const row = { plate: this.plate, date: dateCur, camera: this.camera };
      const dataLocal = { curRowIdx: this.rowIdx, curRow: row };
      await window.invoke(FETCH_CHECKPOINT_EVENTS_EDIT_EVENT, dataLocal);
      await this.changeVisibleTableContent(this.page - 1);
      this.plate = '';
      this.camera = '';
      this.date = '';
      this.time = '';
      this.editRowModalWindowIsOpened = false;
      this.$q.notify({
        message: 'Event was edited successfully',
        color: 'blue',
      });
      return true;
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

    editRow(row) {
      this.rowIdx = row.id;
      this.plate = row.plate;
      const tempDate = new Date(`${row.date}`);
      this.date = generateYearMonthAndDateFromJSTimestamp(tempDate);
      this.time = generateHoursMinutesAndSecondsFromJSTimestamp(tempDate);
      this.camera = row.camera;
    },

    async removeRow(rowIdx) {
      const data = await window.invoke(FETCH_CHECKPOINT_EVENTS_REMOVE_EVENT, rowIdx);
      this.pagesNum = data.checkpointEventsPagesNum;
      this.countEvents = data.checkpointEventsNum;
      await this.changeVisibleTableContent(this.page - 1);
      this.$q.notify({
        message: 'Event was deleted successfully',
      });
    },

    async changeVisibleTableContent(page) {
      const data = await window.invoke(FETCH_CHECKPOINT_EVENTS_BY_PAGE_NUM, page);
      this.events = data.checkpointEventListForTable;
    },
  },
};
</script>
