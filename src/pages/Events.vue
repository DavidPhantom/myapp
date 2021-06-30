<template>
  <div class="q-pa-md">
    <q-btn color="primary" :disable="loading" label="Add row" @click="addRow" />
    <ModalWindow
      :accept="plug"
    >
      <form class="common-form" v-on:submit.prevent="">
        <input
          type="email"
          :class="
            emailIsIncorrect && 'common-form__error-input'
          "
          placeholder="email"
          v-model="email"
          @input="handleEmail"
        />
        <div class="common-form__error-text">
          <span v-if="emailIsIncorrect">{{ $t('enterCorrectEmail') }}</span>
        </div>
      </form>
    </ModalWindow>
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
            @click="editRow(alerts.indexOf(props.row))"
          />
          <q-btn
            color="negative"
            icon-right="delete"
            no-caps
            flat
            dense
            @click="removeRow(alerts.indexOf(props.row))"
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

import ModalWindow from 'components/ModalWindow';
import { getTodayUnixTimestamp } from '../../src-electron/app/utils/helper';

export default {
  name: 'Events',
  components: {
    ModalWindow,
  },
  data() {
    return {
      loading: false,
      current: 1,
      page: 0,
      pagesNum: 0,
      countEvents: 0,
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
          name: 'camera', align: 'center', label: 'Camera', field: 'camera',
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
    handlePage(e) {
      this.page = e;
      this.changeVisibleTableContent(this.page - 1);
    },

    addRow() {
      this.loading = true;
      setTimeout(() => {
        const dateCur = getTodayUnixTimestamp();
        const row = { plate: 'PORTAL', date: dateCur, camera: 'NINIDZE' };
        window.send('fetchCheckpointEventsAddEvent', row);
        window.recieve('fetchCheckpointEventsAddEventRecieve', (pagesNum, countEvents) => {
          this.pagesNum = pagesNum;
          this.countEvents = countEvents;
        });
        this.changeVisibleTableContent(this.page - 1);
        this.loading = false;
      }, 500);
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
