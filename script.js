document.addEventListener('DOMContentLoaded', () => {
    const currentDateEl = document.getElementById('current-date');
    const currentTimeEl = document.getElementById('current-time');
    const remainingTimeEl = document.getElementById('remaining-time');
    const stopButton = document.getElementById('stop-button');
    const playButton = document.getElementById('play-button');
    const changeSoundButton = document.getElementById('change-sound-button');
    const fileInput = document.getElementById('file-input');
    const alarmSound = document.getElementById('alarm-sound');

  
    // Update the current time and date every second
    setInterval(updateTimeAndDate, 1000);

    // Stop alarm when the stop button is clicked
    stopButton.addEventListener('click', () => {
        alarmSound.pause();
        alarmSound.currentTime = 0;
    });

    // Play alarm when the play button is clicked
    playButton.addEventListener('click', () => {
        alarmSound.play();
    });

    // Trigger file input click when change sound button is clicked
    changeSoundButton.addEventListener('click', () => {
        fileInput.click();
    });

    // Change the sound file when a new file is selected
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            alarmSound.src = fileURL;
        }
    });

    // Trigger stop button when the spacebar is pressed
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            stopButton.click();
        }
    });

    function updateTimeAndDate() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        // Format the time as HH:MM:SS
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Update current time
        currentTimeEl.textContent = formattedTime;

        // Format the date as "YYYY.MM.DD DAY"
        const formattedDate = `${now.getFullYear()}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getDate().toString().padStart(2, '0')} ${getDayOfWeek(now)}`;

        // Update current date
        currentDateEl.textContent = formattedDate;

        // Calculate remaining time until next alarm
        let remainingMinutes = 15 - (minutes % 15) - 1;
        let remainingSeconds = 60 - seconds;
        if (remainingSeconds === 60) {
            remainingMinutes += 1;
            remainingSeconds = 0;
        }

        // Display remaining time until next alarm
        remainingTimeEl.textContent = `Next alarm in ${remainingMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;

        // Trigger alarm at 00, 15, 30, 45 minutes of each hour
        if ([0, 15, 30, 45].includes(minutes) && seconds === 0) {
            alarmSound.play();
        }
    }

    function getDayOfWeek(date) {
        const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        return daysOfWeek[date.getDay()];
    }
     
});
