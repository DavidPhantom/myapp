const { ipcRenderer } = require('electron');

window.invoke = async function (channel, data) {
  const result = await ipcRenderer.invoke(channel, data);
  return result;
};
