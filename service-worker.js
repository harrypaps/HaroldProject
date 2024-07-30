self.addEventListener('install', event => {
    console.log('Service Worker installing.');
});

self.addEventListener('activate', event => {
    console.log('Service Worker activated.');
});

self.addEventListener('message', event => {
    if (event.data === 'play-alarm') {
        playAlarmSound();
    }
});

function playAlarmSound() {
    self.registration.showNotification('Alarm', {
        body: 'Your alarm is ringing!',
        icon: 'alarm-icon.png' // Ensure you have an icon file
    });

    const audio = new Audio('alarm.mp3');
    audio.play();
}
