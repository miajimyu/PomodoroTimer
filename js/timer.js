(function name(params) {
    'use strict';

    var timer = document.getElementById('timer');
    var workButton = document.getElementById('work');
    var breakButton = document.getElementById('break');
    var start = document.getElementById('start');

    const workState = 'Work';
    const breakState = 'Break';
    const workTime = 25 * 60 * 1000;
    const breakTime = 5 * 60 * 1000;

    let pomodoroTimer = {
        state: workState,
        cycle: workTime,
        isRunning: false,
        timerId: null,
        startTime: null,
        timeLeft: null
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
        document.title = GetWorkBreakString();
    }

    function countDown() {
        pomodoroTimer.timerId = setTimeout(function () {
            pomodoroTimer.timeLeft = pomodoroTimer.cycle - (Date.now() - pomodoroTimer.startTime);
            if (pomodoroTimer.timeLeft < 0) {
                pomodoroTimer.isRunning = false;
                start.textContent = 'Start';
                clearTimeout(pomodoroTimer.timerId);
                changeTime();
                return;
            }
            updateTimer(pomodoroTimer.timeLeft);
            countDown()
        }, 10);
    }

    function changeTime() {
        pomodoroTimer.timeLeft = 0;
        if (pomodoroTimer.state === workState) {
            SetBrake();
        } else {
            SetWork();
        }
    }

    function GetWorkBreakString() {
        if (pomodoroTimer.state === workState) {
            return workState;
        } else {
            return breakState;
        }
    }

    function SetWork(params) {
        pomodoroTimer.state = workState;
        SetTimeToCountdown(workTime);
        updateTimer(pomodoroTimer.cycle);
    }

    function SetBrake(params) {
        pomodoroTimer.state = breakState;
        SetTimeToCountdown(breakTime);
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
            pomodoroTimer.isRunning = true;
            start.textContent = 'Stop';
            pomodoroTimer.startTime = Date.now();
            countDown();
        } else {
            pomodoroTimer.isRunning = false;
            start.textContent = 'Start';
            SetTimeToCountdown(pomodoroTimer.timeLeft);
            clearTimeout(pomodoroTimer.timerId);
        }
    });

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