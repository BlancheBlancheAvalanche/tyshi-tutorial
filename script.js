/* НАВИГАЦИЯ ПО ГЛАВНЫМ СТРАНИЦАМ */

function showPage(pageId) {
    // Скрыть все страницы
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // Показать нужную
    const target = document.getElementById('page-' + pageId);
    if (target) target.classList.add('active');

    // Обновить кнопки навигации
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === pageId);
    });

    // Прокрутить наверх
    window.scrollTo(0, 0);
}

// Обработка кнопок главной навигации
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => showPage(btn.dataset.page));
});

// Обработка больших кнопок на главной
document.querySelectorAll('.big-btn').forEach(btn => {
    btn.addEventListener('click', () => showPage(btn.dataset.page));
});

// Обработка кнопок "Главная" из подстраниц
document.querySelectorAll('.nav-sub-btn[data-page="home"]').forEach(btn => {
    btn.addEventListener('click', () => showPage('home'));
});


/* НАВИГАЦИЯ ПО ПОДВКЛАДКАМ (лекции / лабы) */

function showSubpage(subId, parentNavId) {
    // Найти родительский контейнер
    const parentSection = document.getElementById('page-' + parentNavId);
    if (!parentSection) return;

    // Скрыть все подстраницы внутри этого раздела
    parentSection.querySelectorAll('.subpage').forEach(sp => sp.classList.remove('active'));

    // Показать нужную
    const target = document.getElementById(subId);
    if (target) target.classList.add('active');

    // Обновить кнопки подвкладок
    const tabsContainer = parentSection.querySelector('.subtabs');
    if (tabsContainer) {
        tabsContainer.querySelectorAll('.subtab-btn').forEach(tb => {
            tb.classList.toggle('active', tb.dataset.sub === subId);
        });
    }

    window.scrollTo(0, 0);
}

// Обработка кнопок подвкладок
document.querySelectorAll('.subtab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Определяем родительский раздел (lectures или labs)
        const section = btn.closest('section');
        const pageId = section.id.replace('page-', '');
        showSubpage(btn.dataset.sub, pageId);
    });
});

// Обработка кнопок "След. / Пред." внутри подстраниц
document.querySelectorAll('.nav-sub-btn[data-sub]').forEach(btn => {
    btn.addEventListener('click', () => {
        const section = btn.closest('section');
        const pageId = section.id.replace('page-', '');
        showSubpage(btn.dataset.sub, pageId);
    });
});


/* ТЕСТ — ПРОВЕРКА И СБРОС */

// Правильные ответы (заполните своими данными)
const correctAnswers = {
    // ОДИН ВАРИАНТ — укажите букву правильного ответа
    q1: 'a',
    q2: 'b',
    q3: 'c',
    q4: 'd',
    q5: 'a',
    q6: 'b',
    q7: 'c',
    q8: 'd',

    // НЕСКОЛЬКО ВАРИАНТОВ — массив правильных букв
    q9:  ['a', 'c'],
    q10: ['b'],
    q11: ['a', 'b', 'd'],
    q12: ['c', 'd'],
    q13: ['a'],
    q14: ['b', 'c'],
    q15: ['a', 'd'],
    q16: ['b'],

    // СОПОСТАВЛЕНИЕ — объект с правильными значениями для каждого select
    q17: { q17a: '1', q17b: '2', q17c: '3' },
    q18: { q18a: '2', q18b: '3', q18c: '1' },
    q19: { q19a: 'c', q19b: 'a', q19c: 'b' },
    q20: { q20a: '3', q20b: '1', q20c: '2' },

    // ОТВЕТ ТЕКСТОМ — строка (регистронезависимое сравнение)
    q21: 'ответ 1',
    q22: 'ответ 2',
    q23: 'ответ 3',
    q24: 'ответ 4',
    q25: 'ответ 5',
    q26: 'ответ 6',
    q27: 'ответ 7',
    q28: 'ответ 8',
    q29: 'ответ 9',
    q30: 'ответ 10',
};

