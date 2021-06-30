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
