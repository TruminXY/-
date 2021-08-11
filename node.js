// 防止右键
document.oncontextmenu = function(e) {
    e = e || window.event;
    e.returnValue = false;
}
document.onselectstart = new Function('event.returnValue=false;');

let progressBar = document.querySelector('.e-c-progress');
let indicator = document.getElementById('e-indicator');
let pointer = document.getElementById('e-pointer');
let length = Math.PI * 2 * 100;
var audio = new Audio("music.mp3");

progressBar.style.strokeDasharray = length;

function update(value, timePercent) {

    var offset = -length - length * value / (timePercent);
    progressBar.style.strokeDashoffset = offset;
    pointer.style.transform = `rotate(${360 * value / (timePercent)}deg)`;
};

const displayOutput = document.querySelector('.display-remain-time')
const pauseBtn = document.getElementById('pause');
const setterBtns = document.querySelectorAll('button[data-setter]');

let intervalTimer;
let timeLeft = 0;
let wholeTime = 0; // 设置初始时间
let isPaused = false;
let isStarted = false;

update(wholeTime, wholeTime);
displayTimeLeft(wholeTime);

function changeWholeTime(seconds) {
    // 更改时间
    if ((wholeTime + seconds) > 0) {
        wholeTime += seconds;
        timeLeft += seconds;
        update(wholeTime, wholeTime);
    }
}

for (var i = 0; i < setterBtns.length; i++) {

    setterBtns[i].addEventListener("click", function(event) {

        var param = this.dataset.setter;
        switch (param) {
            case 'minutes-plus':
                changeWholeTime(5 * 60);
                break;
            case 'minutes-minus':
                changeWholeTime(-1 * 60);
                break;
            case 'seconds-plus':
                changeWholeTime(5);
                break;
            case 'seconds-minus':
                changeWholeTime(-1);
                break;
        }
        displayTimeLeft(wholeTime);
    });
}

function timer(seconds) {
    // 计时
    wholeTime = seconds;
    let remainTime = Date.now() + (wholeTime * 1000);
    let startTime = Date.now();
    displayTimeLeft(wholeTime);
    intervalTimer = setInterval(function() {

        remainTime = startTime + (wholeTime * 1000);
        timeLeft = Math.round((remainTime - Date.now()) / 1000);
        if (timeLeft < 0) {
            audio.play(); // 播放提醒音乐
            clearInterval(intervalTimer);
            isStarted = false;
            setterBtns.forEach(function(btn) {
                btn.style.opacity = 0;
            });
            // 将时间清零
            wholeTime = 0;
            displayTimeLeft(wholeTime);
            // 显示时间清零
            displayOutput.textContent = "END";
            pauseBtn.classList.remove('pause');
            pauseBtn.classList.add('play');
            return;
        }
        displayTimeLeft(timeLeft);
    }, 1000);
}

function pauseTimer(event) {
    // 暂停时间
    audio.currentTime = 0; // 重头开始播放
    audio.pause(); // 关闭提示音乐
    setterBtns.forEach(function(btn) {
        btn.style.opacity = 0.9;
    });
    if (wholeTime == 0) {
        return;
    }
    if (isStarted === false) {

        timer(wholeTime);
        isStarted = true;
        this.classList.remove('play');
        this.classList.add('pause');
        setterBtns.forEach(function(btn) {
            btn.style.opacity = 0.9;
        });
    } else if (isPaused) {
        this.classList.remove('play');
        this.classList.add('pause');
        timer(timeLeft);
        isPaused = isPaused ? false : true
    } else {
        this.classList.remove('pause');
        this.classList.add('play');
        clearInterval(intervalTimer);
        isPaused = isPaused ? false : true;
    }
}

function displayTimeLeft(timeLeft) {
    // 展示时间
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    let displayString = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    displayOutput.textContent = displayString;
    RGB(timeLeft * 2);
    update(timeLeft, wholeTime);
}

pauseBtn.addEventListener('click', pauseTimer);

// document.addEventListener('keydown', function(event) {
//     if ((event.ctrlKey === true || event.metaKey === true) &&
//         (event.which === 61 || event.which === 107 ||
//             event.which === 173 || event.which === 109 ||
//             event.which === 187 || event.which === 189)) {
//         event.preventDefault();
//     }
// }, false);
// // Chrome IE 360
// window.addEventListener('mousewheel', function(event) {
//     if (event.ctrlKey === true || event.metaKey) {
//         event.preventDefault();
//     }
// }, { passive: false });

