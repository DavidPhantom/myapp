<template>
  <div class="q-pa-md">
    <q-table
      title="Events"
      :data="data"
      :columns="columns"
      row-key="name"
    />
    <q-pagination
      v-model="current"
      :max="totalNum"
      @input="handlePage"
    />
  </div>
</template>

<script>

export default {
  data() {
    return {
      current: 1,
      page: 0,
      totalNum: 0,
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
      ],
      data: [
      ],
    };
  },
  async beforeMount() {
    window.send('fetchCheckpointEventsSend');
    window.recieve('fetchCheckpointEventsRecieve', (dataForTable, pagesNum) => {
      console.log(dataForTable);
      this.data = dataForTable;
      this.totalNum = pagesNum;
      console.log(this.data);
    });
  },

  methods: {
    handlePage(e) {
      this.page = e;
      console.log(this.page);
      this.changeVisibleTableContent(this.page - 1);
    },

    changeVisibleTableContent(page) {
      window.send('fetchCheckpointEventsByPageNumSend', page);
      window.recieve('fetchCheckpointEventsByPageNumRecieve', (dataForTable) => {
        console.log(dataForTable);
        this.data = dataForTable;
        console.log(this.data);
      });
    },
  },
};
</script>
