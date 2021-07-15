<template>
  <div class="q-pa-md">
    <AlertAdd ref="alertAdd" @addAlertSuccessfully='updateTableAlerts' />
    <div class="title">{{$t('alerts')}}</div>
    <q-table
      :data="alerts"
      :columns="columns"
      row-key="id"
      :pagination.sync="pagination"
      :loading="loading"
      :filter="filter"
      @request="onRequest"
    >
      <template v-slot:top-right>
        <div class="col-5">
          <q-input class="q-mr-md"
                   outlined
                   dense
                   debounce="300" v-model="filter.email" :placeholder="$t('search')"
                   @input="handleEmailFilter" style="margin-right: 5%">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            color="negative"
            icon-right="delete"
            no-caps
            flat
            dense
            @click="removeAlert(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>
    <div class="row justify-end">
      <q-btn
        class="q-mt-md"
        unelevated no-caps
        :label="$t('addAlert')"
        color="primary"
        icon="add"
        @click="addAlertModalWindowIsOpened" />
    </div>
  </div>
</template>

<script>
import {
  ALERTS, ROWS, NUMBER_PAGE, ROWS_NUMBER, EMAIL,
} from 'src/store/modules/alerts/getters';
import {
  REMOVE_ALERT,
  FETCH_CHECKPOINT_ALERTS_BY_PAGE,
  SAVE_FILTER_BY_EMAIL,
} from 'src/store/modules/alerts/actions';

import AlertAdd from 'components/Alerts/AlertAdd';
import { notifyGeneral } from 'app/src-electron/app/utils/helper';

export const messageAlertRemoveSuccess = 'Alert was removed successfully';

export default {
  name: 'Alerts',
  components: { AlertAdd },
  data() {
    return {
      filter: { email: '' },
      loading: false,
      pagination: {
        page: 1,
        rowsPerPage: 0,
        rowsNumber: 0,
      },
      alerts: [],
      columns: [
        {
          name: 'num', required: true, label: '№', align: 'left', field: 'num',
        },
        {
          name: 'type', align: 'center', label: this.$t('notificationType'), field: 'type',
        },
        {
          name: 'address', align: 'center', label: this.$t('notificationAddress'), field: 'address',
        },
        {
          name: 'action', label: this.$t('deleteAlert'), field: 'action',
        },
      ],
    };
  },
  created() {
    this.filter.email = this.$store.getters[EMAIL];
  },
  async beforeMount() {
    this.pagination.rowsPerPage = this.$store.getters[ROWS];
    this.pagination.page = this.$store.getters[NUMBER_PAGE];
    await this.updateTableAlerts();
  },
  methods: {
    async onRequest(props) {
      const {
        page, rowsPerPage,
      } = props.pagination;
      this.loading = true;
      try {
        const dataForAlertsByPage = {
          pageNumber: page - 1,
          alertsPerPage: rowsPerPage,
          emailFilter: this.filter.email,
        };
        await this.$store.dispatch(FETCH_CHECKPOINT_ALERTS_BY_PAGE, dataForAlertsByPage);
      } catch (e) {
        console.error(e);
      } finally {
        this.pagination.rowsNumber = this.$store.getters[ROWS_NUMBER];
        this.alerts = await this.$store.getters[ALERTS];
        this.pagination.page = page;
        this.pagination.rowsPerPage = rowsPerPage;
        this.loading = false;
      }
    },
    addAlertModalWindowIsOpened() {
      this.$refs.alertAdd.show();
    },
    async handleEmailFilter(val) {
      this.filter.email = val;
      await this.$store.dispatch(SAVE_FILTER_BY_EMAIL, this.filter.email);
    },
    async removeAlert(alertIndex) {
      await this.$store.dispatch(REMOVE_ALERT, alertIndex);
      await this.updateTableAlerts();
      await this.notifyAlertRemoveSuccess();
    },
    async updateTableAlerts() {
      await this.onRequest({
        pagination: this.pagination,
      });
    },
    async notifyAlertRemoveSuccess() {
      await notifyGeneral(messageAlertRemoveSuccess, 'grey', this.$q);
    },
  },
};
</script>
