<template>
  <div class="q-pa-md">
    <q-btn label="Add allow plate" color="primary" @click="addAllowListModalWindowIsOpened = true"
    />
    <q-table
      title="AllowList"
      :data="allowList"
      :columns="columns"
      row-key="id"
      :pagination.sync="pagination"
      :loading="loading"
      :filter="filter"
      @request="onRequest"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter.allowPlateFilter"
                 placeholder="Search" @input="handleAllowPlateFilter">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            color="negative"
            icon-right="delete"
            no-caps
            flat
            dense
            @click="removeAllowPlate(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="addAllowListModalWindowIsOpened" v-on:keyup.enter="addAllowPlate">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Add allow plate</div>
          <q-space />
          <q-btn addAllowListModalWindowIsOpened="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <form class="common-form" v-on:submit.prevent="">
            <q-input
              type="email"
              :class="
                allowPlateIsIncorrect && 'common-form__error-input'
              "
              placeholder="plate"
              v-model="allowPlate"
              @input="handleAllowPlate"
            />
          </form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" @click="addAllowPlate" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {
  ALLOW_LIST, ROWS, NUMBER_PAGE, ROWS_NUMBER, ALLOW_PLATE,
} from 'src/store/modules/allowList/getters';
import {
  REMOVE_ALLOW_PLATE, ADD_ALLOW_PLATE,
  FETCH_CHECKPOINT_ALLOW_LIST_BY_PAGE,
  SAVE_FILTER_BY_ALLOW_PLATE,
} from 'src/store/modules/allowList/actions';

import {
  notifyGeneral,
} from '../../src-electron/app/utils/helper';

export const messageAllowPlateRemoveSuccess = 'Allow plate was removed successfully';
export const messageAllowPlateAddSuccess = 'Allow plate was added successfully';
export const messageAllowPlateError = 'Enter correct allow plate';

export default {
  name: 'AllowList',
  data() {
    return {
      filter: { allowPlateFilter: '' },
      loading: false,
      pagination: {
        page: 1,
        rowsPerPage: 0,
        rowsNumber: 0,
      },
      addAllowListModalWindowIsOpened: false,
      allowPlate: '',
      allowPlateIsIncorrect: false,
      allowList: [],
      columns: [
        {
          name: 'num', required: true, label: '№', align: 'left', field: 'num',
        },
        {
          name: 'plate', align: 'center', label: 'Allow plate', field: 'plate',
        },
        {
          name: 'action', label: 'Remove', field: 'action',
        },
      ],
    };
  },
  created() {
    this.filter.allowPlateFilter = this.$store.getters[ALLOW_PLATE];
  },
  async beforeMount() {
    this.pagination.rowsPerPage = this.$store.getters[ROWS];
    this.pagination.page = this.$store.getters[NUMBER_PAGE];
    await this.updateTableAllowList();
  },
  methods: {
    async onRequest(props) {
      const {
        page, rowsPerPage,
      } = props.pagination;
      this.loading = true;
      try {
        const dataForAllowListByPage = {
          pageNumber: page - 1,
          allowListPerPage: rowsPerPage,
          allowPlateFilter: this.filter.allowPlateFilter,
        };
        await this.$store.dispatch(FETCH_CHECKPOINT_ALLOW_LIST_BY_PAGE, dataForAllowListByPage);
      } catch (e) {
        console.error(e);
      } finally {
        this.pagination.rowsNumber = this.$store.getters[ROWS_NUMBER];
        this.allowList = await this.$store.getters[ALLOW_LIST];
        this.pagination.page = page;
        this.pagination.rowsPerPage = rowsPerPage;
        this.loading = false;
      }
    },
    async addAllowPlate() {
      if (this.checkAllowPlate()) {
        const allowPLate = { plate: this.allowPlate };
        await this.$store.dispatch(ADD_ALLOW_PLATE, allowPLate);
        this.allowPlate = '';
        this.addAllowListModalWindowIsOpened = false;
        await this.notifyAllowPlateAddSuccess();
        await this.updateTableAllowList();
        return true;
      }
      return false;
    },
    checkAllowPlate() {
      if (!this.allowPlate) {
        this.allowPlateIsIncorrect = true;
        this.notifyAllowPlateError();
        return false;
      }
      return true;
    },
    handleAllowPlate() {
      this.allowPlateIsIncorrect = false;
    },
    async handleAllowPlateFilter(val) {
      this.filter.allowPlateFilter = val;
      await this.$store.dispatch(SAVE_FILTER_BY_ALLOW_PLATE, this.filter.allowPlateFilter);
    },
    async removeAllowPlate(allowPlateIndex) {
      await this.$store.dispatch(REMOVE_ALLOW_PLATE, allowPlateIndex);
      await this.updateTableAllowList();
      await this.notifyAllowPlateRemoveSuccess();
    },
    async updateTableAllowList() {
      await this.onRequest({
        pagination: this.pagination,
      });
    },
    async notifyAllowPlateError() {
      await notifyGeneral(messageAllowPlateError, 'red', this.$q);
    },
    async notifyAllowPlateAddSuccess() {
      await notifyGeneral(messageAllowPlateAddSuccess, 'green', this.$q);
    },
    async notifyAllowPlateRemoveSuccess() {
      await notifyGeneral(messageAllowPlateRemoveSuccess, 'grey', this.$q);
    },
  },
};
</script>