// //firefox
// window.addEventListener('DOMMouseScroll', function(event) {
//     if (event.ctrlKey === true || event.metaKey) {
//         event.preventDefault();
//     }
// }, { passive: false });

// RGB 彩色
// 平缓的RGB三原色遍历算法
// r = 255 ，g =  0  , b =   0
// r = 255 , g   up  , b =   0
// r  down , g = 255 , b =   0
// r =   0 , g = 255 , b    up
// r =   0 , g  down , b = 255
// r    up , g =   0 , b = 255
// r = 255 , g =   0 , b  down

function judgeLoop(num) {
    num = num % (6 * 256);
    return Math.floor(num / 256);
}


function RGB(num) {

    num += 300;

    var num1 = num % (6 * 256);
    var num2 = (num + 120) % (6 * 256);
    var num3 = (num + 240) % (6 * 256);

    var r1 = 110,
        g1 = 210,
        b1 = 110,
        r2 = 110,
        g2 = 210,
        b2 = 110,
        r3 = 110,
        g3 = 210,
        b3 = 110;

    switch (judgeLoop(num1)) {
        case 0:
            r1 = 255;
            g1 = num1 % 256;
            b1 = 20;
            break;
        case 1:
            r1 = 255 - num1 % 256;
            g1 = 255;
            b1 = 20;
            break;
        case 2:
            r1 = 20;
            g1 = 255;
            b1 = num1 % 256;
            break;
        case 3:
            r1 = 20;
            g1 = 255 - num1 % 256;
            b1 = 255
            break;
        case 4:
            r1 = num1 % 256;
            g1 = 20;
            b1 = 255;
            break;
        case 5:
            r1 = 255;
            g1 = 20;
            b1 = 255 - num1 % 256;
            break;
    }

    switch (judgeLoop(num2)) {
        case 0:
            r2 = 255;
            g2 = num2 % 256;
            b2 = 20;
            break;
        case 1:
            r2 = 255 - num2 % 256;
            g2 = 255;
            b2 = 20;
            break;
        case 2:
            r2 = 20;
            g2 = 255;
            b2 = num2 % 256;
            break;
        case 3:
            r2 = 20;
            g2 = 255 - num2 % 256;
            b2 = 255
            break;
        case 4:
            r2 = num2 % 256;
            g2 = 20;
            b2 = 255;
            break;
        case 5:
            r2 = 255;
            g2 = 20;
            b2 = 255 - num2 % 256;
            break;
    }

    switch (judgeLoop(num3)) {
        case 0:
            r3 = 255;
            g3 = num3 % 256;
            b3 = 20;
            break;
        case 1:
            r3 = 255 - num3 % 256;
            g3 = 255;
            b3 = 20;
            break;
        case 2:
            r3 = 20;
            g3 = 255;
            b3 = num3 % 256;
            break;
        case 3:
            r3 = 20;
            g3 = 255 - num3 % 256;
            b3 = 255;
            break;
        case 4:
            r3 = num3 % 256;
            g3 = 20;
            b3 = 255;
            break;
        case 5:
            r3 = 255;
            g3 = 20;
            b3 = 255 - num3 % 256;
            break;
    }

    var displayNumRGB = document.getElementById('display-remain-time');
    let progressRGB = document.getElementById('rgb-p');
    let baseRGB = document.getElementById('rgb-b');
    let spointer = document.getElementById('rgb-s');
    let epointer = document.getElementById('rgb-e');

    displayNumRGB.style.backgroundImage = "-webkit-linear-gradient(rgb(" + r1 + ", " + g1 + ", " + b1 + "), rgb(" +
        r2 + ", " + g2 + ", " + b2 + "), rgb(" +
        r3 + ", " + g3 + ", " + b3 + "))";
    setterBtns.forEach(function(btn) {
        btn.style.backgroundImage = "-webkit-linear-gradient(rgb(" + r1 + ", " + g1 + ", " + b1 + "), rgb(" +
            r2 + ", " + g2 + ", " + b2 + "), rgb(" +
            r3 + ", " + g3 + ", " + b3 + "))";
    });
    //progressRGB.setAttribute("style", "stroke: rgb(" + r1 + ", " + g1 + ", " + b1 + ")");

    //epointer.setAttribute("style", "stroke: rgb(" + r1 + ", " + g1 + ", " + b1 + ")");
    //spointer.setAttribute("style", "stroke: rgb(" + r1 + ", " + g1 + ", " + b1 + ")");
    //baseRGB.setAttribute("style", "stroke: transparent");
}