<template>
  <div class="q-pa-md">
    <q-btn label="Add alert" color="primary" @click="addAlertModalWindowIsOpened = true" />

    <q-table
      title="Alerts"
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
                   debounce="300" v-model="filter.email" placeholder="Search"
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

    <q-dialog v-model="addAlertModalWindowIsOpened" v-on:keyup.enter="addAlert">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Add alert</div>
          <q-space />
          <q-btn addAlertModalWindowIsOpened="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <form class="common-form" v-on:submit.prevent="">
            <q-input
              type="email"
              :class="
                emailIsIncorrect && 'common-form__error-input'
              "
              placeholder="email"
              v-model="email"
              @input="handleEmail"
            />
          </form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" @click="addAlert" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {
  ALERTS, ROWS, NUMBER_PAGE, ROWS_NUMBER, EMAIL,
} from 'src/store/modules/alerts/getters';
import {
  REMOVE_ALERT, ADD_ALERT,
  FETCH_CHECKPOINT_ALERTS_BY_PAGE,
  SAVE_FILTER_BY_EMAIL,
} from 'src/store/modules/alerts/actions';

import {
  notifyGeneral,
} from '../../src-electron/app/utils/helper';

export const messageAlertRemoveSuccess = 'Alert was removed successfully';
export const messageAlertAddSuccess = 'Alert was added successfully';
export const messageEmailError = 'Enter correct email';

export default {
  name: 'Alerts',
  data() {
    return {
      filter: { email: '' },
      loading: false,
      pagination: {
        page: 1,
        rowsPerPage: 0,
        rowsNumber: 0,
      },
      addAlertModalWindowIsOpened: false,
      email: '',
      emailIsIncorrect: false,
      alerts: [],
      columns: [
        {
          name: 'num', required: true, label: '№', align: 'left', field: 'num',
        },
        {
          name: 'type', align: 'center', label: 'Notification type', field: 'type',
        },
        {
          name: 'address', align: 'center', label: 'Notification address', field: 'address',
        },
        {
          name: 'action', label: 'Remove', field: 'action',
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
    async addAlert() {
      if (this.checkEmail()) {
        const alert = { type: 'Email', address: this.email };
        await this.$store.dispatch(ADD_ALERT, alert);
        this.email = '';
        this.addAlertModalWindowIsOpened = false;
        await this.notifyAlertAddSuccess();
        await this.updateTableAlerts();
        return true;
      }
      return false;
    },
    checkEmail() {
      if (!this.email.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)) {
        this.emailIsIncorrect = true;
        this.notifyEmailError();
        return false;
      }
      return true;
    },
    handleEmail() {
      this.emailIsIncorrect = false;
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
    async handlePage() {
      await this.onRequest({
        pagination: this.pagination,
      });
    },
    async notifyEmailError() {
      await notifyGeneral(messageEmailError, 'red', this.$q);
    },
    async notifyAlertAddSuccess() {
      await notifyGeneral(messageAlertAddSuccess, 'green', this.$q);
    },
    async notifyAlertRemoveSuccess() {
      await notifyGeneral(messageAlertRemoveSuccess, 'grey', this.$q);
    },
  },
};
</script>
