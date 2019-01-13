const Config = require('electron-store');
const config = new Config();

(function name(params) {
    'use strict';

    var timer = document.getElementById('timer');
    var workButton = document.getElementById('work');
    var breakButton = document.getElementById('break');
    var start = document.getElementById('start');

    const STATE_WORK = 'Work';
    const STATE_BREAK = 'Break';
    const WORKTIME = 25 * 60 * 1000;
    const BREAKTIME = 5 * 60 * 1000;
    // const WORKTIME = 5 * 1000;
    // const BREAKTIME = 2 * 1000;
    const DEFAULT_TARGET_NUM = 6;
    let isAutoStart = true;

    let pomodoroTimer = {
        state: STATE_WORK,
        cycle: WORKTIME,
        isRunning: false,
        timerId: null,
        startTime: null,
        timeLeft: null,
        interval: {
            targetNum: DEFAULT_TARGET_NUM,
            currentNum: GetCurrentNum(),
        },
    }

    function GetCurrentNum() {
        if (IsNeedRefresh()) {
            config.set('pomodoroTimer.interval.currentNum', 0);
        }
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

    function updateTimer(t) {
        var d = new Date(t);
        var m = d.getMinutes();
        var s = d.getSeconds();
        var timerString;

        // 文字列＋数値は、文字列になる
        m = ('0' + m).slice(-2);
        s = ('0' + s).slice(-2);
        timerString = m + ':' + s;
        timer.textContent = timerString;
        interval.textContent = `${pomodoroTimer.interval.currentNum}/${pomodoroTimer.interval.targetNum}`;
        document.title = GetWorkBreakString();
    }

    function countDown() {
        pomodoroTimer.timerId = setTimeout(function () {
            pomodoroTimer.timeLeft = pomodoroTimer.cycle - (Date.now() - pomodoroTimer.startTime);
            if (pomodoroTimer.timeLeft < 0) {
                clearTimeout(pomodoroTimer.timerId);
                changeTime();
                debugger;
                if (isAutoStart === false) {
                    StopPomodoroTimer();
                    return;
                } else {
                    StartPomodoroTimer();
                }
            }
            updateTimer(pomodoroTimer.timeLeft);
            countDown()
        }, 10);
    }

    function changeTime() {
        pomodoroTimer.timeLeft = 0;
        if (pomodoroTimer.state === STATE_WORK) {
            pomodoroTimer.interval.currentNum++;
            SetBrake();
        } else {
            SetWork();
        }
        config.set('pomodoroTimer.interval.currentNum', pomodoroTimer.interval.currentNum);
    }

    function GetWorkBreakString() {
        if (pomodoroTimer.state === STATE_WORK) {
            return STATE_WORK;
        } else {
            return STATE_BREAK;
        }
    }

    function SetWork(params) {
        pomodoroTimer.state = STATE_WORK;
        SetTimeToCountdown(WORKTIME);
        updateTimer(pomodoroTimer.cycle);
    }

    function SetBrake(params) {
        pomodoroTimer.state = STATE_BREAK;
        SetTimeToCountdown(BREAKTIME);
        updateTimer(pomodoroTimer.cycle);
    }

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
    }

    function StopPomodoroTimer() {
        pomodoroTimer.isRunning = false;
        start.textContent = 'Start';
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
        SetBrake();
    });
})();