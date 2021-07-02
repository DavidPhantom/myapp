const FETCH_CHECKPOINT_EVENTS = 'fetchCheckpointEvents';
const FETCH_CHECKPOINT_EVENTS_BY_PAGE_NUM = 'fetchCheckpointEventsByPageNum';
const FETCH_CHECKPOINT_EVENTS_ADD_EVENT = 'fetchCheckpointEventsAddEvent';
const FETCH_CHECKPOINT_EVENTS_EDIT_EVENT = 'fetchCheckpointEventsEditEvent';
const FETCH_CHECKPOINT_EVENTS_REMOVE_EVENT = 'fetchCheckpointEventsRemoveEvent';

export {
  FETCH_CHECKPOINT_EVENTS, FETCH_CHECKPOINT_EVENTS_BY_PAGE_NUM,
  FETCH_CHECKPOINT_EVENTS_ADD_EVENT, FETCH_CHECKPOINT_EVENTS_EDIT_EVENT,
  FETCH_CHECKPOINT_EVENTS_REMOVE_EVENT,
};

export function pad(n) {
  return n < 10 ? `0${n}` : n;
}

export function generateDateFromJSTimestamp(jsTimestamp) {
  const date = new Date(jsTimestamp);
  return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()} ${
    pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function generateDayAndMonthFromJSTimestamp(jsTimestamp) {
  const date = new Date(jsTimestamp);
  return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
}

export function generateDayMonthAndYearFromJSTimestamp(jsTimestamp) {
  const date = new Date(jsTimestamp);
  return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${pad(date.getFullYear())}`;
}

export function generateYearMonthAndDateFromJSTimestamp(jsTimestamp) {
  const date = new Date(jsTimestamp);
  return `${pad(date.getFullYear())}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
}

export function generateHoursMinutesAndSecondsFromJSTimestamp(jsTimestamp) {
  const date = new Date(jsTimestamp);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function getTodayUnixTimestamp() {
  return Math.round(Date.now() / 1000);
}

export function convertToUnixTimestamp(jsTimestamp) {
  return Math.round(jsTimestamp / 1000);
}

export function convertToJsTimestamp(unixTimestamp) {
  return unixTimestamp * 1000;
}

export function setDate(data) {
  data.forEach((item, i, dataLocal) => {
    dataLocal[i].date = generateDateFromJSTimestamp(convertToJsTimestamp(item.date));
  });
  return data;
}
