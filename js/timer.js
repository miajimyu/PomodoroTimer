//@ts-check
const Config = require('electron-store');
const config = new Config();
const electron = require('electron');
const { ipcRenderer } = electron;

var timer = document.getElementById('timer');
var workButton = document.getElementById('work');
var breakButton = document.getElementById('break');
var start = document.getElementById('start');
var interval = document.getElementById('interval');

const STATE_WORK = 'Work';
const STATE_SHORT_BREAK = 'ShortBreak';
const STATE_LONG_BREAK = 'LongBreak';
let workTime = config.get('workInterval') * 60 * 1000;
let shortBreakTime = config.get('shortBreak') * 60 * 1000;
let longBreakTime = config.get('longBreak') * 60 * 1000;
let longBreakAfter = config.get('longBreakAfter');
let CURRENT_NUM = {
    DEFAULT: 0,
    MIN: 0,
    MAX: 99,
};
let isAutoStart = config.get('autoStartTimer');
let pomodoroTimer = {
    state: STATE_WORK,
    cycle: workTime,
    isRunning: false,
    timerId: null,
    startTime: null,
    timeLeft: null,
    interval: {
        targetNum: config.get('targetInterval'),
        currentNum: GetCurrentNum(),
    },
};

function GetCurrentNum() {
    let isResetCurrentNum = false;

    if (IsNeedRefresh() === true) {
        isResetCurrentNum = true;
    }

    if (IsCurrentNumInRange() === false) {
        isResetCurrentNum = true;
    }

    if (isResetCurrentNum === true) {
        config.set('currentInterval', 0);
    }

    SetConfigDate();

    return config.get('currentInterval');
}

function IsNeedRefresh() {
    let configDate = new Date(config.get('date'));
    let refreshDate = new Date(configDate.getFullYear(), configDate.getMonth(), configDate.getDate() + 1);
    let now = new Date();

    if (now >= refreshDate) {
        return true;
    } else {
        return false;
    }
}

function SetConfigDate() {
    var date = new Date();
    config.set('date', date);
}

function IsCurrentNumInRange() {
    var number = config.get('currentInterval');
    if ((CURRENT_NUM.MIN <= number) && (number <= CURRENT_NUM.MAX)) {
        return true;
    } else {
        return false;
    }
}

/**
 * @param {string | number | Date} t
 */
function updateTimer(t) {
    var d = new Date(t);
    var m = ('0' + d.getMinutes()).slice(-2);
    var s = ('0' + d.getSeconds()).slice(-2);
    var timerString;

    timerString = m + ':' + s;
    timer.textContent = timerString;
    interval.textContent = `${pomodoroTimer.interval.currentNum}/${pomodoroTimer.interval.targetNum}`;
    document.title = GetWorkBreakString();
}

function changeTime() {
    pomodoroTimer.timeLeft = 0;
    if (pomodoroTimer.state === STATE_WORK) {
        AddCurrentNum();
        SetBreak();
    } else {
        SetWork();
    }
}

function AddCurrentNum() {
    if (pomodoroTimer.interval.currentNum < CURRENT_NUM.MAX) {
        pomodoroTimer.interval.currentNum++;
    } else {
        pomodoroTimer.interval.currentNum = CURRENT_NUM.MAX;
    }
    config.set('currentInterval', pomodoroTimer.interval.currentNum);
}

function GetWorkBreakString() {
    return String(pomodoroTimer.state);
}

function SetWork() {
    pomodoroTimer.state = STATE_WORK;
    SetTimeToCountdown(workTime);
    updateTimer(pomodoroTimer.cycle);
}

function SetBreak() {
    if (((IsLongBreak() === true) && (longBreakTime !== 0))) {
        SetLongBreak();
    } else if (shortBreakTime !== 0) {
        SetShortBreak();
    } else {
        SetWork();
    }
}

function SetShortBreak() {
    pomodoroTimer.state = STATE_SHORT_BREAK;
    SetTimeToCountdown(shortBreakTime);
    updateTimer(pomodoroTimer.cycle);
}

