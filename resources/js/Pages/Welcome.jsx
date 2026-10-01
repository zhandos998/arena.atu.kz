import ApplicationLogo from '@/Components/ApplicationLogo';
import ArenaIcon from '@/Components/ArenaIcon';
import LocaleSwitcher from '@/Components/LocaleSwitcher';
import ThemeToggle from '@/Components/ThemeToggle';
import { useTranslation } from '@/lib/i18n';
import { Head, Link } from '@inertiajs/react';

const primaryButton =
    'inline-flex items-center justify-center gap-2 rounded-xl bg-[#ffd83d] px-5 py-3 text-sm font-bold text-[#10264f] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#ffe46d] focus:outline-none focus:ring-2 focus:ring-[#ffd83d] focus:ring-offset-2 focus:ring-offset-[#193f7d]';

const outlineButton =
    'inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/70';

const formats = [
    {
        icon: 'terminal',
        step: '01',
        title: 'Алгоритмические задачи',
        text: 'От базовых структур данных до динамического программирования — сложность растёт вместе с вашим счётом.',
    },
    {
        icon: 'clock',
        step: '02',
        title: 'Решайте в своём темпе',
        text: 'Решайте задачи в любом порядке, отправляйте решения и сразу получайте результат автоматической проверки.',
    },
    {
        icon: 'ranking',
        step: '03',
        title: 'Честный рейтинг',
        text: 'Позиция зависит от числа решённых задач и штрафного времени. Таблица обновляется по ходу турнира.',
    },
];

const timeline = [
    ['Регистрация', 'Создайте аккаунт участника и заполните профиль.'],
    ['Подготовка', 'Проверьте среду, формат отправки и доступ к системе.'],
    ['Основной раунд', 'Решайте задачи и поднимайтесь в рейтинге.'],
    ['Итоги', 'Посмотрите свои результаты и положение в рейтинге.'],
];

