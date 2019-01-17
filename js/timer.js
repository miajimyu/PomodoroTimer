//@ts-check
const Config = require('electron-store');
const config = new Config();

var timer = document.getElementById('timer');
var workButton = document.getElementById('work');
var breakButton = document.getElementById('break');
var start = document.getElementById('start');
var interval = document.getElementById('interval');

const STATE_WORK = 'Work';
const STATE_SHORT_BREAK = 'ShortBreak';
const STATE_LONG_BREAK = 'LongBreak'
const WORK_TIME = 25 * 60 * 1000;
const SHORT_BREAK_TIME = 5 * 60 * 1000;
const LONG_BREAK_TIME = 15 * 60 * 1000;
// const WORK_TIME = 5 * 1000;
// const SHORT_BREAK_TIME = 2 * 1000;
// const LONG_BREAK_TIME = 3 * 1000;
const LONG_BREAK_AFTER = 3;

const TARGET_NUM = {
    DEFAULT: 6,
    MIN: 1,
    MAX: 99,
};
const CURRENT_NUM = {
    DEFAULT: 0,
    MIN: 0,
    MAX: 99,
};
let isAutoStart = false;

let pomodoroTimer = {
    state: STATE_WORK,
    cycle: WORK_TIME,
    isRunning: false,
    timerId: null,
    startTime: null,
    timeLeft: null,
    interval: {
        targetNum: TARGET_NUM.DEFAULT,
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
        config.set('pomodoroTimer.interval.currentNum', 0);
    }

    SetConfigDate();

    return config.get('pomodoroTimer.interval.currentNum');
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
    // date = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
    config.set('date', date);
}

function IsCurrentNumInRange() {
    var number = config.get('pomodoroTimer.interval.currentNum');
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
    config.set('pomodoroTimer.interval.currentNum', pomodoroTimer.interval.currentNum);
}

function GetWorkBreakString() {
    return String(pomodoroTimer.state);
}

function SetWork() {
    pomodoroTimer.state = STATE_WORK;
    SetTimeToCountdown(WORK_TIME);
    updateTimer(pomodoroTimer.cycle);
}

function SetBreak() {
    if (((IsLongBreak() === true) && (LONG_BREAK_TIME !== 0))) {
        SetLongBreak();
    } else if (SHORT_BREAK_TIME !== 0) {
        SetShortBreak();
    } else {
        SetWork();
    }
}

function SetShortBreak() {
    pomodoroTimer.state = STATE_SHORT_BREAK;
    SetTimeToCountdown(SHORT_BREAK_TIME);
    updateTimer(pomodoroTimer.cycle);
}

function SetLongBreak() {
    pomodoroTimer.state = STATE_LONG_BREAK;
    SetTimeToCountdown(LONG_BREAK_TIME);
    updateTimer(pomodoroTimer.cycle);
}

function IsLongBreak() {
    if (pomodoroTimer.interval.currentNum <= 0) {
        return false;
    }

    if (pomodoroTimer.interval.currentNum % LONG_BREAK_AFTER === 0) {
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
    if (pomodoroTimer.isRunning === false) {
        StartPomodoroTimer();
        countDown();
    } else {
        StopPomodoroTimer();
        SetTimeToCountdown(pomodoroTimer.timeLeft);
        clearTimeout(pomodoroTimer.timerId);
    }
});

function StartPomodoroTimer() {
    pomodoroTimer.isRunning = true;
    start.textContent = 'Stop';
    pomodoroTimer.startTime = Date.now();
    document.getElementById('work').style.opacity = '0.3';
    document.getElementById('break').style.opacity = '0.3';
}

function StopPomodoroTimer() {
    pomodoroTimer.isRunning = false;
    start.textContent = 'Start';
    document.getElementById('work').style.opacity = '1.0';
    document.getElementById('break').style.opacity = '1.0';
}

workButton.addEventListener('click', function () {
    if (pomodoroTimer.isRunning === true) {
        return;
    }
    SetWork();
});

breakButton.addEventListener('click', function () {
    if (pomodoroTimer.isRunning === true) {
        return;
    }
    SetBreak();
});

function countDown() {
    pomodoroTimer.timerId = setTimeout(function () {
        pomodoroTimer.timeLeft = pomodoroTimer.cycle - (Date.now() - pomodoroTimer.startTime);
        if (pomodoroTimer.timeLeft < 0) {
            clearTimeout(pomodoroTimer.timerId);
            changeTime();
            if (isAutoStart === false) {
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