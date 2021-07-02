import {
  setDate,
} from '../utils/helper';

const state = {
  checkpointEventListForTable: [],
  rows: 5,
  page: 0,
  checkpointEventsNum: 0,
  checkpointEventsPagesNum: 0,
  plateFilterVal: null,
  dateFilterVal: null,
};

async function setFilterPlate(event, knex, plate) {
  state.plateFilterVal = plate;
}

async function setFilterDate(event, knex, date) {
  state.dateFilterVal = date;
}

async function fetchCheckpointEvents(event, knex) {
  await knex('events')
    .count('plate', { as: 'count' })
    .then((data) => {
      if (!data.length) return;
      const length = data[0].count;
      state.checkpointEventsNum = length;
      state.checkpointEventsPagesNum = Math.ceil(length / state.rows);
    });
  await knex('events')
    .orderBy('id', 'desc')
    .limit(state.rows)
    .then((data) => {
      if (!data.length) {
        state.checkpointEventListForTable = [];
        return;
      }
      data = setDate(data);
      state.checkpointEventListForTable = data;
    });
  const result = {
    checkpointEventListForTable: state.checkpointEventListForTable,
    checkpointEventsPagesNum: state.checkpointEventsPagesNum,
    checkpointEventsNum: state.checkpointEventsNum,
  };
  return result;
}

async function fetchCheckpointEventsByPageNum(event, knex, page) {
  state.page = page;

  let mask; let dateFrom; let
    dateTo;

  let tableEvents = knex('events').orderBy('events.id', 'desc');

  if (state.plateFilterVal) {
    mask = state.plateFilterVal.replace(/\*/g, '%');
    tableEvents = tableEvents.where('events.plate', 'like', `%${mask}%`);
  }
  if (state.dateFilterVal) {
    dateFrom = state.dateFilterVal.dateFrom;
    dateTo = state.dateFilterVal.dateTo;
    tableEvents = tableEvents.whereBetween('events.date', [dateFrom, dateTo]);
  }

  await tableEvents
    .limit(state.rows)
    .offset(state.page * state.rows)
    .then((data) => {
      if (!data.length) {
        state.checkpointEventListForTable = [];
        return;
      }
      data = setDate(data);
      state.checkpointEventListForTable = data;
    });

  const result = {
    checkpointEventListForTable: state.checkpointEventListForTable,
  };
  return result;
}

async function fetchCheckpointEventsAddEvent(event, knex, row) {
  await knex('events').insert(row);
  state.checkpointEventsNum += 1;
  state.checkpointEventsPagesNum = Math.ceil(state.checkpointEventsNum / state.rows);
  const result = {
    checkpointEventsPagesNum: state.checkpointEventsPagesNum,
    checkpointEventsNum: state.checkpointEventsNum,
  };
  return result;
}

async function fetchCheckpointEventsRemoveEvent(event, knex, rowIdx) {
  await knex('events').where('id', rowIdx).del();
  state.checkpointEventsNum -= 1;
  state.checkpointEventsPagesNum = Math.ceil(state.checkpointEventsNum / state.rows);
  const result = {
    checkpointEventsPagesNum: state.checkpointEventsPagesNum,
    checkpointEventsNum: state.checkpointEventsNum,
  };
  return result;
}

async function fetchCheckpointEventsEditEvent(event, knex, rowIdx, row) {
  await knex('events').where('id', '=', rowIdx)
    .update(row);
}

async function fetchCheckpointEventsFilter(event, knex) {
  let mask; let dateFrom; let
    dateTo;

  let tableEventsCount = knex('events').count('events.id', { as: 'count' });

  if (state.plateFilterVal) {
    mask = state.plateFilterVal.replace(/\*/g, '%');
    tableEventsCount = tableEventsCount.where('events.plate', 'like', `%${mask}%`);
  }
  if (state.dateFilterVal) {
    dateFrom = state.dateFilterVal.dateFrom;
    dateTo = state.dateFilterVal.dateTo;
    tableEventsCount = tableEventsCount.whereBetween('events.date', [dateFrom, dateTo]);
  }

  await tableEventsCount
    .then((data) => {
      if (!data.length) return;
      const length = data[0].count;
      state.checkpointEventsNum = length;
      state.checkpointEventsPagesNum = Math.ceil(length / state.rows);
    });

  const result = {
    checkpointEventsPagesNum: state.checkpointEventsPagesNum,
    checkpointEventsNum: state.checkpointEventsNum,
  };
  return result;
}

export {
  fetchCheckpointEvents, fetchCheckpointEventsByPageNum,
  fetchCheckpointEventsAddEvent, fetchCheckpointEventsRemoveEvent,
  fetchCheckpointEventsEditEvent, fetchCheckpointEventsFilter,
  setFilterPlate, setFilterDate,
};
