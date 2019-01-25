//@ts-check
const Config = require('electron-store');
const config = new Config();

const WORKINTERVAL = 25;
const SHORTBREAK = 5;
const LONGBREAK = 15;
const LONGBREAKAFTER = 3;
const TARGETINTERVAL = 6;
const ALWAYSONTOP = true;
const AUTOSTARTTIMER = false;

let form1 = document.form1;
let workInterval = document.form1.workInterval;
let shortBreak = document.form1.shortBreak;
let longBreak = document.form1.longBreak;
let longBreakAfter = document.form1.longBreakAfter;
let targetInterval = document.form1.targetInterval;
let alwaysOnTop = document.form1.alwaysOnTop;
let autoStartTimer = document.form1.autoStartTimer;
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

workInterval.addEventListener('change', () => {
  // setConfigNumber('workInterval', workInterval.value);
});
shortBreak.addEventListener('change', () => {
  // setConfigNumber(shortBreak.value);
});
longBreak.addEventListener('change', () => {
  // setConfigNumber('longBreak', longBreak.value);
});
longBreakAfter.addEventListener('change', () => {
  // setConfigNumber('longBreakAfter', longBreakAfter.value);
});
targetInterval.addEventListener('change', () => {
  // setConfigNumber('targetInterval', targetInterval.value);
});
alwaysOnTop.addEventListener('change', () => {
  // setConfigBoolean('alwaysOnTop', alwaysOnTop.value);
});
autoStartTimer.addEventListener('change', () => {
  // setConfigBoolean('autoStartTimer', autoStartTimer.value);
});

function OnDefaultButtonClick(){
  setDefaultPreferenceParameter();
  setConfigAll();
}

function OnSaveButtonClick() {
  setConfigAll();
  blurSaveButton();
}

function setDefaultPreferenceParameter() {
  workInterval.value = WORKINTERVAL;
  shortBreak.value = SHORTBREAK;
  longBreak.value = LONGBREAK;
  longBreakAfter.value = LONGBREAKAFTER;
  targetInterval.value = TARGETINTERVAL;
  alwaysOnTop.value = ALWAYSONTOP;
  autoStartTimer.value = AUTOSTARTTIMER;
}

function setConfigAll() {
  setConfigNumber('workInterval', workInterval.value);
  setConfigNumber('shortBreak', shortBreak.value);
  setConfigNumber('longBreak', longBreak.value);
  setConfigNumber('longBreakAfter', longBreakAfter.value);
  setConfigNumber('targetInterval', targetInterval.value);
  setConfigBoolean('alwaysOnTop', alwaysOnTop.value);
  setConfigBoolean('autoStartTimer', autoStartTimer.value);
}

(function getConfigAll() {
  workInterval.value = config.get('workInterval');
  shortBreak.value = config.get('shortBreak');
  longBreak.value = config.get('longBreak');
  longBreakAfter.value = config.get('longBreakAfter');
  targetInterval.value = config.get('targetInterval');
  alwaysOnTop.value = config.get('alwaysOnTop');
  autoStartTimer.value = config.get('autoStartTimer');
})();

