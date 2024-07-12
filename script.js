document.addEventListener('DOMContentLoaded', () => {
    const currentTimeElement = document.getElementById('current-time');
    const remainingTimeElement = document.getElementById('remaining-time');
    const stopButton = document.getElementById('stop-button');
    const playButton = document.getElementById('play-button');
    const changeSoundButton = document.getElementById('change-sound-button');
    const alarmSound = document.getElementById('alarm-sound');

    // Function to update the current time
    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        currentTimeElement.textContent = `${hours}:${minutes}:${seconds}`;

        // Calculate remaining time for the next alarm
        const nextAlarmMinutes = [0, 15, 30, 45].find(m => m > now.getMinutes()) || 0;
        const nextAlarmTime = new Date(now);
        nextAlarmTime.setMinutes(nextAlarmMinutes, 0, 0);
        if (nextAlarmMinutes === 0 && now.getMinutes() >= 45) {
            nextAlarmTime.setHours(now.getHours() + 1);
        }
        const remainingTime = Math.ceil((nextAlarmTime - now) / 1000 / 60);
        remainingTimeElement.textContent = `Next Alarm In: ${remainingTime} minutes`;

        // Check if it's time to ring the alarm
        if ([0, 15, 30, 45].includes(now.getMinutes()) && now.getSeconds() === 0) {
            alarmSound.play();
        }
    }

    // Stop the alarm sound
    stopButton.addEventListener('click', () => {
        alarmSound.pause();
        alarmSound.currentTime = 0;
    });

    // Play the alarm sound manually
    playButton.addEventListener('click', () => {
        alarmSound.play();
    });

    // Change sound button functionality (placeholder)
    changeSoundButton.addEventListener('click', () => {
        // Implement sound change functionality here
        alert('Change Sound Placeholder');
    });

    // Handle spacebar shortcut for stop button
    document.addEventListener('keydown', (event) => {
        if (event.key === ' ' || event.keyCode === 32) {
            // Spacebar pressed, trigger stop button click
            stopButton.click();
        }
    });

    // Update time every second
    setInterval(updateTime, 1000);
    updateTime();  // Initial call to display time immediately
});
