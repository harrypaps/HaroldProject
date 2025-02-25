document.addEventListener('DOMContentLoaded', () => {
    const currentDateEl = document.getElementById('current-date');
    const currentTimeEl = document.getElementById('current-time');
    const remainingTimeEl = document.getElementById('remaining-time');
    const alarmSound = new Audio('AudioFiles/alarm1.mp3'); // Default audio
    const alarmButton = document.getElementById('alarm-button');
    const changeSoundButton = document.getElementById('change-sound-button');
    const fileInput = document.getElementById('file-input');
    const powerToggleButton = document.getElementById('power-toggle-button');
    const audioSelect = document.getElementById('audio-select');
    let powerOn = true;
    let lastAlarmMinute = null;
    let selectedDays = 0;

    // Update the current time and date every second
    setInterval(updateTimeAndDate, 1000);
    setInterval(updateExpirationDate, 1000);

    alarmButton.addEventListener('click', function() {
        if (alarmSound.paused) {
            alarmSound.play();
            alarmSound.loop = true; // Loop the audio
            updateAlarmButtonState(true);
        } else {
            alarmSound.pause();
            alarmSound.currentTime = 0;
            updateAlarmButtonState(false);
        }
    });

    powerToggleButton.addEventListener('click', function() {
        powerOn = !powerOn;
        if (powerOn) {
            powerToggleButton.textContent = 'ON';
            powerToggleButton.style.backgroundColor = '#4CAF50'; // Green
        } else {
            powerToggleButton.textContent = 'OFF';
            powerToggleButton.style.backgroundColor = '#FF5733'; // Red
            document.title = 'HAROLD WEB APP'; // Reset the title
        }
    });

    function updateExpirationDate() {
        if (selectedDays > 0) {
            const expirationDateEl = document.getElementById('expiration-date');
            const now = new Date();
            const expirationDate = new Date(now.getTime() + selectedDays * 24 * 60 * 60 * 1000);

            const day = expirationDate.getDate().toString().padStart(2, '0');
            const month = expirationDate.toLocaleString('en-us', { month: 'short' }).toUpperCase();
            const year = expirationDate.getFullYear().toString().slice(2);
            const hours = expirationDate.getHours().toString().padStart(2, '0');
            const minutes = expirationDate.getMinutes().toString().padStart(2, '0');

            const formattedExpirationDate = `${day}${month}${year} ${hours}${minutes}`;
            expirationDateEl.textContent = `Expiration Date: ${formattedExpirationDate}`;
        }
    }

    document.getElementById('180-days-button').addEventListener('click', () => {
        selectedDays = 180;
        updateExpirationDate();
        selectButton('180-days-button');
    });

    document.getElementById('210-days-button').addEventListener('click', () => {
        selectedDays = 210;
        updateExpirationDate();
        selectButton('210-days-button');
    });

    function selectButton(buttonId) {
        document.querySelectorAll('.days-button').forEach(button => {
            button.classList.remove('selected');
        });
        document.getElementById(buttonId).classList.add('selected');
    }

    function formatDate(date) {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const dayOfWeek = daysOfWeek[date.getDay()];

        return `${year}.${month}.${day} ${dayOfWeek.toUpperCase()}`;
    }

    function updateTimeAndDate() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        currentTimeEl.textContent = formattedTime;
        const formattedDate = `${now.getFullYear()}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getDate().toString().padStart(2, '0')} ${getDayOfWeek(now)}`;
        currentDateEl.textContent = formattedDate;
        if (powerOn) {
            let remainingMinutes = 20 - (minutes % 20) - 1;
            let remainingSeconds = 60 - seconds;
            if (remainingSeconds === 60) {
                remainingMinutes += 1;
                remainingSeconds = 0;
            }
            const remainingTimeText = `Next alarm in ${remainingMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
            remainingTimeEl.textContent = remainingTimeText;
            document.title = `${remainingTimeText} | HAROLD WEB APP`;
            if ([0, 20, 40].includes(minutes) && seconds === 0 && lastAlarmMinute !== minutes) {
                alarmSound.play();
                lastAlarmMinute = minutes;
                updateAlarmButtonState(true); // Ensure button state updates when alarm starts automatically
            }
        } else {
            remainingTimeEl.textContent = '';
        }
}

    function getDayOfWeek(date) {
        const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        return daysOfWeek[date.getDay()];
    }

    // Handle Change Sound Button
    changeSoundButton.addEventListener('click', () => {
        fileInput.click(); // Triggers file input dialog
    });

    // Handle File Input Change Event
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            alarmSound.src = fileURL;
            alarmSound.loop = true; // Loop the audio
            updateAlarmButtonState(false); // Reset button state after changing sound
        }
    });

    // Handle Audio Select Dropdown Change Event
    audioSelect.addEventListener('change', function(event) {
        const selectedAudio = event.target.value;
        alarmSound.src = selectedAudio;
        alarmSound.loop = true; // Loop the audio
        if (!alarmSound.paused) {
            alarmSound.play(); // Restart the audio if it's currently playing
        }
        updateAlarmButtonState(false); // Reset button state after changing sound
    });

    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && powerOn) {
            const now = new Date();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            if ([0, 15, 30, 45].includes(minutes) && seconds === 0 && lastAlarmMinute !== minutes) {
                alarmSound.play();
                lastAlarmMinute = minutes;
                updateAlarmButtonState(true); // Ensure button state updates when alarm starts automatically
            }
        }
    });

    function updateAlarmButtonState(isPlaying) {
        if (isPlaying) {
            alarmButton.textContent = 'Stop Alarm';
            alarmButton.classList.remove('play');
            alarmButton.classList.add('stop');
        } else {
            alarmButton.textContent = 'Play Alarm';
            alarmButton.classList.remove('stop');
            alarmButton.classList.add('play');
        }
    }
});
