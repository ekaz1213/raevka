// Данные
let data = JSON.parse(localStorage.getItem('serverData')) || {
    news: [],
    photos: [],
    updates: []
};

// Парсер Minecraft цветов
function parseMinecraftColors(text) {
    if (!text) return '';
    
    const formatting = {
        '&l': '<strong>', '&o': '<em>', '&n': '<u>',
        '&r': '</strong></em></u>'
    };
    
    const colors = {
        '&0': 'color-black',        '&1': 'color-dark-blue',
        '&2': 'color-dark-green',   '&3': 'color-dark-aqua',
        '&4': 'color-dark-red',     '&5': 'color-dark-purple',
        '&6': 'color-gold',         '&7': 'color-gray',
        '&8': 'color-dark-gray',    '&9': 'color-blue',
        '&a': 'color-green',        '&b': 'color-aqua',
        '&c': 'color-red',          '&d': 'color-pink',
        '&e': 'color-yellow',       '&f': 'color-white'
    };
    
    let html = text;
    
    Object.entries(colors).forEach(([code, className]) => {
        const regex = new RegExp(code, 'g');
        html = html.replace(regex, `<span class="${className}">`);
    });
    
    Object.entries(formatting).forEach(([code, tag]) => {
        const regex = new RegExp(code, 'g');
        html = html.replace(regex, tag);
    });
    
    html += '</span></strong></em></u>';
    html = html.replace(/<\/span><\/strong><\/em><\/u>$/g, '');
    
    return html;
}

// Обновление предварительного просмотра
function updatePreview() {
    const title = document.getElementById('news-title')?.value || '';
    const content = document.getElementById('news-content')?.value || '';
    
    const previewElement = document.getElementById('news-preview');
    if (previewElement) {
        const previewText = `${title}<br>${content}`;
        previewElement.innerHTML = parseMinecraftColors(previewText);
    }
}

// Рендеринг списков
function renderAdminLists() {
    renderNewsList();
    renderPhotosList();
    renderUpdatesList();
}

// Рендеринг списка новостей
function renderNewsList() {
    const container = document.getElementById('news-list');
    if (!container) return;
    
    container.innerHTML = `
        <h3>Текущие новости (${data.news.length})</h3>
        ${data.news.map((news, index) => {
            const cleanContent = news.content.replace(/&[0-9a-fk-or]/gi, '');
            return `
                <div class="admin-item" data-id="${news.id}">
                    <img src="${news.image}" alt="${news.title.replace(/&[0-9a-fk-or]/gi, '')}" 
                         class="admin-thumb" loading="lazy">
                    <div class="admin-item-content">
                        <div class="admin-item-title minecraft-text">
                            ${parseMinecraftColors(news.title)}
                        </div>
                        <div class="admin-item-preview">
                            ${cleanContent.substring(0, 100)}${cleanContent.length > 100 ? '...' : ''}
                        </div>
                        <div class="admin-item-meta">
                            <span><i class="fas fa-calendar"></i> ${news.date}</span>
                            ${news.tags && news.tags.length ? `
                                <span style="margin-left: 15px;">
                                    <i class="fas fa-tags"></i> ${news.tags.join(', ')}
                                </span>
                            ` : ''}
                        </div>
                    </div>
                    <div class="admin-item-actions">
                        <button onclick="deleteNews(${index})" class="btn btn-danger btn-small">
                            <i class="fas fa-trash"></i> Удалить
                        </button>
                    </div>
                </div>
            `;
        }).join('')}
    `;
}

