import {
  setDate,
} from '../../src/utils/helper';

const state = {
  checkpointEventListForTable: [],
  rows: 5,
  page: 0,
  dateFilterVal: null,
  plateFilterVal: null,
  suspiciousPlatesAreShown: false,
  numbersFromWhitelist: [],
  firstNumberOfTableItems: 0,

  checkpointEventsNum: 0,
  checkpointEventsPagesNum: 0,
};

function fetchCheckpointEventsSend(event, knex) {
  knex('events')
    .orderBy('id', 'desc')
    .limit(state.rows)
    .then((data) => {
      if (!data.length) return;
      const length = data[0].id;
      state.checkpointEventsNum = length;
      state.checkpointEventsPagesNum = Math.ceil(length / state.rows);
      data = setDate(data);
      state.checkpointEventListForTable = data;
      event.sender.send('fetchCheckpointEventsRecieve', state.checkpointEventListForTable, state.checkpointEventsPagesNum);
    });
}
function fetchCheckpointEventsByPageNumSend(event, knex, page) {
  function setData(data) {
    if (!data.length) return;
    data = setDate(data);
    state.checkpointEventListForTable = data;
  }
  let mask; let dateFrom; let
    dateTo;

  state.page = page;

  let tableEvents = knex('events').orderBy('events.id', 'desc');

  if (state.plateFilterVal) {
    mask = state.plateFilterVal.replaceAll('*', '%');
    tableEvents = tableEvents.where('events.plate', 'like', `%${mask}%`);
  }
  if (state.dateFilterVal) {
    dateFrom = state.dateFilterVal.dateFrom;
    dateTo = state.dateFilterVal.dateTo;
    tableEvents = tableEvents.whereBetween('events.date', [dateFrom, dateTo]);
  }
  if (state.suspiciousPlatesAreShown === true) {
    tableEvents = tableEvents.select({
      id: 'events.id',
      plate: 'events.plate',
      date: 'events.date',
      camera: 'events.camera',
    })
      .join('whitelist', 'events.plate', '=', 'whitelist.number');
  }

  if (!state.plateFilterVal && !state.dateFilterVal && state.suspiciousPlatesAreShown === false) {
    tableEvents
      .where('id', '<=',
        state.checkpointEventsNum - state.page * state.rows)
      .limit(state.rows)
      .then((data) => {
        setData(data);
        event.sender.send('fetchCheckpointEventsByPageNumRecieve', state.checkpointEventListForTable);
      });
  } else {
    tableEvents
      .limit(state.rows)
      .offset(state.page * state.rows)
      .then((data) => {
        setData(data);
        event.sender.send('fetchCheckpointEventsByPageNumRecieve', state.checkpointEventListForTable);
      });
  }
}

export {
  fetchCheckpointEventsSend, fetchCheckpointEventsByPageNumSend,
};
