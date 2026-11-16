// Квиз: результаты хранятся ТОЛЬКО в памяти страницы.
// При обновлении страницы всё стирается автоматически.

const form = document.getElementById('quizForm');
const resultBox = document.getElementById('quizResult');

form.addEventListener('submit', function (event) {
    event.preventDefault(); // не перезагружаем страницу

    // Считаем баллы: yes = 2, maybe = 1, no = 0
    let score = 0;
    const totalQuestions = 5;

    for (let i = 1; i <= totalQuestions; i++) {
        const answer = form.querySelector(`input[name="q${i}"]:checked`);
        if (answer) {
            if (answer.value === 'yes') score += 2;
            else if (answer.value === 'maybe') score += 1;
        }
    }

    // Максимум 10 баллов
    let text = '';
    let className = '';

    if (score >= 8) {
        text = '🎉 Отлично! Эта специальность вам подходит. IT-направление — это ваш путь! Приходите на День открытых дверей, чтобы узнать подробнее.';
        className = 'good';
    } else if (score >= 5) {
        text = '🤔 Возможно, вам стоит попробовать. Приходите на мастер-класс — и вы сами решите, ваше ли это.';
        className = 'maybe';
    } else {
        text = '💡 Пока эта специальность не очень похожа на вашу. Но не расстраивайтесь — у нас есть и другие направления! Посмотрите навигатор специальностей.';
        className = 'bad';
    }

    // Показываем результат
    resultBox.textContent = text;
    resultBox.className = 'quiz-result ' + className;

    // Прокрутка к результату
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// ========== LIGHTBOX ГАЛЕРЕЯ ==========
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const lightboxCaption = document.querySelector('.lightbox-caption');
const closeBtn = document.querySelector('.lightbox-close');
const prevBtn = document.querySelector('.lightbox-prev');
const nextBtn = document.querySelector('.lightbox-next');
const galleryImages = document.querySelectorAll('.gallery-img');

let currentIndex = 0;
const images = Array.from(galleryImages).map(img => ({
    src: img.src,
    alt: img.alt
}));

// Открытие lightbox
galleryImages.forEach((img, index) => {
    img.parentElement.addEventListener('click', () => {
        currentIndex = index;
        openLightbox();
    });
});

function openLightbox() {
    lightboxImg.src = images[currentIndex].src;
    lightboxImg.alt = images[currentIndex].alt;
    lightboxCaption.textContent = galleryImages[currentIndex].nextElementSibling?.textContent || '';
    lightbox.classList.remove('hidden');
    setTimeout(() => lightbox.classList.add('active'), 10);
    document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
}

function closeLightbox() {
    lightbox.classList.remove('active');
    setTimeout(() => {
        lightbox.classList.add('hidden');
        document.body.style.overflow = ''; // Возвращаем прокрутку
    }, 300);
}

function showPrevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightboxImage();
}

function showNextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightboxImage();
}

function updateLightboxImage() {
    // Анимация смены фото
    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        lightboxImg.src = images[currentIndex].src;
        lightboxImg.alt = images[currentIndex].alt;
        lightboxCaption.textContent = galleryImages[currentIndex].nextElementSibling?.textContent || '';
        
        lightboxImg.style.opacity = '1';
        lightboxImg.style.transform = 'scale(1)';
    }, 200);
}

// Закрытие по кнопке
closeBtn.addEventListener('click', closeLightbox);

// Навигация стрелками
prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrevImage();
});

nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showNextImage();
});

// Закрытие по клику вне фото
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Управление с клавиатуры
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('hidden')) return;
    
    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowLeft') {
        showPrevImage();
    } else if (e.key === 'ArrowRight') {
        showNextImage();
    }
});

// Свайпы для мобильных устройств
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Свайп влево - следующее фото
            showNextImage();
        } else {
            // Свайп вправо - предыдущее фото
            showPrevImage();
        }
    }
}

// ========== ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК РАСПИСАНИЯ ==========
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Убираем активный класс у всех кнопок и контента
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        // Добавляем активный класс нажатой кнопке и соответствующему контенту
        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});