(function name(params) {
    'use strict';

    var timer = document.getElementById('timer');
    var workButton = document.getElementById('work');
    var breakButton = document.getElementById('break');
    var start = document.getElementById('start');

    var startTime;
    var timeLeft;

    const workState = 'Work';
    const workTime = 25 * 60 * 1000;
    const breakState = 'Break';
    const breakTime = 5 * 60 * 1000;

    var timeState = workState;
    var timeToCountDown = workTime;
    var timerId;
    var isRunning = false;

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
        timerId = setTimeout(function () {
            timeLeft = timeToCountDown - (Date.now() - startTime);
            if (timeLeft < 0) {
                isRunning = false;
                start.textContent = 'Start';

                clearTimeout(timerId);
                timeLeft = 0;
                SetTimeToCountdown(changeTime(timeToCountDown));
                updateTimer(timeToCountDown);
                return;
            }
            updateTimer(timeLeft);
            countDown()
        }, 10);
    }

    function changeTime(time) {
        if (time === workTime) {
            return breakTime;
        } else {
            return workTime;
        }
    }

    function GetWorkBreakString() {
        if (timeState === workState) {
            return workState;
        } else {
            return breakState;
        }
    }

    function SetWork(params) {
        timeState = workState;
        SetTimeToCountdown(workTime);
    }

    function SetBrake(params) {
        timeState = breakState;
        SetTimeToCountdown(breakTime);
    }

    function SetTimeToCountdown(time) {
        timeToCountDown = time;
    }

    window.onload = function () {
        // ページ読み込み時に実行したい処理
        updateTimer(timeToCountDown);
    }

    start.addEventListener('click', function () {
        if (isRunning === false) {
            isRunning = true;
            start.textContent = 'Stop';
            startTime = Date.now();
            countDown();
        } else {
            isRunning = false;
            start.textContent = 'Start';
            SetTimeToCountdown(timeLeft);
            clearTimeout(timerId);
        }
    });

    workButton.addEventListener('click', function () {
        if (isRunning === true) {
            return;
        }
        SetWork();
        updateTimer(timeToCountDown);
    });

    breakButton.addEventListener('click', function () {
        if (isRunning === true) {
            return;
        }
        SetBrake();
        updateTimer(timeToCountDown);
    });
})();