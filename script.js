document.addEventListener('DOMContentLoaded', () => {
    const currentDateEl = document.getElementById('current-date');
    const currentTimeEl = document.getElementById('current-time');
    const remainingTimeEl = document.getElementById('remaining-time');
    const alarmSound = document.getElementById('alarm-sound');
    const alarmButton = document.getElementById('alarm-button');
    const changeSoundButton = document.getElementById('change-sound-button');
    const fileInput = document.getElementById('file-input');
    const powerToggleButton = document.getElementById('power-toggle-button');
    let powerOn = true;

    // Update the current time and date every second
    setInterval(updateTimeAndDate, 1000);
    setInterval(updateExpirationDate, 1000);

    // Combined play/stop functionality
    alarmButton.addEventListener('click', function() {
        if (alarmSound.paused) {
            alarmSound.play();
            alarmButton.textContent = 'Stop Alarm';
            alarmButton.classList.remove('play');
            alarmButton.classList.add('stop');
        } else {
            alarmSound.pause();
            alarmSound.currentTime = 0;
            alarmButton.textContent = 'Play Alarm';
            alarmButton.classList.remove('stop');
            alarmButton.classList.add('play');
        }
    });

    powerToggleButton.addEventListener('click', function() {
        powerOn = !powerOn;
        if (powerOn) {
            powerToggleButton.textContent = 'Power Off';
        } else {
            powerToggleButton.textContent = 'Power On';
        }
    });

    let selectedDays = 0;

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

        // Trigger alarm at 00, 15, 30, 45 minutes of each hour if power is on
        if (powerOn && [0, 15, 30, 45].includes(minutes) && seconds === 0) {
            alarmSound.play();
        }
    }

    function getDayOfWeek(date) {
        const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        return daysOfWeek[date.getDay()];
    }

    // Change sound button functionality
    changeSoundButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            alarmSound.src = fileURL;
        }
    });
});
