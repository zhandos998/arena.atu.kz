import ArenaIcon from '@/Components/ArenaIcon';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

function formatDate(value) {
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
}

export default function Show({ competition }) {
    const { flash } = usePage().props;
    const published = competition.status === 'published';
    const archived = competition.status === 'archived';
    const participantForm = useForm({ email: '' });

    const addParticipant = (event) => {
        event.preventDefault();
        participantForm.post(route('admin.competitions.participants.store', competition.id), {
            preserveScroll: true,
            onSuccess: () => participantForm.reset(),
        });
    };

    return (
        <AdminLayout title={competition.title} subtitle="Управление соревнованием">
            <Head title={competition.title} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {flash?.success && (
                    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#bfe9d5] dark:border-[#2b715d] bg-[#e8f8f1] dark:bg-[#123b31] px-4 py-3 text-sm font-bold text-[#16845a] dark:text-[#86dfb4]">
                        <ArenaIcon name="check" className="h-5 w-5 shrink-0" />
                        {flash.success}
                    </div>
                )}

                <div className="mb-6 flex items-center gap-2 text-sm">
                    <Link href={route('admin.competitions.index')} className="font-bold text-[#355da8] dark:text-[#a9c7ff] hover:text-[#23457e]">
                        Соревнования
                    </Link>
                    <span className="text-[#a2adbc] dark:text-[#a8b9d1]">/</span>
                    <span className="truncate text-[#7184a0] dark:text-[#aebfd6]">{competition.title}</span>
                </div>

                <div className="mb-6 flex flex-wrap gap-2">
                    <Link
                        href={route('admin.competitions.edit', competition.id)}
                        className="rounded-xl border border-[#ccd7e8] dark:border-[#3a506e] bg-white dark:bg-[#142238] px-4 py-2.5 text-sm font-black text-[#355da8] dark:text-[#a9c7ff] transition hover:bg-[#edf3ff] dark:hover:bg-[#203858]"
                    >
                        Изменить настройки
                    </Link>

                    {competition.status === 'draft' && competition.problems.length > 0 && (
                        <Link
                            href={route('admin.competitions.published.store', competition.id)}
                            method="post"
                            as="button"
                            className="rounded-xl bg-[#16845a] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#116b49]"
                        >
                            Опубликовать
                        </Link>
                    )}

                    {published && (
                        <Link
                            href={route('admin.competitions.published.destroy', competition.id)}
                            method="delete"
                            as="button"
                            className="rounded-xl border border-[#e4c35b] dark:border-[#826c36] bg-[#fff7d7] dark:bg-[#42351b] px-4 py-2.5 text-sm font-black text-[#7b5c08] dark:text-[#f7d77b] transition hover:bg-[#ffefb3] dark:hover:bg-[#f4cd5b]"
                        >
                            Снять с публикации
                        </Link>
                    )}

                    {archived ? (
                        <Link
                            href={route('admin.competitions.archived.destroy', competition.id)}
                            method="delete"
                            as="button"
                            className="rounded-xl border border-[#ccd7e8] dark:border-[#3a506e] bg-white dark:bg-[#142238] px-4 py-2.5 text-sm font-black text-[#667892] dark:text-[#aebfd6] transition hover:bg-[#f3f6fb] dark:hover:bg-[#0c1628]"
                        >
                            Восстановить из архива
                        </Link>
                    ) : (
                        <Link
                            href={route('admin.competitions.archived.store', competition.id)}
                            method="post"
                            as="button"
                            className="rounded-xl border border-[#ccd7e8] dark:border-[#3a506e] bg-white dark:bg-[#142238] px-4 py-2.5 text-sm font-black text-[#667892] dark:text-[#aebfd6] transition hover:bg-[#f3f6fb] dark:hover:bg-[#0c1628]"
                        >
                            В архив
                        </Link>
                    )}

                    {competition.status === 'draft' && (
                        <Link
                            href={route('admin.competitions.destroy', competition.id)}
                            method="delete"
                            as="button"
                            onBefore={() => window.confirm('Удалить черновик соревнования? Это действие нельзя отменить.')}
                            className="rounded-xl border border-red-200 dark:border-red-800 bg-white dark:bg-[#142238] px-4 py-2.5 text-sm font-black text-red-600 dark:text-red-300 transition hover:bg-red-50 dark:hover:bg-[#3a222c]"
                        >
                            Удалить
                        </Link>
                    )}
                </div>

                <section className="overflow-hidden rounded-[1.75rem] bg-[#193f7d] text-white">
                    <div className="relative px-6 py-7 sm:px-8">
                        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:40px_40px]" />
                        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <span className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${published ? 'bg-[#53d59b] text-[#0c5035] dark:text-[#86dfb4]' : archived ? 'bg-white/15 text-white' : 'bg-[#ffd83d] text-[#10264f]'}`}>
                                    {competition.status_label}
                                </span>
                                <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">{competition.title}</h1>
                                <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-6 text-[#d8e3f5]">
                                    {competition.description || 'Описание соревнования пока не добавлено.'}
                                </p>
                            </div>
                            <Link
                                href={route('admin.competitions.problems.create', competition.id)}
                                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#ffd83d] px-5 py-3 text-sm font-black text-[#10264f] transition hover:bg-[#ffe36c]"
                            >
                                <span className="text-lg leading-none">+</span>
                                Добавить задачу
                            </Link>
                        </div>
                    </div>

                    <dl className="grid border-t border-white/10 bg-white/[0.05] sm:grid-cols-2 xl:grid-cols-4">
                        <div className="border-b border-white/10 px-6 py-4 sm:border-r xl:border-b-0">
                            <dt className="text-[10px] font-bold uppercase tracking-wider text-[#8fa8ce]">Начало</dt>
                            <dd className="mt-1 text-xs font-bold">{formatDate(competition.starts_at)}</dd>
                        </div>
                        <div className="border-b border-white/10 px-6 py-4 xl:border-b-0 xl:border-r">
                            <dt className="text-[10px] font-bold uppercase tracking-wider text-[#8fa8ce]">Окончание</dt>
                            <dd className="mt-1 text-xs font-bold">{formatDate(competition.ends_at)}</dd>
                        </div>
                        <div className="border-b border-white/10 px-6 py-4 sm:border-r sm:border-b-0">
                            <dt className="text-[10px] font-bold uppercase tracking-wider text-[#8fa8ce]">Регистрация</dt>
                            <dd className="mt-1 text-xs font-bold">{competition.registration_label}</dd>
                        </div>
                        <div className="px-6 py-4">
                            <dt className="text-[10px] font-bold uppercase tracking-wider text-[#8fa8ce]">Языки</dt>
                            <dd className="mt-1 truncate text-xs font-bold">{competition.language_labels.join(', ')}</dd>
                        </div>
                    </dl>
                </section>

                {competition.rules && (
                    <section className="mt-6 rounded-2xl border border-[#dfe7f3] dark:border-[#2d405b] bg-white dark:bg-[#142238] p-6">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#355da8] dark:text-[#a9c7ff]">Регламент</p>
                        <h2 className="mt-2 text-xl font-black text-[#142d55] dark:text-[#e8eef9]">Правила соревнования</h2>
                        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#667892] dark:text-[#aebfd6]">{competition.rules}</p>
                    </section>
                )}

                <section className="mt-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#355da8] dark:text-[#a9c7ff]">Комплект задач</p>
                            <h2 className="mt-2 text-2xl font-black tracking-tight text-[#142d55] dark:text-[#e8eef9]">
                                Задачи <span className="text-[#8795a9] dark:text-[#a4b6cf]">({competition.problems.length})</span>
                            </h2>
                        </div>
                        <Link
                            href={route('admin.competitions.problems.create', competition.id)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#b8c9e4] dark:border-[#516e95] bg-white dark:bg-[#142238] px-4 py-2.5 text-sm font-black text-[#355da8] dark:text-[#a9c7ff] transition hover:bg-[#edf3ff] dark:hover:bg-[#203858]"
                        >
                            <span className="text-lg leading-none">+</span>
                            Новая задача
                        </Link>
                    </div>

                    {competition.problems.length === 0 ? (
                        <div className="mt-5 rounded-2xl border border-dashed border-[#bdcbe0] dark:border-[#415a78] bg-white dark:bg-[#142238] px-6 py-12 text-center">
                            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf3ff] dark:bg-[#203858] text-[#355da8] dark:text-[#a9c7ff]">
                                <ArenaIcon name="code" className="h-7 w-7" />
                            </span>
                            <h3 className="mt-5 text-lg font-black text-[#142d55] dark:text-[#e8eef9]">В соревновании ещё нет задач</h3>
                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7184a0] dark:text-[#aebfd6]">
                                Добавьте условие первой задачи. После этого можно будет загрузить тесты для автоматической проверки.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-5 overflow-hidden rounded-2xl border border-[#dfe7f3] dark:border-[#2d405b] bg-white dark:bg-[#142238]">
                            <div className="hidden grid-cols-[80px_minmax(0,1fr)_100px_110px_80px_170px] gap-4 border-b border-[#e8edf5] dark:border-[#2d405b] bg-[#f7f9fd] dark:bg-[#17263e] px-5 py-3 text-[10px] font-black uppercase tracking-wider text-[#8795a9] dark:text-[#a4b6cf] md:grid">
                                <span>Код</span>
                                <span>Название</span>
                                <span>Время</span>
                                <span>Память</span>
                                <span>Баллы</span>
                                <span>Действия</span>
                            </div>
                            <div className="divide-y divide-[#edf1f7]">
                                {competition.problems.map((problem) => (
                                    <article key={problem.id} className="grid gap-4 px-5 py-4 md:grid-cols-[80px_minmax(0,1fr)_100px_110px_80px_170px] md:items-center">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#355da8] font-mono text-sm font-black text-white">
                                            {problem.code}
                                        </span>
                                        <div className="min-w-0">
                                            <Link href={route('admin.competitions.problems.show', [competition.id, problem.id])} className="truncate text-sm font-black text-[#314765] dark:text-[#d2dff1] transition hover:text-[#355da8] dark:hover:text-[#a9c7ff]">
                                                {problem.title}
                                            </Link>
                                            <p className="mt-1 text-[11px] text-[#8795a9] dark:text-[#a4b6cf]">Примеров: {problem.samples_count}</p>
                                            <p className="mt-1 text-xs text-[#8795a9] dark:text-[#a4b6cf] md:hidden">
                                                {problem.time_limit_ms} мс · {problem.memory_limit_mb} МБ · {problem.score} баллов
                                            </p>
                                        </div>
                                        <span className="hidden text-xs font-bold text-[#667892] dark:text-[#aebfd6] md:block">{problem.time_limit_ms} мс</span>
                                        <span className="hidden text-xs font-bold text-[#667892] dark:text-[#aebfd6] md:block">{problem.memory_limit_mb} МБ</span>
                                        <span className="hidden text-xs font-black text-[#355da8] dark:text-[#a9c7ff] md:block">{problem.score}</span>
                                        <div className="flex flex-wrap gap-2">
                                            <Link href={route('admin.competitions.problems.show', [competition.id, problem.id])} className="rounded-lg bg-[#edf3ff] dark:bg-[#203858] px-3 py-2 text-[11px] font-black text-[#355da8] dark:text-[#a9c7ff] hover:bg-[#dfe9fa] dark:hover:bg-[#254368]">Просмотр</Link>
                                            <Link href={route('admin.competitions.problems.edit', [competition.id, problem.id])} className="rounded-lg border border-[#d5deeb] dark:border-[#314763] px-3 py-2 text-[11px] font-black text-[#667892] dark:text-[#aebfd6] hover:bg-[#f3f6fb] dark:hover:bg-[#0c1628]">Изменить</Link>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                <section className="mt-8 rounded-2xl border border-[#dfe7f3] dark:border-[#2d405b] bg-white dark:bg-[#142238] p-6">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#355da8] dark:text-[#a9c7ff]">Регистрация</p>
                            <h2 className="mt-2 text-2xl font-black text-[#142d55] dark:text-[#e8eef9]">
                                Участники <span className="text-[#8795a9] dark:text-[#a4b6cf]">({competition.registered_users_count})</span>
                            </h2>
                        </div>
                        <span className="rounded-full bg-[#edf3ff] dark:bg-[#203858] px-3 py-1.5 text-xs font-bold text-[#355da8] dark:text-[#a9c7ff]">
                            {competition.registration_label}
                        </span>
                    </div>

                    <form onSubmit={addParticipant} className="mt-5 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                        <div>
                            <label htmlFor="participant_email" className="sr-only">Email участника</label>
                            <input
                                id="participant_email"
                                type="email"
                                value={participantForm.data.email}
                                onChange={(event) => participantForm.setData('email', event.target.value)}
                                placeholder="student@atu.kz"
                                className="block w-full rounded-xl border-[#ccd7e8] dark:border-[#3a506e] px-4 py-3 text-sm text-[#142d55] dark:text-[#e8eef9] shadow-sm focus:border-[#355da8] dark:focus:border-[#91b8ff] focus:ring-[#355da8] dark:focus:ring-[#91b8ff]"
                                required
                            />
                            {participantForm.errors.email && <p className="mt-2 text-xs font-semibold text-red-600 dark:text-red-300">{participantForm.errors.email}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={participantForm.processing}
                            className="h-fit rounded-xl bg-[#355da8] px-5 py-3 text-sm font-black text-white transition hover:bg-[#294f91] disabled:opacity-60"
                        >
                            Добавить участника
                        </button>
                    </form>

                    {competition.registered_users.length === 0 ? (
                        <p className="mt-5 rounded-xl bg-[#f7f9fd] dark:bg-[#17263e] px-4 py-5 text-sm text-[#7184a0] dark:text-[#aebfd6]">Пока никто не зарегистрирован.</p>
                    ) : (
                        <div className="mt-5 divide-y divide-[#edf1f7] overflow-hidden rounded-xl border border-[#e3eaf5] dark:border-[#2d405b]">
                            {competition.registered_users.map((user) => (
                                <div key={user.id} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm font-black text-[#314765] dark:text-[#d2dff1]">{user.name}</p>
                                        <p className="mt-1 text-xs font-semibold text-[#8795a9] dark:text-[#a4b6cf]">{user.email}</p>
                                    </div>
                                    <Link
                                        href={route('admin.competitions.participants.destroy', [competition.id, user.id])}
                                        method="delete"
                                        as="button"
                                        preserveScroll
                                        className="text-left text-xs font-black text-red-600 dark:text-red-300 hover:text-red-700 dark:hover:text-red-300"
                                    >
                                        Удалить
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </AdminLayout>
    );
}
