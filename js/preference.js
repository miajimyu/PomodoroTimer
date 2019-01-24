//@ts-check
const Config = require('electron-store');
const config = new Config();

let workInterval = document.form1.workInterval;
let shortBreak = document.form1.shortBreak;
let longBreak = document.form1.longBreak;
let longBreakAfter = document.form1.longBreakAfter;
let targetInterval = document.form1.targetInterval;
let alwaysOnTop = document.form1.alwaysOnTop;
let autoStartTimer = document.form1.autoStartTimer;

function setConfigNumber(name, number) {
  config.set(name, Number(number));
}

function setConfigBoolean(name, bool) {
  config.set(name, Boolean(bool));
}

workInterval.addEventListener('change', () => {
  setConfigNumber('workInterval', workInterval.value);
});
shortBreak.addEventListener('change', () => {
  setConfigNumber(shortBreak.value);
});
longBreak.addEventListener('change', () => {
  setConfigNumber('longBreak', longBreak.value);
});
longBreakAfter.addEventListener('change', () => {
  setConfigNumber('longBreakAfter', longBreakAfter.value);
});
targetInterval.addEventListener('change', () => {
  setConfigNumber('targetInterval', targetInterval.value);
});
alwaysOnTop.addEventListener('change', () => {
  setConfigBoolean('alwaysOnTop', alwaysOnTop.value);
});
autoStartTimer.addEventListener('change', () => {
  setConfigBoolean('autoStartTimer', autoStartTimer.value);
});

function OnDefaultButtonClick(){
  setDefault();
  setConfigAll();
}

function setDefault() {
  workInterval.value = 25;
  shortBreak.value = 5;
  longBreak.value = 15;
  longBreakAfter.value = 3;
  targetInterval.value = 6;
  alwaysOnTop.value = true;
  autoStartTimer.value = true;
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