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
    .orderBy('id', 'desc')
    .limit(state.rows)
    .then((data) => {
      if (!data.length) return;
      const length = data[0].id;
      state.checkpointEventsNum = length;
      state.checkpointEventsPagesNum = Math.ceil(length / state.rows);
      data = setDate(data);
      state.checkpointEventListForTable = data;
      event.sender.send('fetchCheckpointEventsRecieve', state.checkpointEventListForTable, state.checkpointEventsPagesNum, state.checkpointEventsNum);
    });
}
function fetchCheckpointEventsByPageNumSend(event, knex, page) {
  function setData(data) {
    if (!data.length) return;
    data = setDate(data);
    state.checkpointEventListForTable = data;
  }

  state.page = page;

  const tableEvents = knex('events').orderBy('events.id', 'desc');

  tableEvents
    .where('id', '<=',
      state.checkpointEventsNum - state.page * state.rows)
    .limit(state.rows)
    .then((data) => {
      setData(data);
      event.sender.send('fetchCheckpointEventsByPageNumRecieve', state.checkpointEventListForTable);
    });
}

async function fetchCheckpointEventsAddEvent(event, knex, row) {
  const tableEvents = knex('events');
  await tableEvents.insert({ plate: row.plate, date: row.date, camera: row.camera });
  state.checkpointEventsNum += 1;
  state.checkpointEventsPagesNum = Math.ceil(state.checkpointEventsNum / state.rows);
  event.sender.send('fetchCheckpointEventsAddEventRecieve', state.checkpointEventsPagesNum, state.checkpointEventsNum);
}

export {
  fetchCheckpointEventsSend, fetchCheckpointEventsByPageNumSend, fetchCheckpointEventsAddEvent,
};