function SetLongBreak() {
    pomodoroTimer.state = STATE_LONG_BREAK;
    SetTimeToCountdown(longBreakTime);
    updateTimer(pomodoroTimer.cycle);
}

function IsLongBreak() {
    if (pomodoroTimer.interval.currentNum <= 0) {
        return false;
    }

    if (pomodoroTimer.interval.currentNum % longBreakAfter === 0) {
        return true;
    } else {
        return false;
    }
}
/**
 * @param {number} time
 */
function SetTimeToCountdown(time) {
    pomodoroTimer.cycle = time;
}

window.onload = function () {
    // ページ読み込み時に実行したい処理
    updateTimer(pomodoroTimer.cycle);
}

start.addEventListener('click', function () {
    onClickStartStopButton();
});

function onClickStartStopButton() {
    if (pomodoroTimer.isRunning === false) {
        StartPomodoroTimer();
        countDown();
    } else {
        StopPomodoroTimer();
        SetTimeToCountdown(pomodoroTimer.timeLeft);
        clearTimeout(pomodoroTimer.timerId);
    }
}

function StartPomodoroTimer() {
    pomodoroTimer.isRunning = true;
    start.textContent = 'Stop';
    pomodoroTimer.startTime = Date.now();
    document.getElementById('work').style.opacity = '0.3';
    document.getElementById('break').style.opacity = '0.3';
    document.getElementById('work').style.cursor = 'auto';
    document.getElementById('break').style.cursor = 'auto';
}

function StopPomodoroTimer() {
    pomodoroTimer.isRunning = false;
    start.textContent = 'Start';
    document.getElementById('work').style.opacity = '1.0';
    document.getElementById('break').style.opacity = '1.0';
    document.getElementById('work').style.cursor = 'pointer';
    document.getElementById('break').style.cursor = 'pointer';
}

workButton.addEventListener('click', function () {
    onClickWorkButton();
});

function onClickWorkButton() {
    if (pomodoroTimer.isRunning === true) {
        return;
    }
    SetWork();
}

breakButton.addEventListener('click', function () {
    onClickBreakButton();
});

function onClickBreakButton() {
    if (pomodoroTimer.isRunning === true) {
        return;
    }
    SetBreak();
}

function countDown() {
    pomodoroTimer.timerId = setTimeout(function () {
        pomodoroTimer.timeLeft = pomodoroTimer.cycle - (Date.now() - pomodoroTimer.startTime);
        if (pomodoroTimer.timeLeft < 0) {
            clearTimeout(pomodoroTimer.timerId);
            changeTime();
            if (isAutoStart === 'false') {
                StopPomodoroTimer();
                return;
            } else {
                StartPomodoroTimer();
            }
        }
        updateTimer(pomodoroTimer.timeLeft);
        countDown();
    }, 10);
}

function setPomodoroTimerCycle() {
    if (pomodoroTimer.state === STATE_LONG_BREAK) {
        SetTimeToCountdown(longBreakTime);
    } else if (pomodoroTimer.state === STATE_SHORT_BREAK) {
        SetTimeToCountdown(shortBreakTime);
    } else {
        SetTimeToCountdown(workTime);
    }
}

ipcRenderer.on('preference:save', (event) => {
    workTime = config.get('workInterval') * 60 * 1000;
    shortBreakTime = config.get('shortBreak') * 60 * 1000;
    longBreakTime = config.get('longBreak') * 60 * 1000;
    longBreakAfter = config.get('longBreakAfter');
    pomodoroTimer.interval.targetNum = config.get('targetInterval');
    isAutoStart = config.get('autoStartTimer');
    if (pomodoroTimer.isRunning === false) {
        setPomodoroTimerCycle();
    }
    updateTimer(pomodoroTimer.cycle);
});

ipcRenderer.on('menu:start/stop', () => {
    onClickStartStopButton();
});

ipcRenderer.on('menu:work/break', () => {
    if (pomodoroTimer.state === STATE_WORK) {
        onClickBreakButton();
    } else {
        onClickWorkButton();
    }
});
