<template>
  <div class="q-pa-md">
    <q-btn color="primary" :disable="loading" label="Add row" @click="addRow" />
    <q-table
      title="Events"
      :data="data"
      :columns="columns"
      row-key="name"
      :loading="loading"
    />
    <q-pagination
      v-model="current"
      :max="pagesNum"
      @input="handlePage"
    />
  </div>
</template>

<script>

import { getTodayUnixTimestamp } from '../../src-electron/app/utils/helper';

export default {
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
          name: 'edit_remove', align: 'center', label: 'EDIT/REMOVE', field: 'edit_remove',
        },
      ],
      data: [
      ],
    };
  },
  async beforeMount() {
    window.send('fetchCheckpointEventsSend');
    window.recieve('fetchCheckpointEventsRecieve', (dataForTable, pagesNum, countEvents) => {
      this.data = dataForTable;
      this.pagesNum = pagesNum;
      this.countEvents = countEvents;
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
