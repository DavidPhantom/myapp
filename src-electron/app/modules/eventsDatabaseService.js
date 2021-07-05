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

async function setFilterPlate(knex, plate) {
  state.plateFilterVal = plate;
}

async function setFilterDate(knex, date) {
  state.dateFilterVal = date;
}

async function fetchCheckpointEvents(knex) {
  function setCount(data) {
    if (!data.length) return;
    const length = data[0].count;
    state.checkpointEventsNum = length;
    state.checkpointEventsPagesNum = Math.ceil(length / state.rows);
  }
  function setData(data) {
    if (!data.length) {
      state.checkpointEventListForTable = [];
      return;
    }
    data = setDate(data);
    state.checkpointEventListForTable = data;
  }

  await knex('events')
    .count('plate', { as: 'count' })
    .then((data) => {
      setCount(data);
    });
  await knex('events')
    .orderBy('id', 'desc')
    .limit(state.rows)
    .then((data) => {
      setData(data);
    });
  const result = {
    checkpointEventListForTable: state.checkpointEventListForTable,
    checkpointEventsPagesNum: state.checkpointEventsPagesNum,
    checkpointEventsNum: state.checkpointEventsNum,
  };
  return result;
}

async function fetchCheckpointEventsByPageNum(knex, page) {
  function setData(data) {
    if (!data.length) {
      state.checkpointEventListForTable = [];
      return;
    }
    data = setDate(data);
    state.checkpointEventListForTable = data;
  }
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
      setData(data);
    });

  const result = {
    checkpointEventListForTable: state.checkpointEventListForTable,
  };
  return result;
}

async function fetchCheckpointEventsAddEvent(knex, event) {
  await knex('events').insert(event);
  state.checkpointEventsNum += 1;
  state.checkpointEventsPagesNum = Math.ceil(state.checkpointEventsNum / state.rows);
  const result = {
    checkpointEventsPagesNum: state.checkpointEventsPagesNum,
    checkpointEventsNum: state.checkpointEventsNum,
  };
  return result;
}

async function fetchCheckpointEventsRemoveEvent(knex, eventIndex) {
  await knex('events').where('id', eventIndex).del();
  state.checkpointEventsNum -= 1;
  state.checkpointEventsPagesNum = Math.ceil(state.checkpointEventsNum / state.rows);
  const result = {
    checkpointEventsPagesNum: state.checkpointEventsPagesNum,
    checkpointEventsNum: state.checkpointEventsNum,
  };
  return result;
}

async function fetchCheckpointEventsFilter(knex) {
  function setCount(data) {
    if (!data.length) return;
    const length = data[0].count;
    state.checkpointEventsNum = length;
    state.checkpointEventsPagesNum = Math.ceil(length / state.rows);
  }

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
      setCount(data);
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
  fetchCheckpointEventsFilter,
  setFilterPlate, setFilterDate,
};
