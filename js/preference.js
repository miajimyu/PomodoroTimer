//@ts-check
const Config = require('electron-store');
const config = new Config();
const electron = require('electron');
const { ipcRenderer } = electron;

const WORKINTERVAL = 25;
const SHORTBREAK = 5;
const LONGBREAK = 15;
const LONGBREAKAFTER = 3;
const TARGETINTERVAL = 6;
const ALWAYSONTOP = true;
const AUTOSTARTTIMER = false;
const NOTIFICATION = false;
const WINDOWRESIZABLE = true;

let form1 = document.form1;
let workInterval = document.form1.workInterval;
let shortBreak = document.form1.shortBreak;
let longBreak = document.form1.longBreak;
let longBreakAfter = document.form1.longBreakAfter;
let targetInterval = document.form1.targetInterval;
let alwaysOnTop = document.form1.alwaysOnTop;
let autoStartTimer = document.form1.autoStartTimer;
let notification = document.form1.notification;
let windowResizable = document.form1.windowResizable;
let saveButton = document.getElementById('save-button');

function setConfigNumber(name, number) {
  config.set(name, Number(number));
}

function setConfigBoolean(name, bool) {
  config.set(name, bool);
}

function focusSaveButton() {
  saveButton.style.backgroundColor = 'black';
  saveButton.style.color = 'white';
}

function blurSaveButton() {
  saveButton.style.backgroundColor = 'white';
  saveButton.style.color = 'black';
}

form1.addEventListener('change', () => {
  focusSaveButton();
})

function checkPreferenceParamMinMax(num) {
  if (Number(num.value) < Number(num.min)) {
    num.value = num.min;
  }

  if (Number(num.value) > Number(num.max)) {
    num.value = num.max;
  }
}

workInterval.addEventListener('change', () => {
  checkPreferenceParamMinMax(workInterval);
});
shortBreak.addEventListener('change', () => {
  checkPreferenceParamMinMax(shortBreak);
});
longBreak.addEventListener('change', () => {
  checkPreferenceParamMinMax(longBreak);
});
longBreakAfter.addEventListener('change', () => {
  checkPreferenceParamMinMax(longBreakAfter);
});
targetInterval.addEventListener('change', () => {
  checkPreferenceParamMinMax(targetInterval);
});
alwaysOnTop.addEventListener('change', () => {
});
autoStartTimer.addEventListener('change', () => {
});
notification.addEventListener('change', () => {
});
windowResizable.addEventListener('change', () => {
});

function OnDefaultButtonClick(){
  setDefaultPreferenceParameter();
  focusSaveButton();
}

function OnSaveButtonClick() {
  setConfigAll();
  blurSaveButton();
  ipcRenderer.send('preference:save');
}

function setDefaultPreferenceParameter() {
  workInterval.value = WORKINTERVAL;
  shortBreak.value = SHORTBREAK;
  longBreak.value = LONGBREAK;
  longBreakAfter.value = LONGBREAKAFTER;
  targetInterval.value = TARGETINTERVAL;
  alwaysOnTop.value = ALWAYSONTOP;
  autoStartTimer.value = AUTOSTARTTIMER;
  notification.value = NOTIFICATION;
  windowResizable.value = WINDOWRESIZABLE;
}

function setConfigAll() {
  setConfigNumber('workInterval', workInterval.value);
  setConfigNumber('shortBreak', shortBreak.value);
  setConfigNumber('longBreak', longBreak.value);
  setConfigNumber('longBreakAfter', longBreakAfter.value);
  setConfigNumber('targetInterval', targetInterval.value);
  setConfigBoolean('alwaysOnTop', alwaysOnTop.value);
  setConfigBoolean('autoStartTimer', autoStartTimer.value);
  setConfigBoolean('notification', notification.value);
  setConfigBoolean('windowResizable', windowResizable.value);
}

(function getConfigAll() {
  workInterval.value = config.get('workInterval');
  shortBreak.value = config.get('shortBreak');
  longBreak.value = config.get('longBreak');
  longBreakAfter.value = config.get('longBreakAfter');
  targetInterval.value = config.get('targetInterval');
  alwaysOnTop.value = config.get('alwaysOnTop');
  autoStartTimer.value = config.get('autoStartTimer');
  notification.value = config.get('notification');
  windowResizable.value = config.get('windowResizable');
})();