function checkTest() {
    let total = 30;
    let score = 0;
    let details = [];

    // --- ОДИН ВАРИАНТ (q1–q8) ---
    for (let i = 1; i <= 8; i++) {
        const name = 'q' + i;
        const selected = document.querySelector(`input[name="${name}"]:checked`);
        const userAnswer = selected ? selected.value : null;
        if (userAnswer === correctAnswers[name]) {
            score++;
        } else {
            details.push(`Вопрос ${i}: ваш ответ — ${userAnswer || '—'}, правильный — ${correctAnswers[name]}`);
        }
    }

    // --- НЕСКОЛЬКО ВАРИАНТОВ (q9–q16) ---
    for (let i = 9; i <= 16; i++) {
        const name = 'q' + i;
        const checked = Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
            .map(el => el.value)
            .sort();
        const correct = [...correctAnswers[name]].sort();
        const match = JSON.stringify(checked) === JSON.stringify(correct);
        if (match) {
            score++;
        } else {
            details.push(`Вопрос ${i}: ваш ответ — [${checked.join(', ')}], правильный — [${correct.join(', ')}]`);
        }
    }

    // --- СОПОСТАВЛЕНИЕ (q17–q20) ---
    for (let i = 17; i <= 20; i++) {
        const name = 'q' + i;
        const correctObj = correctAnswers[name];
        let allCorrect = true;
        let userParts = [];
        let correctParts = [];
        for (const [field, val] of Object.entries(correctObj)) {
            const el = document.querySelector(`select[name="${field}"]`);
            const userVal = el ? el.value : '';
            if (userVal !== val) allCorrect = false;
            userParts.push(`${field}=${userVal || '—'}`);
            correctParts.push(`${field}=${val}`);
        }
        if (allCorrect) {
            score++;
        } else {
            details.push(`Вопрос ${i}: ваш — {${userParts.join(', ')}}, правильный — {${correctParts.join(', ')}}`);
        }
    }

    // --- ОТВЕТ ТЕКСТОМ (q21–q30) ---
    for (let i = 21; i <= 30; i++) {
        const name = 'q' + i;
        const el = document.querySelector(`input[name="${name}"]`);
        const userAnswer = el ? el.value.trim().toLowerCase() : '';
        if (userAnswer === correctAnswers[name].toLowerCase()) {
            score++;
        } else {
            details.push(`Вопрос ${i}: ваш ответ — "${userAnswer || '—'}", правильный — "${correctAnswers[name]}"`);
        }
    }

    // Вывод результата
    const resultDiv = document.getElementById('test-result');
    resultDiv.classList.remove('hidden', 'success', 'info');

    const percent = Math.round((score / total) * 100);
    resultDiv.textContent = `Результат: ${score} из ${total} (${percent}%)`;

    if (percent >= 70) {
        resultDiv.classList.add('success');
    } else {
        resultDiv.classList.add('info');
    }

    if (details.length > 0) {
        resultDiv.innerHTML += '<br><br><strong>Ошибки:</strong><br>' + details.join('<br>');
    }
}

function resetTest() {
    // Сбросить radio и checkbox
    document.querySelectorAll('#test-form input[type="radio"], #test-form input[type="checkbox"]')
        .forEach(el => el.checked = false);

    // Сбросить select
    document.querySelectorAll('#test-form select').forEach(el => el.selectedIndex = 0);

    // Сбросить текстовые поля
    document.querySelectorAll('#test-form input[type="text"]').forEach(el => el.value = '');

    // Скрыть результат
    const resultDiv = document.getElementById('test-result');
    resultDiv.classList.add('hidden');
}

document.getElementById('check-test-btn').addEventListener('click', checkTest);
document.getElementById('reset-test-btn').addEventListener('click', resetTest);