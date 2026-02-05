let selectedType = 'individual';

function selectType(type) {
    selectedType = type;

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

function registerGuest() {
    const firstName = document.getElementById('firstName').value.trim();
    const secondName = selectedType === 'pair'
        ? document.getElementById('secondName').value.trim()
        : '';
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('messageText').value.trim();

    if (!firstName) {
        showMessage('Введите ваше имя', 'error');
        return;
    }

    if (selectedType === 'pair' && !secondName) {
        showMessage('Введите имя второй персоны', 'error');
        return;
    }

    if (!phone) {
        showMessage('Введите номер телефона', 'error');
        return;
    }

    const guest = {
        id: Date.now(),
        type: selectedType,
        firstName,
        secondName,
        phone,
        message,
        date: new Date().toLocaleDateString('ru-RU')
    };

    let guests = JSON.parse(localStorage.getItem('weddingGuests')) || [];
    guests.push(guest);
    localStorage.setItem('weddingGuests', JSON.stringify(guests));

    showMessage('Спасибо! Ваше участие подтверждено 💖', 'success');

    document.getElementById('registrationForm').reset();
    selectType('individual');
    loadGuests();
}

function loadGuests() {
    const guestsList = document.getElementById('guestsList');
    const guests = JSON.parse(localStorage.getItem('weddingGuests')) || [];

    guestsList.innerHTML = '';

    if (guests.length === 0) {
        guestsList.innerHTML = '<p style="text-align:center;color:#999;">Пока никто не зарегистрировался</p>';
        return;
    }

    guests.sort((a, b) => b.id - a.id);

    guests.forEach(guest => {
        const card = document.createElement('div');
        card.className = 'guest-card';

        card.innerHTML = `
            <i class="fas ${guest.type === 'pair' ? 'fa-users' : 'fa-user'}"></i>
            <div class="guest-info">
                <h4>${guest.firstName}${guest.secondName ? ' и ' + guest.secondName : ''}</h4>
                <p>${guest.date}</p>
            </div>
        `;

        guestsList.appendChild(card);
    });
}

function showMessage(text, type) {
    const el = document.getElementById('message');
    el.textContent = text;
    el.className = `message ${type}`;
    el.style.display = 'block';

    setTimeout(() => {
        el.style.display = 'none';
    }, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
    selectType('individual');
    loadGuests();

    document.getElementById('registrationForm').addEventListener('submit', e => {
        e.preventDefault();
        registerGuest();
    });
});
