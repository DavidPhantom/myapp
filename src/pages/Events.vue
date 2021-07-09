<template>
  <div class="q-pa-md">
    <q-btn label="Add event" color="primary" @click="addEventModalWindowIsOpened" />
    <EventAdd ref="eventAdd" @addEventSuccessfully='updateTableEvents' />
    <q-table
      title="Events"
      :data="events"
      :columns="columns"
      row-key="id"
      :pagination.sync="pagination"
      :loading="loading"
      :filter="filter"
      @request="onRequest"
    >
      <template v-slot:top-right>
        <q-checkbox
          left-label
          v-model="filter.enableAllowList"
          label="Show only allowed numbers"
          @input="handleAllowList"
        />
      </template>
      <template v-slot:top-left>
        <div>
          <div class="row justify-between" style="">
            <div class="col-5">
              <q-input class="q-mr-md"
                       outlined
                       dense
                       debounce="300" v-model="filter.plateFilter" placeholder="Search"
                       @input="handlePlateFilter" style="margin-right: 5%">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-7">
              <q-input dense readonly outlined v-model="filterDateToInputValue">
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click="clearDateFilter"
                    class="cursor-pointer"
                  />
                </template>
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date range v-model="filter.dateFilter"
                              mask="YYYY-MM-DD" @input="handleDateFilter">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
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
            @click="removeEvent(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import {
  REMOVE_EVENT,
  SAVE_FILTER_BY_PLATE, SAVE_FILTER_BY_DATE,
  FETCH_CHECKPOINT_EVENTS_BY_PAGE,
  SAVE_FILTER_BY_ALLOW_LIST,
} from 'src/store/modules/events/actions';
import {
  EVENTS, PLATE, ROWS, DATE, NUMBER_PAGE, ROWS_NUMBER, ENABLE_ALLOW_LIST,
} from 'src/store/modules/events/getters';

import EventAdd from 'components/Events/EventAdd';

import {
  notifyGeneral,
  convertToTimestamp, generateYearMonthAndDateFromJSTimestamp,
} from '../../src-electron/app/utils/helper';

export const messageEventRemoveSuccess = 'Event was removed successfully';
export const messagePlateError = 'Enter plate number';
export const messageCameraError = 'Enter camera name';

export default {
  name: 'Events',
  components: { EventAdd },
  data() {
    return {
      filter: { plateFilter: '', dateFilter: '', enableAllowList: false },
      filterDateToInputValue: '-',
      loading: false,
      pagination: {
        page: 1,
        rowsPerPage: 0,
        rowsNumber: 0,
      },
      eventIndex: 0,
      columns: [
        {
          name: 'num', required: true, label: '№', align: 'left', field: 'num',
        },
        {
          name: 'plate', align: 'center', label: 'Plate', field: 'plate',
        },
        {
          name: 'date', align: 'center', label: 'Date', field: 'date',
        },
        {
          name: 'camera', align: 'center', label: 'Camera', field: 'camera',
        },
        {
          name: 'action', label: 'Remove', align: 'center', field: 'action',
        },
      ],
      events: [],
    };
  },
  created() {
    this.filter.plateFilter = this.$store.getters[PLATE];
    this.filter.enableAllowList = this.$store.getters[ENABLE_ALLOW_LIST];
    this.filter.dateFilter = this.$store.getters[DATE];
    if (this.filter.dateFilter) {
      const dateFrom = generateYearMonthAndDateFromJSTimestamp(this.filter.dateFilter.dateFrom);
      const dateTo = generateYearMonthAndDateFromJSTimestamp(
        this.filter.dateFilter.dateTo - 24 * 60 * 60,
      );
      this.filterDateToInputValue = `${dateFrom} - ${dateTo}`;
    }
  },
  async beforeMount() {
    this.pagination.rowsPerPage = this.$store.getters[ROWS];
    this.pagination.page = this.$store.getters[NUMBER_PAGE];
    await this.updateTableEvents();
  },
  methods: {
    async onRequest(props) {
      const {
        page, rowsPerPage,
      } = props.pagination;
      this.loading = true;
      try {
        const dataForEventsByPage = {
          pageNumber: page - 1,
          eventsPerPage: rowsPerPage,
          plateFilter: this.filter.plateFilter,
          dateFilter: this.filter.dateFilter,
          enableAllowList: this.filter.enableAllowList,
        };
        await this.$store.dispatch(FETCH_CHECKPOINT_EVENTS_BY_PAGE, dataForEventsByPage);
      } catch (e) {
        console.error(e);
      } finally {
        this.pagination.rowsNumber = this.$store.getters[ROWS_NUMBER];
        this.events = await this.$store.getters[EVENTS];
        this.pagination.page = page;
        this.pagination.rowsPerPage = rowsPerPage;
        this.loading = false;
      }
    },
    async handleAllowList(val) {
      this.filter.enableAllowList = val;
      await this.$store.dispatch(SAVE_FILTER_BY_ALLOW_LIST, this.filter.enableAllowList);
    },
    async handlePlateFilter(val) {
      this.filter.plateFilter = val;
      await this.$store.dispatch(SAVE_FILTER_BY_PLATE, this.filter.plateFilter);
    },
    async handleDateFilter() {
      let dateFrom;
      let dateTo;
      if (this.filter.dateFilter.from && this.filter.dateFilter.to) {
        this.filterDateToInputValue = `${this.filter.dateFilter.from} - ${this.filter.dateFilter.to}`;
        dateFrom = this.filter.dateFilter.from;
        dateTo = this.filter.dateFilter.to;
      } else {
        this.filterDateToInputValue = `${this.filter.dateFilter} - ${this.filter.dateFilter}`;
        dateFrom = this.filter.dateFilter;
        dateTo = dateFrom;
      }
      const dateFromTimeStamp = convertToTimestamp(dateFrom);
      const dateToTimeStamp = convertToTimestamp(dateTo) + 24 * 60 * 60;
      const date = {
        dateFrom: dateFromTimeStamp,
        dateTo: dateToTimeStamp,
      };
      this.filter.dateFilter = date;
      await this.$store.dispatch(SAVE_FILTER_BY_DATE, this.filter.dateFilter);
    },
    async clearDateFilter() {
      this.filter.dateFilter = '';
      this.filterDateToInputValue = '-';
      await this.$store.dispatch(SAVE_FILTER_BY_DATE, this.filter.dateFilter);
    },
    addEventModalWindowIsOpened() {
      this.$refs.eventAdd.show();
    },
    async updateTableEvents() {
      await this.onRequest({
        pagination: this.pagination,
      });
    },
    async removeEvent(eventIndex) {
      await this.$store.dispatch(REMOVE_EVENT, eventIndex);
      await this.updateTableEvents();
      await this.notifyEventRemoveSuccess();
    },
    async notifyEventRemoveSuccess() {
      await notifyGeneral(messageEventRemoveSuccess, 'grey', this.$q);
    },
  },
};
</script>
