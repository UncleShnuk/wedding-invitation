// Текущий выбранный тип регистрации
let selectedType = 'individual';

// Функция выбора типа регистрации
function selectType(type) {
    selectedType = type;
    
    // Обновляем визуальное выделение
    document.getElementById('individualOption').classList.remove('selected');
    document.getElementById('pairOption').classList.remove('selected');
    
    if (type === 'individual') {
        document.getElementById('individualOption').classList.add('selected');
        document.getElementById('secondPersonGroup').style.display = 'none';
        document.getElementById('secondName').required = false;
    } else {
        document.getElementById('pairOption').classList.add('selected');
        document.getElementById('secondPersonGroup').style.display = 'block';
        document.getElementById('secondName').required = true;
    }
}

// Функция регистрации гостя
function registerGuest() {
    // Получаем данные из формы
    const firstName = document.getElementById('firstName').value.trim();
    const secondName = selectedType === 'pair' ? document.getElementById('secondName').value.trim() : '';
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('messageText').value.trim();
    
    // Валидация
    if (!firstName) {
        showMessage('Пожалуйста, введите ваше имя', 'error');
        return;
    }
    
    if (selectedType === 'pair' && !secondName) {
        showMessage('Пожалуйста, введите имя второй персоны', 'error');
        return;
    }
    
    if (!email) {
        showMessage('Пожалуйста, введите email', 'error');
        return;
    }
    
    // Проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Пожалуйста, введите корректный email', 'error');
        return;
    }
    
    // Создаем объект гостя
    const guest = {
        id: Date.now(), // уникальный ID
        type: selectedType,
        firstName: firstName,
        secondName: secondName,
        email: email,
        phone: phone,
        message: message,
        date: new Date().toLocaleDateString('ru-RU')
    };
    
    // Получаем существующих гостей из localStorage
    let guests = JSON.parse(localStorage.getItem('weddingGuests')) || [];
    
    // Проверяем, не зарегистрирован ли уже этот email
    const existingGuest = guests.find(g => g.email === email);
    if (existingGuest) {
        showMessage('Этот email уже зарегистрирован', 'error');
        return;
    }
    
    // Добавляем нового гостя
    guests.push(guest);
    
    // Сохраняем в localStorage
    localStorage.setItem('weddingGuests', JSON.stringify(guests));
    
    // Показываем сообщение об успехе
    showMessage('Спасибо! Ваше участие подтверждено. Мы с нетерпением ждем встречи!', 'success');
    
    // Очищаем форму
    document.getElementById('registrationForm').reset();
    
    // Сбрасываем тип на индивидуальный
    selectType('individual');
    
    // Обновляем список гостей
    loadGuests();
}

// Функция загрузки списка гостей
function loadGuests() {
    const guestsList = document.getElementById('guestsList');
    const guests = JSON.parse(localStorage.getItem('weddingGuests')) || [];
    
    // Очищаем список
    guestsList.innerHTML = '';
    
    // Если гостей нет, показываем сообщение
    if (guests.length === 0) {
        guestsList.innerHTML = '<p style="text-align: center; width: 100%; color: #999; grid-column: 1 / -1;">Пока никто не зарегистрировался. Будьте первым!</p>';
        return;
    }
    
    // Сортируем гостей по дате регистрации (новые первыми)
    guests.sort((a, b) => b.id - a.id);
    
    // Ограничиваем количество отображаемых гостей (например, 20 последних)
    const displayGuests = guests.slice(0, 20);
    
    // Отображаем каждого гостя
    displayGuests.forEach(guest => {
        const guestCard = document.createElement('div');
        guestCard.className = 'guest-card';
        
        let guestHTML = '';
        
        if (guest.type === 'individual') {
            guestHTML = `
                <i class="fas fa-user"></i>
                <div class="guest-info">
                    <h4>${escapeHtml(guest.firstName)}</h4>
                    <p>Зарегистрирован(а) ${guest.date}</p>
                </div>
            `;
        } else {
            guestHTML = `
                <i class="fas fa-users"></i>
                <div class="guest-info">
                    <h4>${escapeHtml(guest.firstName)} и ${escapeHtml(guest.secondName)}</h4>
                    <p>Зарегистрированы ${guest.date}</p>
                </div>
            `;
        }
        
        guestCard.innerHTML = guestHTML;
        guestsList.appendChild(guestCard);
    });
    
    // Если гостей больше, чем отображается, показываем сообщение
    if (guests.length > 20) {
        const moreGuests = document.createElement('p');
        moreGuests.style.textAlign = 'center';
        moreGuests.style.gridColumn = '1 / -1';
        moreGuests.style.color = '#999';
        moreGuests.textContent = `... и ещё ${guests.length - 20} гостей`;
        guestsList.appendChild(moreGuests);
    }
}

// Функция отображения сообщений
function showMessage(text, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = text;
    messageElement.className = `message ${type}`;
    messageElement.style.display = 'block';
    
    // Скрываем сообщение через 5 секунд
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);
}

// Функция для экранирования HTML-символов (защита от XSS)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Инициализация формы
document.addEventListener('DOMContentLoaded', function() {
    // Выбираем по умолчанию индивидуальную регистрацию
    selectType('individual');
    
    // Загружаем список гостей
    loadGuests();
    
    // Обработка отправки формы
    document.getElementById('registrationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        registerGuest();
    });
    
    // Добавляем обработчики для клавиши Enter в форме
    const formInputs = document.querySelectorAll('#registrationForm input');
    formInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                registerGuest();
            }
        });
    });
});