// Рендеринг списка фото
function renderPhotosList() {
    const container = document.getElementById('photos-list');
    if (!container) return;
    
    container.innerHTML = `
        <h3>Текущие фото (${data.photos.length})</h3>
        <div class="photos-grid">
            ${data.photos.map((photo, index) => `
                <div class="admin-photo-item">
                    <img src="${photo.url}" alt="${photo.title}" 
                         class="admin-photo" loading="lazy">
                    <div class="admin-photo-info">
                        <div class="admin-photo-title">${photo.title}</div>
                        <button onclick="deletePhoto(${index})" 
                                class="btn btn-danger btn-small">
                            <i class="fas fa-trash"></i> Удалить
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Рендеринг списка обновлений
function renderUpdatesList() {
    const container = document.getElementById('updates-list');
    if (!container) return;
    
    container.innerHTML = `
        <h3>Текущие обновления (${data.updates.length})</h3>
        ${data.updates.map((update, index) => `
            <div class="admin-item">
                <div class="admin-item-content">
                    <div class="admin-item-title">${update.title}</div>
                    <p>${update.description}</p>
                    <div class="admin-item-meta">
                        <span><i class="fas fa-clock"></i> ${update.eta}</span>
                        <span style="margin-left: 15px;">
                            <i class="fas fa-chart-line"></i> Прогресс: ${update.progress || 0}%
                        </span>
                    </div>
                </div>
                <div class="admin-item-actions">
                    <button onclick="deleteUpdate(${index})" 
                            class="btn btn-danger btn-small">
                        <i class="fas fa-trash"></i> Удалить
                    </button>
                </div>
            </div>
        `).join('')}
    `;
}

// Добавление новости
document.getElementById('add-news-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const news = {
        id: Date.now(),
        title: document.getElementById('news-title').value,
        content: document.getElementById('news-content').value,
        image: document.getElementById('news-image').value,
        date: document.getElementById('news-date').value,
        tags: document.getElementById('news-tags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag)
    };
    
    data.news.unshift(news);
    
    if (saveData()) {
        renderAdminLists();
        this.reset();
        updatePreview();
        
        const dateInput = document.getElementById('news-date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
        
        showNotification('Новость успешно добавлена!', 'success');
    }
});

// Добавление фото
document.getElementById('add-photo-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const photo = {
        id: Date.now(),
        title: document.getElementById('photo-title').value,
        url: document.getElementById('photo-url').value
    };
    
    data.photos.unshift(photo);
    
    if (saveData()) {
        renderAdminLists();
        this.reset();
        showNotification('Фото успешно добавлено!', 'success');
    }
});

// Добавление обновления
document.getElementById('add-update-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const update = {
        id: Date.now(),
        title: document.getElementById('update-title').value,
        description: document.getElementById('update-desc').value,
        eta: document.getElementById('update-eta').value,
        progress: parseInt(document.getElementById('update-progress').value) || 0
    };
    
    data.updates.unshift(update);
    
    if (saveData()) {
        renderAdminLists();
        this.reset();
        showNotification('Обновление успешно добавлено!', 'success');
    }
});

// Удаление новости
function deleteNews(index) {
    if (confirm('Вы уверены, что хотите удалить эту новость?')) {
        data.news.splice(index, 1);
        if (saveData()) {
            renderAdminLists();
            showNotification('Новость удалена!', 'info');
        }
    }
}

// Удаление фото
function deletePhoto(index) {
    if (confirm('Вы уверены, что хотите удалить это фото?')) {
        data.photos.splice(index, 1);
        if (saveData()) {
            renderAdminLists();
            showNotification('Фото удалено!', 'info');
        }
    }
}

// Удаление обновления
function deleteUpdate(index) {
    if (confirm('Вы уверены, что хотите удалить это обновление?')) {
        data.updates.splice(index, 1);
        if (saveData()) {
            renderAdminLists();
            showNotification('Обновление удалено!', 'info');
        }
    }
}

// Сохранение данных
function saveData() {
    try {
        localStorage.setItem('serverData', JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Ошибка сохранения данных:', e);
        showNotification('Ошибка сохранения данных!', 'error');
        return false;
    }
}

// Выход из админ-панели
function logout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'index.html';
}

// Проверка авторизации
function checkAuth() {
    if (!localStorage.getItem('adminLoggedIn')) {
        window.location.href = 'index.html';
    }
}

// Отображение уведомлений
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    renderAdminLists();
    
    const titleInput = document.getElementById('news-title');
    const contentInput = document.getElementById('news-content');
    
    if (titleInput && contentInput) {
        titleInput.addEventListener('input', updatePreview);
        contentInput.addEventListener('input', updatePreview);
    }
    
    const dateInput = document.getElementById('news-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        dateInput.min = today;
    }
    
    updatePreview();
});
