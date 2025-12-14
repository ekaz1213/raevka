// Данные по умолчанию
let data = {
    news: [
        {
            id: 1,
            title: "&aНовый бизнес-режим 3.13!",
            content: "&eВнимание, жители Раевки! &bМы запустили новый бизнес-режим! &aТеперь вы можете создавать компании, нанимать сотрудников и развивать экономику поселка. &cНе упустите возможность стать успешным предпринимателем! &lНовые возможности ждут вас!",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            date: "2024-03-15",
            tags: ["Бизнес", "Обновление", "Важно"]
        }
    ],
    photos: [
        {
            id: 1,
            url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            title: "Центральная площадь Раевки"
        },
        {
            id: 2,
            url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            title: "Бизнес-район города"
        },
        {
            id: 3,
            url: "https://images.unsplash.com/photo-1531315630201-bb15abeb1653?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            title: "Ночной вид на поселок"
        },
        {
            id: 4,
            url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            title: "Сельскохозяйственные угодья"
        }
    ],
    updates: [
        {
            id: 1,
            title: "Банковская система",
            description: "Внедрение банковских счетов, кредитов и депозитов для игроков",
            eta: "Апрель 2024",
            progress: 75
        },
        {
            id: 2,
            title: "Аукцион и биржа",
            description: "Торговая площадка для покупки и продажи ресурсов и предметов",
            eta: "Май 2024",
            progress: 45
        },
        {
            id: 3,
            title: "Система кланов",
            description: "Создание кланов, общие территории и клановые войны",
            eta: "Июнь 2024",
            progress: 20
        }
    ]
};

// Парсер Minecraft цветов
function parseMinecraftColors(text) {
    if (!text) return '';
    
    // Сначала сохраняем HTML теги от форматирования
    const formatting = {
        '&l': '<strong>', '&o': '<em>', '&n': '<u>',
        '&r': '</strong></em></u>'
    };
    
    // Коды цветов Minecraft
    const colors = {
        '&0': 'color-black',        '&1': 'color-dark-blue',
        '&2': 'color-dark-green',   '&3': 'color-dark-aqua',
        '&4': 'color-dark-red',     '&5': 'color-dark-purple',
        '6': 'color-gold',          '&7': 'color-gray',
        '&8': 'color-dark-gray',    '&9': 'color-blue',
        '&a': 'color-green',        '&b': 'color-aqua',
        '&c': 'color-red',          '&d': 'color-pink',
        '&e': 'color-yellow',       '&f': 'color-white'
    };
    
    let html = text;
    
    // Заменяем цвета
    Object.entries(colors).forEach(([code, className]) => {
        const regex = new RegExp(code, 'g');
        html = html.replace(regex, `<span class="${className}">`);
    });
    
    // Заменяем форматирование
    Object.entries(formatting).forEach(([code, tag]) => {
        const regex = new RegExp(code, 'g');
        html = html.replace(regex, tag);
    });
    
    // Закрываем все открытые теги в конце
    html += '</span></strong></em></u>';
    
    // Убираем лишние закрывающие теги
    html = html.replace(/<\/span><\/strong><\/em><\/u>$/g, '');
    
    return html;
}

// Предварительный просмотр цветного текста (для админки)
function previewMinecraftColors(text) {
    return parseMinecraftColors(text);
}

// Загрузка данных из localStorage
function loadData() {
    const savedData = localStorage.getItem('serverData');
    if (savedData) {
        try {
            data = JSON.parse(savedData);
        } catch (e) {
            console.error('Ошибка загрузки данных:', e);
        }
    }
    renderAll();
}

// Сохранение данных
function saveData() {
    try {
        localStorage.setItem('serverData', JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Ошибка сохранения данных:', e);
        alert('Ошибка сохранения данных. Проверьте объем localStorage.');
        return false;
    }
}

// Рендеринг новостей с поддержкой цветного текста
function renderNews() {
    const container = document.getElementById('news-container');
    if (!container) return;
    
    container.innerHTML = data.news.map(news => {
        const coloredTitle = parseMinecraftColors(news.title);
        const coloredContent = parseMinecraftColors(news.content);
        
        return `
            <article class="news-card">
                <img src="${news.image}" alt="${news.title.replace(/&[0-9a-fk-or]/gi, '')}" 
                     class="news-image" loading="lazy">
                <div class="news-content">
                    <div class="news-date">${news.date}</div>
                    <h3 class="minecraft-text">${coloredTitle}</h3>
                    <div class="news-text">${coloredContent}</div>
                    ${news.tags ? `
                        <div class="news-tags">
                            ${news.tags.map(tag => `<span class="news-tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </article>
        `;
    }).join('');
}

// Рендеринг фото
function renderPhotos() {
    const container = document.getElementById('gallery-container');
    if (!container) return;
    
    container.innerHTML = data.photos.map(photo => `
        <div class="gallery-item">
            <img src="${photo.url}" alt="${photo.title}" loading="lazy">
            <div class="gallery-overlay">
                <h4>${photo.title}</h4>
            </div>
        </div>
    `).join('');
}

// Рендеринг обновлений
function renderUpdates() {
    const container = document.getElementById('updates-container');
    if (!container) return;
    
    container.innerHTML = data.updates.map(update => `
        <div class="update-item">
            <div class="update-header">
                <h3 class="update-title">${update.title}</h3>
                <span class="update-date">${update.eta}</span>
            </div>
            <p class="update-description">${update.description}</p>
            <div class="update-progress">
                <div class="progress-bar" style="width: ${update.progress || 0}%"></div>
            </div>
            <div class="progress-text">Выполнено: ${update.progress || 0}%</div>
        </div>
    `).join('');
}

// Обновление онлайн-статуса
function updateOnlineStatus() {
    const onlineElement = document.getElementById('online-count');
    if (!onlineElement) return;
    
    // Имитация изменения онлайн-статуса
    const baseOnline = 47;
    const variation = Math.floor(Math.random() * 10) - 5;
    const currentOnline = Math.max(1, Math.min(100, baseOnline + variation));
    
    onlineElement.textContent = currentOnline;
    
    // Обновляем каждую минуту
    setTimeout(updateOnlineStatus, 60000);
}

// Рендеринг всего контента
function renderAll() {
    renderNews();
    renderPhotos();
    renderUpdates();
    updateOnlineStatus();
}

// Админ-панель
function openAdminPanel() {
    const modal = document.getElementById('admin-modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeAdminModal() {
    const modal = document.getElementById('admin-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Вход администратора
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('admin-password').value;
            
            // Пароль для демонстрации
            if (password === 'admin123') {
                localStorage.setItem('adminLoggedIn', 'true');
                window.location.href = 'admin.html';
            } else {
                alert('Неверный пароль! Попробуйте снова.');
                document.getElementById('admin-password').value = '';
                document.getElementById('admin-password').focus();
            }
        });
    }
    
    loadData();
});

// Закрытие модального окна при клике вне его
window.addEventListener('click', function(event) {
    const modal = document.getElementById('admin-modal');
    if (event.target === modal) {
        closeAdminModal();
    }
});

// Закрытие по ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeAdminModal();
    }
});

// Плавная прокрутка для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Анимация при прокрутке
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Наблюдаем за элементами при загрузке
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.news-card, .update-item, .feature-card').forEach(el => {
        observer.observe(el);
    });
});
