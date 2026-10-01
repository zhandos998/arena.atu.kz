import ArenaIcon from '@/Components/ArenaIcon';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

const modules = [
    {
        id: 'competitions',
        icon: 'trophy',
        routeName: 'admin.competitions.index',
        ready: true,
        title: 'Соревнования',
        description: 'Название, расписание, длительность, языки и правила участия.',
        details: ['Черновик и публикация', 'Время начала и окончания', 'Открытая или закрытая регистрация'],
    },
    {
        id: 'problems',
        icon: 'code',
        routeName: 'admin.problems.index',
        ready: true,
        title: 'Задачи',
        description: 'Условия, ограничения, баллы, эталонное решение и привязка к турниру.',
        details: ['Лимиты времени и памяти', 'Поддерживаемые языки', 'Порядок и стоимость задачи'],
    },
    {
        id: 'tests',
        icon: 'shield',
        routeName: 'admin.tests.index',
        ready: true,
        title: 'Тесты и проверка',
        description: 'Входные данные, правильный ответ и группы скрытых тестов для каждой задачи.',
        details: ['До 200 скрытых тестов', 'Вес и включение каждого теста', 'Сравнение по токенам или точное'],
    },
    {
        id: 'submissions',
        icon: 'ranking',
        routeName: 'admin.submissions.index',
        ready: true,
        title: 'Посылки и рейтинг',
        description: 'Очередь проверки, вердикты, баллы, штрафное время и итоговая таблица.',
        details: ['Queued → Running → Verdict', 'Логи по каждому тесту', 'Пересчёт турнирной таблицы'],
    },
];

const setupSteps = [
    ['Создать соревнование', 'Указать даты, формат и доступные языки.'],
    ['Добавить задачи', 'Заполнить условие, ограничения и баллы.'],
    ['Загрузить тесты', 'Добавить вход и ожидаемый результат для каждого теста.'],
    ['Запустить тур', 'Открыть доступ участникам и включить очередь проверки.'],
];

function StatCard({ icon, label, value }) {
    return (
        <article className="rounded-2xl border border-[#dfe7f3] dark:border-[#2d405b] bg-white dark:bg-[#142238] p-5">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold text-[#8795a9] dark:text-[#a4b6cf]">{label}</p>
                    <p className="mt-2 text-3xl font-black tracking-tight text-[#142d55] dark:text-[#e8eef9]">{value}</p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf3ff] dark:bg-[#203858] text-[#355da8] dark:text-[#a9c7ff]">
                    <ArenaIcon name={icon} />
                </span>
            </div>
        </article>
    );
}

export default function Dashboard({ stats }) {
    return (
        <AdminLayout>
            <Head title="Администрирование" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <section className="relative overflow-hidden rounded-[1.75rem] bg-[#193f7d] px-6 py-8 text-white sm:px-8 lg:px-10">
                    <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:40px_40px]" />
                    <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full bg-[#ffd83d] px-3 py-1.5 text-xs font-black text-[#10264f]">
                                <ArenaIcon name="shield" className="h-4 w-4" />
                                Режим администратора
                            </span>
                            <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">Управление Code Arena</h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#d8e3f5] sm:text-base">
                                Здесь будут создаваться соревнования, задачи, тесты и контролироваться все посылки участников.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.08] px-5 py-4 backdrop-blur">
                            <p className="text-xs font-semibold text-white/55">Состояние платформы</p>
                            <p className="mt-2 flex items-center gap-2 text-sm font-bold">
                                <span className="h-2.5 w-2.5 rounded-full bg-[#53d59b]" />
                                Админ-контур активен
                            </p>
                        </div>
                    </div>
                </section>

                <section id="participants" className="mt-6 grid scroll-mt-24 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard icon="users" label="Участники" value={stats.participants} />
                    <StatCard icon="trophy" label="Соревнования" value={stats.competitions} />
                    <StatCard icon="code" label="Задачи" value={stats.problems} />
                    <StatCard icon="bolt" label="Посылки" value={stats.submissions} />
                </section>

                <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#355da8] dark:text-[#a9c7ff]">Архитектура системы</p>
                        <h2 className="mt-2 text-2xl font-black tracking-tight text-[#142d55] dark:text-[#e8eef9]">Модули администратора</h2>
                    </div>
                    <span className="w-fit rounded-full bg-[#e8f8f1] dark:bg-[#123b31] px-3 py-1.5 text-xs font-bold text-[#16845a] dark:text-[#86dfb4]">Соревнования и задачи работают</span>
                </div>

                <section className="mt-5 grid gap-5 md:grid-cols-2">
                    {modules.map((module) => (
                        <article id={module.id} key={module.title} className="scroll-mt-24 rounded-2xl border border-[#dfe7f3] dark:border-[#2d405b] bg-white dark:bg-[#142238] p-6">
                            <div className="flex items-start justify-between gap-4">
                                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf3ff] dark:bg-[#203858] text-[#355da8] dark:text-[#a9c7ff]">
                                    <ArenaIcon name={module.icon} className="h-6 w-6" />
                                </span>
                                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${module.ready ? 'bg-[#e8f8f1] dark:bg-[#123b31] text-[#16845a] dark:text-[#86dfb4]' : 'bg-[#f1f4f8] dark:bg-[#17263e] text-[#8795a9] dark:text-[#a4b6cf]'}`}>
                                    {module.ready ? 'Работает' : 'Проектируется'}
                                </span>
                            </div>
                            <h3 className="mt-5 text-lg font-black text-[#142d55] dark:text-[#e8eef9]">{module.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-[#667892] dark:text-[#aebfd6]">{module.description}</p>
                            <ul className="mt-5 grid gap-2 border-t border-[#edf1f7] dark:border-[#2d405b] pt-4">
                                {module.details.map((detail) => (
                                    <li key={detail} className="flex items-center gap-2 text-xs text-[#7184a0] dark:text-[#aebfd6]">
                                        <span className="text-[#32a975]">✓</span>
                                        {detail}
                                    </li>
                                ))}
                            </ul>
                            {module.routeName && (
                                <Link
                                    href={route(module.routeName)}
                                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#355da8] dark:text-[#a9c7ff] transition hover:text-[#23457e]"
                                >
                                    Открыть раздел
                                    <ArenaIcon name="arrow" className="h-4 w-4" />
                                </Link>
                            )}
                        </article>
                    ))}
                </section>

                <section className="mt-8 rounded-2xl border border-[#dfe7f3] dark:border-[#2d405b] bg-white dark:bg-[#142238] p-6 sm:p-8">
                    <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#355da8] dark:text-[#a9c7ff]">Рабочий процесс</p>
                            <h2 className="mt-2 text-2xl font-black tracking-tight text-[#142d55] dark:text-[#e8eef9]">Как будет запускаться турнир</h2>
                            <p className="mt-3 text-sm leading-6 text-[#667892] dark:text-[#aebfd6]">Порядок похож на Codeforces, но управление будет проще и адаптировано под соревнования АТУ.</p>
                        </div>
                        <ol className="grid gap-3">
                            {setupSteps.map(([title, description], index) => (
                                <li key={title} className="flex gap-3 rounded-xl bg-[#f7f9fd] dark:bg-[#17263e] p-4">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#355da8] font-mono text-xs font-black text-white">{index + 1}</span>
                                    <div>
                                        <p className="text-sm font-bold text-[#314765] dark:text-[#d2dff1]">{title}</p>
                                        <p className="mt-1 text-xs leading-5 text-[#7184a0] dark:text-[#aebfd6]">{description}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}
