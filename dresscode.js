function playMusic(type) {
    const day = document.getElementById('music-day');
    const night = document.getElementById('music-night');

    // Останавливаем всё
    day.pause();
    night.pause();

    day.currentTime = 0;
    night.currentTime = 0;

    if (type === 'day') {
        day.play();
    } else {
        night.play();
    }
}
