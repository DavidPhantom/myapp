import {
  setDate,
} from '../utils/helper';

const state = {
  checkpointEventListForTable: [],
  rows: 5,
  page: 0,
  checkpointEventsNum: 0,
  checkpointEventsPagesNum: 0,
};

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
      if (!data.length) return;
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

  await knex('events')
    .orderBy('events.id', 'desc')
    .limit(state.rows)
    .offset(state.page * state.rows)
    .then((data) => {
      if (!data.length) return;
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

export {
  fetchCheckpointEvents, fetchCheckpointEventsByPageNum,
  fetchCheckpointEventsAddEvent, fetchCheckpointEventsRemoveEvent,
  fetchCheckpointEventsEditEvent,
};
