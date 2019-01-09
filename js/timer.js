(function name(params) {
    'use strict';

    var timer = document.getElementById('timer');
    var workButton = document.getElementById('work');
    var breakButton = document.getElementById('break');
    var start = document.getElementById('start');

    var startTime;
    var timeLeft;

    const workTime = 25 * 60 * 1000;
    const breakTime = 5 * 60 * 1000;

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
                timeToCountDown = changeTime(timeToCountDown);
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
        if (timeToCountDown === workTime) {
            return 'Work';
        } else {
            return 'Break';
        }
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
            timeToCountDown = timeLeft;
            clearTimeout(timerId);
        }
    });

    workButton.addEventListener('click', function () {
        if (isRunning === true) {
            return;
        }
        timeToCountDown = workTime;
        updateTimer(timeToCountDown);
    });

    breakButton.addEventListener('click', function () {
        if (isRunning === true) {
            return;
        }
        timeToCountDown = breakTime;
        updateTimer(timeToCountDown);
    });
})();