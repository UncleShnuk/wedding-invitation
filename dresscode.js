document.addEventListener('DOMContentLoaded', function() {
    const day = document.getElementById('music-day');
    const night = document.getElementById('music-night');
    const btnDay = document.getElementById('musicBtnDay');
    const btnNight = document.getElementById('musicBtnNight');

    function pauseAll() {
        [day, night].forEach(a => {
            if (a) {
                try { a.pause(); } catch(e) {}
                try { a.currentTime = 0; } catch(e) {}
            }
        });
        if (btnDay) { btnDay.classList.remove('playing'); btnDay.setAttribute('aria-pressed', 'false'); btnDay.querySelector('.btn-text')?.textContent = 'Атмосфера'; }
        if (btnNight) { btnNight.classList.remove('playing'); btnNight.setAttribute('aria-pressed', 'false'); btnNight.querySelector('.btn-text')?.textContent = 'Настроение'; }
    }

    function toggle(audio, button) {
        if (!audio) return;
        // Если уже играет — поставить на паузу
        if (!audio.paused && audio.currentTime > 0) {
            audio.pause();
            audio.currentTime = 0;
            if (button) { button.classList.remove('playing'); button.setAttribute('aria-pressed', 'false'); button.querySelector('.btn-text')?.textContent = (button === btnDay ? 'Атмосфера' : 'Настроение'); }
            return;
        }

        // Иначе остановить всё и запустить выбранное
        pauseAll();
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                if (button) { button.classList.add('playing'); button.setAttribute('aria-pressed', 'true'); button.querySelector('.btn-text')?.textContent = 'Пауза'; }
            }).catch(err => {
                console.warn('Не удалось воспроизвести аудио:', err);
                // Некоторые мобильные браузеры блокируют воспроизведение без явного взаимодействия — покажем подсказку
                alert('Нажмите ещё раз кнопку воспроизведения, чтобы разрешить звук на устройстве.');
            });
        } else {
            if (button) { button.classList.add('playing'); button.setAttribute('aria-pressed', 'true'); button.querySelector('.btn-text')?.textContent = 'Пауза'; }
        }

        audio.onended = () => {
            if (button) { button.classList.remove('playing'); button.setAttribute('aria-pressed', 'false'); button.querySelector('.btn-text')?.textContent = (button === btnDay ? 'Атмосфера' : 'Настроение'); }
        };
    }

    if (btnDay) btnDay.addEventListener('click', () => toggle(day, btnDay));
    if (btnNight) btnNight.addEventListener('click', () => toggle(night, btnNight));

    // Клики по картинке тоже переключают музыку соответствующего типа
    document.querySelectorAll('.dress-gallery img').forEach(img => {
        img.addEventListener('click', () => {
            const type = img.dataset.music || img.getAttribute('data-music');
            if (type === 'day') toggle(day, btnDay);
            else if (type === 'night') toggle(night, btnNight);
        });
        // Для клавиатурной доступности
        img.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); img.click(); } });
    });
});
