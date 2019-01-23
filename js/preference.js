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

workInterval.addEventListener('change', () => {
  config.set('workInterval', workInterval.value);
});
shortBreak.addEventListener('change', () => {
  config.set('shortBreak', shortBreak.value);
});
longBreak.addEventListener('change', () => {
  config.set('longBreak', longBreak.value);
});
longBreakAfter.addEventListener('change', () => {
  config.set('longBreakAfter', longBreakAfter.value);
});
targetInterval.addEventListener('change', () => {
  config.set('targetInterval', targetInterval.value);
});
alwaysOnTop.addEventListener('change', () => {
  config.set('alwaysOnTop', alwaysOnTop.value);
});
autoStartTimer.addEventListener('change', () => {
  config.set('autoStartTimer', autoStartTimer.value);
});

function OnDefaultButtonClick(){
  workInterval.value = 25;
  shortBreak.value = 5;
  longBreak.value = 15;
  longBreakAfter.value = 3;
  targetInterval.value = 6;
  alwaysOnTop.value = true;
  autoStartTimer.value = true;
  setConfigAll();
}

function setConfigAll() {
  config.set('workInterval', workInterval.value);
  config.set('shortBreak', shortBreak.value);
  config.set('longBreak', longBreak.value);
  config.set('longBreakAfter', longBreakAfter.value);
  config.set('targetInterval', targetInterval.value);
  config.set('alwaysOnTop', alwaysOnTop.value);
  config.set('autoStartTimer', autoStartTimer.value);
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