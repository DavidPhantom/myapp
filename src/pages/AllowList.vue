<template>
  <div class="q-pa-md">
    <AllowListAdd ref="allowListAdd" @addAllowListSuccessfully='updateTableAllowList' />
    <div class="title">{{$t('allowList')}}</div>
    <q-table
      :data="allowList"
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
                   debounce="300" v-model="filter.allowPlateFilter" :placeholder="$t('search')"
                   @input="handleAllowPlateFilter" style="margin-right: 5%">
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
    <div class="row justify-end">
      <q-btn
        class="q-mt-md"
        unelevated no-caps
        :label="$t('addCarNumber')"
        color="primary"
        icon="add"
        @click="addAllowListModalWindowIsOpened" />
    </div>
  </div>
</template>

<script>
import {
  ALLOW_LIST, ROWS, NUMBER_PAGE, ROWS_NUMBER, ALLOW_PLATE,
} from 'src/store/modules/allowList/getters';
import {
  REMOVE_ALLOW_PLATE,
  FETCH_CHECKPOINT_ALLOW_LIST_BY_PAGE,
  SAVE_FILTER_BY_ALLOW_PLATE,
} from 'src/store/modules/allowList/actions';

import AllowListAdd from 'components/AllowList/AllowListAdd';

import {
  notifyGeneral,
} from '../../src-electron/app/utils/helper';

export const messageAllowPlateRemoveSuccess = 'Allow plate was removed successfully';

export default {
  name: 'AllowList',
  components: {
    AllowListAdd,
  },
  data() {
    return {
      filter: { allowPlateFilter: '' },
      loading: false,
      pagination: {
        page: 1,
        rowsPerPage: 0,
        rowsNumber: 0,
      },
      allowList: [],
      columns: [
        {
          name: 'num', required: true, label: '№', align: 'left', field: 'num',
        },
        {
          name: 'plate', align: 'center', label: this.$t('addCarNumber'), field: 'plate',
        },
        {
          name: 'action', label: this.$t('deleteCarNumber'), field: 'action',
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
    addAllowListModalWindowIsOpened() {
      this.$refs.allowListAdd.show();
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
    async notifyAllowPlateRemoveSuccess() {
      await notifyGeneral(messageAllowPlateRemoveSuccess, 'grey', this.$q);
    },
  },
};
</script>
