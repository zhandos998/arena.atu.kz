import ArenaIcon from '@/Components/ArenaIcon';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

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

export default function Index({ problems, competitions, filters, stats }) {
    const initialCompetition = filters.competition?.toString() ?? competitions[0]?.id?.toString() ?? '';
    const [createCompetition, setCreateCompetition] = useState(initialCompetition);

    const filterByCompetition = (competitionId) => {
        router.get(
            route('admin.problems.index'),
            competitionId ? { competition: competitionId } : {},
            { preserveScroll: true, preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout title="Задачи" subtitle="Все задачи соревнований АТУ">
            <Head title="Задачи" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#355da8] dark:text-[#a9c7ff]">Банк задач</p>
                        <h1 className="mt-2 text-3xl font-black tracking-tight text-[#142d55] dark:text-[#e8eef9]">Задачи</h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667892] dark:text-[#aebfd6]">
                            Просматривайте условия, примеры и ограничения, редактируйте задачи каждого соревнования.
                        </p>
                    </div>

                    {competitions.length > 0 && (
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                            <label className="block">
                                <span className="text-[10px] font-black uppercase tracking-wider text-[#8795a9] dark:text-[#a4b6cf]">Добавить в соревнование</span>
                                <select
                                    value={createCompetition}
                                    onChange={(event) => setCreateCompetition(event.target.value)}
                                    className="mt-1.5 block w-full min-w-60 rounded-xl border-[#ccd7e8] dark:border-[#3a506e] bg-white dark:bg-[#142238] px-4 py-2.5 text-sm font-bold text-[#314765] dark:text-[#d2dff1] shadow-sm focus:border-[#355da8] dark:focus:border-[#91b8ff] focus:ring-[#355da8] dark:focus:ring-[#91b8ff]"
                                >
                                    {competitions.map((competition) => (
                                        <option key={competition.id} value={competition.id}>{competition.title}</option>
                                    ))}
                                </select>
                            </label>
                            <Link
                                href={route('admin.competitions.problems.create', createCompetition)}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#355da8] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#355da8]/20 transition hover:bg-[#294f91]"
                            >
                                <span className="text-lg leading-none">+</span>
                                Добавить задачу
                            </Link>
                        </div>
                    )}
                </div>

                <section className="mt-7 grid gap-4 sm:grid-cols-3">
                    <StatCard icon="code" label="Всего задач" value={stats.total} />
                    <StatCard icon="check" label="С примерами" value={stats.with_samples} />
                    <StatCard icon="trophy" label="Соревнований с задачами" value={stats.competitions} />
                </section>

                <section className="mt-7 rounded-2xl border border-[#dfe7f3] dark:border-[#2d405b] bg-white dark:bg-[#142238]">
                    <div className="flex flex-col gap-4 border-b border-[#e8edf5] dark:border-[#2d405b] p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-black text-[#142d55] dark:text-[#e8eef9]">Список задач</h2>
                            <p className="mt-1 text-xs text-[#8795a9] dark:text-[#a4b6cf]">Показано: {problems.data.length} из {problems.total}</p>
                        </div>
                        <label className="block">
                            <span className="sr-only">Фильтр по соревнованию</span>
                            <select
                                value={filters.competition ?? ''}
                                onChange={(event) => filterByCompetition(event.target.value)}
                                className="block w-full min-w-64 rounded-xl border-[#ccd7e8] dark:border-[#3a506e] bg-white dark:bg-[#142238] px-4 py-2.5 text-sm font-semibold text-[#314765] dark:text-[#d2dff1] focus:border-[#355da8] dark:focus:border-[#91b8ff] focus:ring-[#355da8] dark:focus:ring-[#91b8ff]"
                            >
                                <option value="">Все соревнования</option>
                                {competitions.map((competition) => (
                                    <option key={competition.id} value={competition.id}>
                                        {competition.title} ({competition.problems_count})
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {problems.data.length === 0 ? (
                        <div className="px-6 py-14 text-center">
                            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf3ff] dark:bg-[#203858] text-[#355da8] dark:text-[#a9c7ff]">
                                <ArenaIcon name="code" className="h-7 w-7" />
                            </span>
                            <h3 className="mt-5 text-lg font-black text-[#142d55] dark:text-[#e8eef9]">Задачи не найдены</h3>
                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7184a0] dark:text-[#aebfd6]">
                                {competitions.length === 0
                                    ? 'Сначала создайте соревнование, затем добавьте в него задачи.'
                                    : 'Добавьте первую задачу или выберите другое соревнование в фильтре.'}
                            </p>
                            {competitions.length === 0 && (
                                <Link href={route('admin.competitions.create')} className="mt-5 inline-flex rounded-xl bg-[#355da8] px-5 py-3 text-sm font-black text-white">
                                    Создать соревнование
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-[#edf1f7]">
                            {problems.data.map((problem) => (
                                <article key={problem.id} className="grid gap-4 p-5 lg:grid-cols-[64px_minmax(0,1fr)_repeat(4,100px)_180px] lg:items-center">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#355da8] font-mono text-sm font-black text-white">{problem.code}</span>
                                    <div className="min-w-0">
                                        <Link href={route('admin.competitions.problems.show', [problem.competition_id, problem.id])} className="block truncate text-sm font-black text-[#253b58] dark:text-[#d5e1f1] transition hover:text-[#355da8] dark:hover:text-[#a9c7ff]">
                                            {problem.title}
                                        </Link>
                                        <Link href={route('admin.competitions.show', problem.competition_id)} className="mt-1 block truncate text-xs font-semibold text-[#7184a0] dark:text-[#aebfd6] hover:text-[#355da8] dark:hover:text-[#a9c7ff]">
                                            {problem.competition_title}
                                        </Link>
                                    </div>
                                    <div className="text-xs lg:text-center">
                                        <span className="text-[#8795a9] dark:text-[#a4b6cf] lg:hidden">Время: </span>
                                        <span className="font-bold text-[#405674] dark:text-[#b9cbe3]">{problem.time_limit_ms} мс</span>
                                    </div>
                                    <div className="text-xs lg:text-center">
                                        <span className="text-[#8795a9] dark:text-[#a4b6cf] lg:hidden">Память: </span>
                                        <span className="font-bold text-[#405674] dark:text-[#b9cbe3]">{problem.memory_limit_mb} МБ</span>
                                    </div>
                                    <div className="text-xs lg:text-center">
                                        <span className="text-[#8795a9] dark:text-[#a4b6cf] lg:hidden">Баллы: </span>
                                        <span className="font-black text-[#355da8] dark:text-[#a9c7ff]">{problem.score}</span>
                                    </div>
                                    <div className="text-xs lg:text-center">
                                        <span className="text-[#8795a9] dark:text-[#a4b6cf] lg:hidden">Примеры: </span>
                                        <span className={`inline-flex rounded-full px-2.5 py-1 font-black ${problem.samples_count > 0 ? 'bg-[#e8f8f1] dark:bg-[#123b31] text-[#16845a] dark:text-[#86dfb4]' : 'bg-[#fff2f2] dark:bg-[#40252e] text-[#b64b55] dark:text-[#ffaab3]'}`}>
                                            {problem.samples_count}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 lg:justify-end">
                                        <Link href={route('admin.competitions.problems.show', [problem.competition_id, problem.id])} className="rounded-lg bg-[#edf3ff] dark:bg-[#203858] px-3 py-2 text-xs font-black text-[#355da8] dark:text-[#a9c7ff] hover:bg-[#dfe9fa] dark:hover:bg-[#254368]">Просмотр</Link>
                                        <Link href={route('admin.competitions.problems.edit', [problem.competition_id, problem.id])} className="rounded-lg border border-[#d5deeb] dark:border-[#314763] px-3 py-2 text-xs font-black text-[#667892] dark:text-[#aebfd6] hover:bg-[#f3f6fb] dark:hover:bg-[#0c1628]">Изменить</Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                {problems.links.length > 3 && (
                    <nav className="mt-7 flex flex-wrap justify-center gap-2" aria-label="Страницы задач">
                        {problems.links.map((link) => (
                            link.url ? (
                                <Link key={link.label} href={link.url} preserveScroll className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${link.active ? 'border-[#355da8] dark:border-[#91b8ff] bg-[#355da8] text-white' : 'border-[#dfe7f3] dark:border-[#2d405b] bg-white dark:bg-[#142238] text-[#667892] dark:text-[#aebfd6] hover:border-[#b8c9e4] dark:hover:border-[#516e95]'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ) : (
                                <span key={link.label} className="rounded-lg border border-[#e6ebf3] dark:border-[#2d405b] bg-[#f7f9fc] dark:bg-[#17263e] px-3 py-2 text-xs font-bold text-[#b0bac8] dark:text-[#b6c6da]" dangerouslySetInnerHTML={{ __html: link.label }} />
                            )
                        ))}
                    </nav>
                )}
            </div>
        </AdminLayout>
    );
}
