<template>
  <div class="q-pa-md">
    <q-btn label="Add row" color="primary" @click="addRowModalWindowIsOpened = true" />
    <q-dialog v-model="addRowModalWindowIsOpened" v-on:keyup.enter="plugAdd">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Add row</div>
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
          <q-btn flat label="OK" color="primary" @click="plugAdd" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-table
      title="Events"
      :data="data"
      :columns="columns"
      row-key="name"
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
          <q-dialog v-model="editRowModalWindowIsOpened" v-on:keyup.enter="plugEdit">
            <q-card>
              <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">Edit row</div>
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
                <q-btn flat label="OK" color="primary" @click="plugEdit" />
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
    <q-pagination
      v-model="current"
      :max="pagesNum"
      @input="handlePage"
    />
  </div>
</template>

<script>

import { convertToUnixTimestamp, getTodayUnixTimestamp } from '../../src-electron/app/utils/helper';

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
      data: [],
    };
  },
  async beforeMount() {
    window.send('fetchCheckpointEventsSend');
    window.recieve('fetchCheckpointEventsRecieve', (dataForTable, pagesNum) => {
      this.data = dataForTable;
      this.pagesNum = pagesNum;
    });
  },

  methods: {
    plugAdd() {
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
      window.send('fetchCheckpointEventsAddEventSend', row);
      window.recieve('fetchCheckpointEventsAddEventRecieve', (pagesNum, countEvents) => {
        this.pagesNum = pagesNum;
        this.countEvents = countEvents;
        this.changeVisibleTableContent(this.page - 1);
      });
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

    plugEdit() {
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
      window.send('fetchCheckpointEventsEditEventSend', dataLocal);
      window.recieve('fetchCheckpointEventsEditEventRecieve', () => {
        this.changeVisibleTableContent(this.page - 1);
      });
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
      const tempDate = row.date.slice(0, 10).split('/');
      this.date = `${tempDate[2]}/${tempDate[0]}/${tempDate[1]}`;
      this.time = row.date.slice(11, 21);
      this.camera = row.camera;
    },

    removeRow(rowIdx) {
      window.send('fetchCheckpointEventsRemoveEventSend', rowIdx);
      window.recieve('fetchCheckpointEventsRemoveEventRecieve', (pagesNum, countEvents) => {
        this.pagesNum = pagesNum;
        this.countEvents = countEvents;
        this.changeVisibleTableContent(this.page - 1);
        this.$q.notify({
          message: 'Event was deleted successfully',
        });
      });
    },

    changeVisibleTableContent(page) {
      window.send('fetchCheckpointEventsByPageNumSend', page);
      window.recieve('fetchCheckpointEventsByPageNumRecieve', (dataForTable) => {
        this.data = dataForTable;
      });
    },
  },
};
</script>
