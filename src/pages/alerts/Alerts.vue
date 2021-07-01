<template>
  <div>
    <q-btn label="Add alert" color="primary" @click="openCreator" />

    <q-table
      title="Alerts"
      :data="alerts"
      :columns="columns"
      row-key="id"
      :filter="filter"
      :filter-method="addressFilter"
      binary-state-sort
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            color="positive"
            icon-right="edit"
            no-caps
            flat
            dense
            @click="openEditor(props.row, alerts.indexOf(props.row))"
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

    <AlertsCreator
      ref="alertsCreator"
    />
    <AlertsEditor
      ref="alertsEditor"
    />
  </div>
</template>

<script>
import {
  ALERTS,
} from 'src/store/modules/alerts/getters';
import {
  REMOVE_ALERT,
} from 'src/store/modules/alerts/actions';

import AlertsEditor from './AlertsEditor.vue';
import AlertsCreator from './AlertsCreator.vue';

export default {
  name: 'Alerts',
  components: {
    AlertsEditor,
    AlertsCreator,
  },
  data() {
    return {
      filter: '',
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
          name: 'type',
          align: 'center',
          label: 'Notification type',
          field: 'type',
          sortable: true,
        },
        {
          name: 'address',
          align: 'center',
          label: 'Notification address',
          field: 'address',
          sortable: true,
        },
        {
          name: 'action',
          label: 'Action',
          field: 'action',
        },
      ],
    };
  },
  computed: {
    alerts() {
      return this.$store.getters[ALERTS];
    },
  },
  methods: {
    addressFilter(rows, terms) {
      const filteredRows = rows.filter((row) => row.address.startsWith(terms));
      return filteredRows;
    },

    removeRow(rowIdx) {
      this.$store.dispatch(REMOVE_ALERT, rowIdx);
    },

    openEditor(row, rowIdx) {
      this.$refs.alertsEditor.open(row.address, rowIdx);
    },

    openCreator() {
      this.$refs.alertsCreator.open();
    },
  },
};
</script>
