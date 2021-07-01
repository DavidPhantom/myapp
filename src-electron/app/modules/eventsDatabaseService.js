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

function fetchCheckpointEventsSend(event, knex) {
  knex('events')
    .count('plate', { as: 'count' })
    .then((data) => {
      if (!data.length) return;
      const length = data[0].count;
      state.checkpointEventsNum = length;
      state.checkpointEventsPagesNum = Math.ceil(length / state.rows);
    });
  knex('events')
    .orderBy('id', 'desc')
    .limit(state.rows)
    .then((data) => {
      if (!data.length) return;
      data = setDate(data);
      state.checkpointEventListForTable = data;
      event.sender.send('fetchCheckpointEventsRecieve', state.checkpointEventListForTable, state.checkpointEventsPagesNum, state.checkpointEventsNum);
    });
}
function fetchCheckpointEventsByPageNumSend(event, knex, page) {
  state.page = page;
  const tableEvents = knex('events').orderBy('events.id', 'desc');

  tableEvents
    .limit(state.rows)
    .offset(state.page * state.rows)
    .then((data) => {
      if (!data.length) return;
      data = setDate(data);
      state.checkpointEventListForTable = data;
      event.sender.send('fetchCheckpointEventsByPageNumRecieve', state.checkpointEventListForTable);
    });
}

async function fetchCheckpointEventsAddEventSend(event, knex, row) {
  const tableEvents = knex('events');
  await tableEvents.insert(row);
  state.checkpointEventsNum += 1;
  state.checkpointEventsPagesNum = Math.ceil(state.checkpointEventsNum / state.rows);
  event.sender.send('fetchCheckpointEventsAddEventRecieve', state.checkpointEventsPagesNum, state.checkpointEventsNum);
}

async function fetchCheckpointEventsRemoveEventSend(event, knex, rowIdx) {
  const tableEvents = knex('events');
  await tableEvents.where('id', rowIdx).del();
  state.checkpointEventsNum -= 1;
  state.checkpointEventsPagesNum = Math.ceil(state.checkpointEventsNum / state.rows);
  event.sender.send('fetchCheckpointEventsRemoveEventRecieve', state.checkpointEventsPagesNum, state.checkpointEventsNum);
}

async function fetchCheckpointEventsEditEventSend(event, knex, rowIdx, row) {
  const tableEvents = knex('events');
  await tableEvents.where('id', '=', rowIdx)
    .update(row);
  event.sender.send('fetchCheckpointEventsEditEventRecieve');
}

export {
  fetchCheckpointEventsSend, fetchCheckpointEventsByPageNumSend,
  fetchCheckpointEventsAddEventSend, fetchCheckpointEventsRemoveEventSend,
  fetchCheckpointEventsEditEventSend,
};
