document.addEventListener('DOMContentLoaded', () => {
    const currentDateEl = document.getElementById('current-date');
    const currentTimeEl = document.getElementById('current-time');
    const remainingTimeEl = document.getElementById('remaining-time');
    const changeSoundButton = document.getElementById('change-sound-button');
    const fileInput = document.getElementById('file-input');
    const alarmButton = document.getElementById('alarm-button');
    const alarmSound = document.getElementById('alarm-sound');
    let selectedDays = 0;
    let audioContext;
    let audioBuffer;
    let source;

    // Initialize AudioContext
    function initAudioContext() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        fetch(alarmSound.src)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(buffer => {
                audioBuffer = buffer;
            });
    }

    // Play alarm sound using AudioContext
    function playAlarmSound() {
        if (audioContext && audioBuffer) {
            source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.loop = true;
            source.start(0);
        }
    }

    // Stop alarm sound
    function stopAlarmSound() {
        if (source) {
            source.stop(0);
            source = null;
        }
    }

    // Handle alarm button click
    alarmButton.addEventListener('click', function() {
        if (!audioContext) {
            initAudioContext();
        }
        if (source) {
            stopAlarmSound();
            alarmButton.textContent = 'Play Alarm';
            alarmButton.classList.remove('stop');
            alarmButton.classList.add('play');
        } else {
            playAlarmSound();
            alarmButton.textContent = 'Stop Alarm';
            alarmButton.classList.remove('play');
            alarmButton.classList.add('stop');
        }
    });

    // Update the current time and date every second
    setInterval(updateTimeAndDate, 1000);
    setInterval(updateExpirationDate, 1000);

    // Update the expiration date
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

    // Event listeners for the 180 and 210 days buttons
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

    // Function to format the current date
    function formatDate(date) {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const dayOfWeek = daysOfWeek[date.getDay()];

        return `${year}.${month}.${day} ${dayOfWeek.toUpperCase()}`;
    }

    // Function to update the current time and remaining time
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
        if ([0, 18, 41, 42].includes(minutes) && seconds === 0) {
            playAlarmSound();
        }
    }

    function getDayOfWeek(date) {
        const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        return daysOfWeek[date.getDay()];
    }

    // Change sound button functionality
    document.getElementById('change-sound-button').addEventListener('click', () => {
        document.getElementById('file-input').click();
    });

    document.getElementById('file-input').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            fetch(fileURL)
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
                .then(buffer => {
                    audioBuffer = buffer;
                });
        }
    });
});