function Brand({ light = false }) {
    return (
        <div className="flex min-w-0 items-center gap-3">
            <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    light ? 'bg-white' : 'bg-[#edf3ff] dark:bg-white'
                }`}
            >
                <ApplicationLogo variant="compact" className="h-8 w-8" />
            </span>
            <div className="min-w-0">
                <p
                    className={`hidden truncate text-[10px] font-bold uppercase tracking-[0.22em] sm:block ${
                        light ? 'text-white/60' : 'text-[#6b7f9e] dark:text-[#aebfd6]'
                    }`}
                >
                    ATU Programming
                </p>
                <p
                    className={`text-base font-bold leading-5 sm:text-lg ${
                        light ? 'text-white' : 'text-[#173563] dark:text-[#eaf1ff]'
                    }`}
                >
                    Code Arena
                </p>
            </div>
        </div>
    );
}

function ContestPreview({ locale }) {
    const copy = {
        ru: {
            badge: 'Возможности платформы',
            title: 'Всё для проведения турнира',
            items: [
                ['terminal', 'Задачи и тесты', 'Условия, примеры и скрытые тесты'],
                ['shield', 'Автоматическая проверка', 'Вердикт по каждому тесту'],
                ['ranking', 'Честный рейтинг', 'Только результаты реальных посылок'],
            ],
            note: 'Данные участников не подменяются демонстрационными значениями.',
        },
        kk: {
            badge: 'Платформа мүмкіндіктері',
            title: 'Жарысты өткізуге қажеттінің бәрі',
            items: [
                ['terminal', 'Есептер мен тесттер', 'Шарттар, мысалдар және жасырын тесттер'],
                ['shield', 'Автоматты тексеру', 'Әр тест бойынша нәтиже'],
                ['ranking', 'Әділ рейтинг', 'Тек нақты жіберілім нәтижелері'],
            ],
            note: 'Қатысушылардың деректері демонстрациялық мәндермен алмастырылмайды.',
        },
        en: {
            badge: 'Platform features',
            title: 'Everything needed to run a contest',
            items: [
                ['terminal', 'Problems and tests', 'Statements, samples, and hidden tests'],
                ['shield', 'Automatic judging', 'A verdict for every test'],
                ['ranking', 'Fair leaderboard', 'Based only on real submissions'],
            ],
            note: 'Participant data is never replaced with demonstration values.',
        },
    }[locale];

    return (
        <div className="relative mx-auto min-w-0 w-full max-w-lg lg:mr-0">
            <div className="absolute -inset-8 rounded-full bg-[#4f7cc8]/30 blur-3xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#102a57]/85 p-3 shadow-2xl shadow-[#07152f]/50 backdrop-blur sm:p-4">
                <div className="flex items-center justify-between border-b border-white/10 px-2 pb-4">
                    <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#ffd83d]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#53d59b]" />
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/70">
                        <span className="h-2 w-2 rounded-full bg-[#53d59b]" />
                        {copy.badge}
                    </div>
                </div>

                <div className="rounded-2xl bg-white dark:bg-[#142238] p-5 text-[#142d55] dark:text-[#e8eef9] sm:p-6">
                    <p className="text-xl font-black">{copy.title}</p>
                    <div className="mt-5 grid gap-3">
                        {copy.items.map(([icon, title, text]) => (
                            <div key={title} className="flex items-center gap-3 rounded-xl border border-[#e6ecf5] dark:border-[#2d405b] p-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf3ff] dark:bg-[#203858] text-[#355da8] dark:text-[#a9c7ff]">
                                    <ArenaIcon name={icon} />
                                </span>
                                <span className="min-w-0">
                                    <span className="block text-sm font-bold">{title}</span>
                                    <span className="mt-0.5 block text-xs text-[#7184a0] dark:text-[#aebfd6]">{text}</span>
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#e8f8f1] dark:bg-[#123b31] px-4 py-3 text-xs leading-5 text-[#176746] dark:text-[#86dfb4]">
                        <ArenaIcon name="check" className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{copy.note}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Welcome({ auth, canLogin, canRegister }) {
    const { locale } = useTranslation();
    const isAuthenticated = Boolean(auth?.user);
    const cabinetHref = isAuthenticated ? route('dashboard') : route('register');
    const copy = {
        ru: {
            title: 'Турнир по программированию', format: 'Формат', stages: 'Этапы', rules: 'Правила', cabinet: 'Мой кабинет', login: 'Войти', participate: 'Участвовать', open: 'Площадка соревнований', headline: 'Код, который выводит', accent: 'в лидеры.', description: 'Университетский чемпионат АТУ по спортивному программированию. Решайте задачи, соревнуйтесь с сильнейшими и покажите свой уровень.', primary: isAuthenticated ? 'Перейти к задачам' : 'Стать участником', how: 'Как всё проходит', benefits: ['Для студентов АТУ', 'Участие бесплатно', 'Автоматическая проверка'], metrics: [['Задачи', 'условия и примеры'], ['Тесты', 'автоматическая проверка'], ['Посылки', 'вердикты и баллы'], ['Рейтинг', 'реальные результаты']],
        },
        kk: {
            title: 'Бағдарламалау турнирі', format: 'Формат', stages: 'Кезеңдер', rules: 'Ережелер', cabinet: 'Менің кабинетім', login: 'Кіру', participate: 'Қатысу', open: 'Жарыс алаңы', headline: 'Көшбасшылыққа жеткізетін', accent: 'код.', description: 'Спорттық бағдарламалау бойынша АТУ университеттік чемпионаты. Есептерді шешіп, үздіктермен жарысып, өз деңгейіңізді көрсетіңіз.', primary: isAuthenticated ? 'Есептерге өту' : 'Қатысушы болу', how: 'Қалай өтеді', benefits: ['АТУ студенттері үшін', 'Қатысу тегін', 'Автоматты тексеру'], metrics: [['Есептер', 'шарттар мен мысалдар'], ['Тесттер', 'автоматты тексеру'], ['Жіберілімдер', 'нәтижелер мен ұпайлар'], ['Рейтинг', 'нақты нәтижелер']],
        },
        en: {
            title: 'Programming tournament', format: 'Format', stages: 'Stages', rules: 'Rules', cabinet: 'My dashboard', login: 'Sign in', participate: 'Participate', open: 'Competition platform', headline: 'Code your way', accent: 'to the top.', description: 'ATU university competitive programming championship. Solve problems, compete with the best, and prove your skills.', primary: isAuthenticated ? 'Go to problems' : 'Become a participant', how: 'How it works', benefits: ['For ATU students', 'Free participation', 'Automatic judging'], metrics: [['Problems', 'statements and examples'], ['Tests', 'automatic judging'], ['Submissions', 'verdicts and scores'], ['Ranking', 'real results']],
        },
    }[locale];

    return (
        <>
            <Head title={copy.title} />

            <main className="min-h-screen overflow-x-hidden bg-white dark:bg-[#142238] text-[#142d55] dark:text-[#e8eef9]">
                <section className="relative max-w-full overflow-hidden bg-[#193f7d] text-white">
                    <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:48px_48px]" />
                    <div className="absolute -right-24 top-20 h-80 w-80 rounded-full border-[64px] border-[#ffd83d]/10" />
                    <div className="relative mx-auto w-full min-w-0 max-w-7xl px-4 sm:px-6 lg:px-8">
                        <header className="flex h-20 w-full min-w-0 items-center justify-between gap-3 border-b border-white/10 sm:gap-5">
                            <Link href={route('home')} aria-label="Home" className="min-w-0">
                                <Brand light />
                            </Link>

                            <nav className="hidden items-center gap-7 text-sm font-semibold text-white/75 lg:flex">
                                <a className="transition hover:text-white" href="#format">{copy.format}</a>
                                <a className="transition hover:text-white" href="#stages">{copy.stages}</a>
                                <a className="transition hover:text-white" href="#rules">{copy.rules}</a>
                            </nav>

                            <div className="flex items-center gap-2">
                                <ThemeToggle onDarkSurface />
                                <LocaleSwitcher dark compact />
                                {isAuthenticated ? (
                                    <Link href={route('dashboard')} className={primaryButton}>
                                        {copy.cabinet}
                                        <ArenaIcon name="arrow" />
                                    </Link>
                                ) : (
                                    <>
                                        {canLogin && (
                                            <Link
                                                href={route('login')}
                                                className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white sm:inline-flex"
                                            >
                                                {copy.login}
                                            </Link>
                                        )}
                                        {canRegister && (
                                            <Link href={route('register')} className={primaryButton}>
                                                <span className="hidden sm:inline">{copy.participate}</span>
                                                <span className="sm:hidden">Старт</span>
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </header>

                        <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)] items-center gap-14 py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:py-24 xl:gap-20">
                            <div className="min-w-0">
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#ffd83d]">
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#ffd83d]" />
                                    {copy.open}
                                </div>
                                <h1 className="mt-6 max-w-2xl break-words text-4xl font-black leading-[1.05] tracking-[-0.035em] sm:text-6xl lg:text-[4.25rem]">
                                    {copy.headline} <span className="text-[#ffd83d]">{copy.accent}</span>
                                </h1>
                                <p className="mt-6 max-w-xl text-base leading-7 text-[#d8e3f5] sm:text-lg">
                                    {copy.description}
                                </p>

                                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                    <Link href={cabinetHref} className={primaryButton}>
                                        {copy.primary}
                                        <ArenaIcon name="arrow" />
                                    </Link>
                                    <a href="#format" className={outlineButton}>
                                        <ArenaIcon name="play" />
                                        {copy.how}
                                    </a>
                                </div>

                                <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-white/70">
                                    {copy.benefits.map((item) => (
                                        <span key={item} className="flex items-center gap-2">
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ffd83d] text-[#10264f]">
                                                <ArenaIcon name="check" className="h-3.5 w-3.5" />
                                            </span>
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <ContestPreview locale={locale} />
                        </div>
                    </div>
                </section>

                <section className="border-b border-[#e3eaf5] dark:border-[#2d405b] bg-[#f7f9fd] dark:bg-[#17263e]">
                    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-[#e3eaf5] dark:bg-[#243a58] sm:grid-cols-4">
                        {copy.metrics.map(([value, label]) => (
                            <div key={label} className="bg-[#f7f9fd] dark:bg-[#17263e] px-5 py-7 text-center">
                                <p className="text-2xl font-black tracking-tight text-[#234d8f] dark:text-[#a9c7ff]">{value}</p>
                                <p className="mt-1 text-xs font-medium text-[#7184a0] dark:text-[#aebfd6]">{label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="format" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
                    <div className="max-w-2xl">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#355da8] dark:text-[#a9c7ff]">Формат соревнования</p>
                        <h2 className="mt-3 text-3xl font-black tracking-tight text-[#142d55] dark:text-[#e8eef9] sm:text-4xl">Всё как на настоящей арене</h2>
                        <p className="mt-4 text-base leading-7 text-[#667892] dark:text-[#aebfd6]">Одна площадка для условий, отправки решений и актуального рейтинга участников.</p>
                    </div>

                    <div className="mt-10 grid gap-5 lg:grid-cols-3">
                        {formats.map((item) => (
                            <article key={item.step} className="group rounded-2xl border border-[#dfe7f3] dark:border-[#2d405b] bg-white dark:bg-[#142238] p-6 transition hover:-translate-y-1 hover:border-[#b8c9e4] dark:hover:border-[#516e95] hover:shadow-xl hover:shadow-[#244b88]/10">
                                <div className="flex items-center justify-between">
                                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf3ff] dark:bg-[#203858] text-[#355da8] dark:text-[#a9c7ff] transition group-hover:bg-[#355da8] group-hover:text-white">
                                        <ArenaIcon name={item.icon} className="h-6 w-6" />
                                    </span>
                                    <span className="font-mono text-sm font-bold text-[#b0bdd0] dark:text-[#b6c6da]">/{item.step}</span>
                                </div>
                                <h3 className="mt-8 text-xl font-bold text-[#142d55] dark:text-[#e8eef9]">{item.title}</h3>
                                <p className="mt-3 text-sm leading-6 text-[#667892] dark:text-[#aebfd6]">{item.text}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section id="stages" className="bg-[#f3f6fb] dark:bg-[#0c1628] py-20 lg:py-28">
                    <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#355da8] dark:text-[#a9c7ff]">Путь участника</p>
                            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#142d55] dark:text-[#e8eef9] sm:text-4xl">От регистрации до пьедестала</h2>
                            <p className="mt-4 max-w-md text-base leading-7 text-[#667892] dark:text-[#aebfd6]">Мы собрали весь процесс в понятные этапы. Следите за статусом в личном кабинете.</p>
                            <div id="rules" className="mt-8 rounded-2xl bg-[#193f7d] p-6 text-white">
                                <div className="flex items-center gap-3 text-[#ffd83d]">
                                    <ArenaIcon name="shield" className="h-6 w-6" />
                                    <p className="font-bold">Честная игра</p>
                                </div>
                                <p className="mt-3 text-sm leading-6 text-[#d8e3f5]">Решения проверяются автоматически. Запрещены обмен кодом и помощь третьих лиц во время тура.</p>
                            </div>
                        </div>

                        <ol className="grid gap-4">
                            {timeline.map(([title, text], index) => (
                                <li key={title} className="flex gap-4 rounded-2xl border border-[#dfe7f3] dark:border-[#2d405b] bg-white dark:bg-[#142238] p-5 sm:items-center">
                                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold ${index === 0 ? 'bg-[#ffd83d] text-[#10264f]' : 'bg-[#edf3ff] dark:bg-[#203858] text-[#355da8] dark:text-[#a9c7ff]'}`}>
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <div>
                                        <h3 className="font-bold text-[#142d55] dark:text-[#e8eef9]">{title}</h3>
                                        <p className="mt-1 text-sm leading-6 text-[#667892] dark:text-[#aebfd6]">{text}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                <section className="bg-white dark:bg-[#142238] py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="relative overflow-hidden rounded-[2rem] bg-[#193f7d] px-6 py-12 text-center text-white sm:px-12">
                            <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:22px_22px]" />
                            <div className="relative mx-auto max-w-2xl">
                                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffd83d] text-[#10264f]">
                                    <ArenaIcon name="trophy" className="h-7 w-7" />
                                </span>
                                <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">Готовы принять вызов?</h2>
                                <p className="mt-4 text-[#d8e3f5]">Создайте аккаунт, подготовьте любимый язык программирования и займите своё место в рейтинге АТУ.</p>
                                <Link href={cabinetHref} className={`${primaryButton} mt-7`}>
                                    {isAuthenticated ? 'Открыть кабинет' : 'Зарегистрироваться'}
                                    <ArenaIcon name="arrow" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="border-t border-[#e3eaf5] dark:border-[#2d405b] bg-white dark:bg-[#142238]">
                    <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
                        <Brand />
                        <p className="text-sm text-[#7184a0] dark:text-[#aebfd6]">© 2026 Алматинский технологический университет</p>
                    </div>
                </footer>
            </main>
        </>
    );
}
