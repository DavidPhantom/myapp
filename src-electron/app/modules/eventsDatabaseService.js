import {
  setDate,
} from '../utils/helper';

const state = {
  checkpointEventListForTable: [],
  rows: 5,
  page: 0,
  plateFilterVal: null,
  dateFilterVal: null,
};

async function fetchCheckpointEvents(knex) {
  function setData(data) {
    if (!data.length) {
      state.checkpointEventListForTable = [];
      return;
    }
    data = setDate(data);
    state.checkpointEventListForTable = data;
  }
  await knex('events')
    .orderBy('id', 'desc')
    .then((data) => {
      setData(data);
    });
  const result = {
    checkpointEventListForTable: state.checkpointEventListForTable,
    rows: state.rows,
  };
  return result;
}

async function fetchCheckpointEventsAddEvent(knex, event) {
  await knex('events').insert(event);
}

async function fetchCheckpointEventsRemoveEvent(knex, eventIndex) {
  await knex('events').where('id', eventIndex).del();
}

export {
  fetchCheckpointEvents,
  fetchCheckpointEventsAddEvent, fetchCheckpointEventsRemoveEvent,
};
