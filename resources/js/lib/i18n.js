import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

const translations = {
    'Главная': { kk: 'Басты бет', en: 'Home' },
    'Назад': { kk: 'Артқа', en: 'Back' },
    'На главную': { kk: 'Басты бетке', en: 'Go home' },
    'Обзор': { kk: 'Шолу', en: 'Overview' },
    'Соревнования': { kk: 'Жарыстар', en: 'Competitions' },
    'Задачи': { kk: 'Есептер', en: 'Problems' },
    'Тесты и проверка': { kk: 'Тесттер және тексеру', en: 'Tests and judging' },
    'Посылки': { kk: 'Жіберілімдер', en: 'Submissions' },
    'Участники': { kk: 'Қатысушылар', en: 'Participants' },
    'Профиль': { kk: 'Профиль', en: 'Profile' },
    'Кабинет': { kk: 'Кабинет', en: 'Dashboard' },
    'Кабинет участника': { kk: 'Қатысушы кабинеті', en: 'Participant dashboard' },
    'Админ-панель': { kk: 'Әкімші панелі', en: 'Admin panel' },
    'Администратор': { kk: 'Әкімші', en: 'Administrator' },
    'Панель администратора': { kk: 'Әкімші панелі', en: 'Admin panel' },
    'Управление соревнованиями АТУ': { kk: 'АТУ жарыстарын басқару', en: 'ATU competition management' },
    'Система онлайн': { kk: 'Жүйе онлайн', en: 'System online' },
    'Выйти': { kk: 'Шығу', en: 'Sign out' },
    'Выйти из системы': { kk: 'Жүйеден шығу', en: 'Sign out' },
    'Открыть меню': { kk: 'Мәзірді ашу', en: 'Open menu' },
    'Закрыть меню': { kk: 'Мәзірді жабу', en: 'Close menu' },
    'Страница не найдена': { kk: 'Бет табылмады', en: 'Page not found' },
    'Доступ запрещён': { kk: 'Қолжетімділікке тыйым салынған', en: 'Access denied' },
    'Сессия завершена': { kk: 'Сессия аяқталды', en: 'Session expired' },
    'Слишком много запросов': { kk: 'Сұраулар тым көп', en: 'Too many requests' },
    'Ошибка сервера': { kk: 'Сервер қатесі', en: 'Server error' },
    'Сервис временно недоступен': { kk: 'Қызмет уақытша қолжетімсіз', en: 'Service unavailable' },
    'Запрошенная страница не существует или была перемещена.': { kk: 'Сұралған бет жоқ немесе басқа жерге көшірілген.', en: 'The requested page does not exist or has been moved.' },
    'У вас нет прав для просмотра этой страницы.': { kk: 'Бұл бетті көруге құқығыңыз жоқ.', en: 'You do not have permission to view this page.' },
    'Обновите страницу и повторите действие.': { kk: 'Бетті жаңартып, әрекетті қайталаңыз.', en: 'Refresh the page and try again.' },
    'Подождите немного и повторите попытку.': { kk: 'Біраз күтіп, қайталап көріңіз.', en: 'Wait a moment and try again.' },
    'Произошла внутренняя ошибка. Мы уже можем её диагностировать.': { kk: 'Ішкі қате пайда болды. Оны диагностикалауға болады.', en: 'An internal error occurred. It can now be diagnosed.' },
    'Попробуйте открыть страницу через несколько минут.': { kk: 'Бірнеше минуттан кейін бетті қайта ашып көріңіз.', en: 'Try opening the page again in a few minutes.' },
    'Если проблема повторяется, сообщите администратору код ошибки.': { kk: 'Мәселе қайталанса, әкімшіге қате кодын хабарлаңыз.', en: 'If the problem persists, report the error code to an administrator.' },
    'Платформа соревнований по программированию': { kk: 'Бағдарламалау жарыстарының платформасы', en: 'Programming competition platform' },
    'Честная игра и автоматическая проверка': { kk: 'Әділ ойын және автоматты тексеру', en: 'Fair play and automated judging' },
};

export function useTranslation() {
    const { locale = 'ru' } = usePage().props;

    useEffect(() => {
        document.documentElement.lang = locale;
    }, [locale]);

    const t = (source) => {
        if (locale === 'ru') return source;

        return translations[source]?.[locale] ?? source;
    };

    return { locale, t };
}
