const socket = io();
let timersContainer = document.querySelector('#timers-container');
let timeInputForm = document.querySelector('#timer-form');
let timeInput = document.querySelector('#timeInput');

let timerCount = 0;

timeInputForm.addEventListener('submit', function(event) {
    event.preventDefault();
    let timeInSecs = timeInput.value;

    timerCount++;

    // Create a new timer on the page
    let newTimerDiv = document.createElement('div');
    newTimerDiv.id = `timer-${timerCount}`;

    let newProgressBarDiv = document.createElement('div');
    newProgressBarDiv.classList.add('progress-bar', 'progress-bar-striped', 'progress-bar-animated');
    newProgressBarDiv.role = 'progressbar';
    newProgressBarDiv.style.width = '100%';

    let newTimerHeader = document.createElement('h1');
    newTimerHeader.textContent = formatTime(timeInSecs);

    newTimerDiv.appendChild(newTimerHeader);
    newTimerDiv.appendChild(newProgressBarDiv);
    timersContainer.appendChild(newTimerDiv);

    // Emit start event to server
    socket.emit('start', { time: timeInSecs, timerId: `timer-${timerCount}` });
});

socket.on('time', function(data) {
    // Update the corresponding timer's display and progress bar
    let timerDiv = document.querySelector('#' + data.timerId);
    if (!timerDiv) return;

    let timerHeader = timerDiv.querySelector('h1');
    let progressBarDiv = timerDiv.querySelector('.progress-bar');

    timerHeader.textContent = formatTime(data.time);
    progressBarDiv.style.width = (data.time / timeInSecs * 100) + '%';
});

socket.on('end', function(timerId) {
    // Remove the timer from page
    let timerDiv = document.querySelector('#' + timerId);
    if (timerDiv) {
        timerDiv.remove();
    }
    alert("Time's up");
});

function formatTime(seconds) {
    let minutes = parseInt(seconds / 60, 10);
    let secs = parseInt(seconds % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    secs = secs < 10 ? "0" + secs : secs;

    return minutes + ":" + secs;
}