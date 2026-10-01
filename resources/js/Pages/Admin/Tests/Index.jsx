import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

function Stat({ label, value, warning = false }) {
    return <div className={`rounded-2xl border p-5 ${warning ? 'border-[#f0d98b] dark:border-[#826c36] bg-[#fffaf0] dark:bg-[#42351b]' : 'border-[#dfe7f3] dark:border-[#2d405b] bg-white dark:bg-[#142238]'}`}><p className="text-xs font-semibold text-[#8795a9] dark:text-[#a4b6cf]">{label}</p><p className="mt-2 text-3xl font-black text-[#142d55] dark:text-[#e8eef9]">{value}</p></div>;
}

export default function Index({ problems, stats }) {
    return (
        <AdminLayout title="Тесты и проверка" subtitle="Готовность задач к автоматической проверке">
            <Head title="Тесты и проверка" />
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#355da8] dark:text-[#a9c7ff]">Judge system</p>
                    <h1 className="mt-2 text-3xl font-black text-[#142d55] dark:text-[#e8eef9]">Тесты и проверка</h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667892] dark:text-[#aebfd6]">Добавляйте 30–50 скрытых тестов, настраивайте checker и эталонное решение для каждой задачи.</p>
                </div>

                <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Stat label="Всего тестов" value={stats.tests} />
                    <Stat label="Активных тестов" value={stats.active_tests} />
                    <Stat label="Задач готовы" value={stats.ready_problems} />
                    <Stat label="Без тестов" value={stats.problems_without_tests} warning={stats.problems_without_tests > 0} />
                </section>

                <section className="mt-7 overflow-hidden rounded-2xl border border-[#dfe7f3] dark:border-[#2d405b] bg-white dark:bg-[#142238]">
                    <div className="border-b border-[#e8edf5] dark:border-[#2d405b] p-5"><h2 className="text-lg font-black text-[#142d55] dark:text-[#e8eef9]">Готовность задач</h2><p className="mt-1 text-xs text-[#8795a9] dark:text-[#a4b6cf]">Показано {problems.data.length} из {problems.total}</p></div>
                    {problems.data.length === 0 ? (
                        <div className="px-6 py-14 text-center text-sm text-[#7184a0] dark:text-[#aebfd6]">Сначала добавьте задачи в соревнование.</div>
                    ) : (
                        <div className="divide-y divide-[#edf1f7]">
                            {problems.data.map((problem) => (
                                <article key={problem.id} className="grid gap-4 p-5 lg:grid-cols-[56px_minmax(0,1fr)_120px_130px_120px_150px] lg:items-center">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#355da8] font-mono text-sm font-black text-white">{problem.code}</span>
                                    <div className="min-w-0"><p className="truncate text-sm font-black text-[#314765] dark:text-[#d2dff1]">{problem.title}</p><p className="mt-1 truncate text-xs text-[#8795a9] dark:text-[#a4b6cf]">{problem.competition_title}</p></div>
                                    <div className="text-xs"><span className="text-[#8795a9] dark:text-[#a4b6cf]">Тесты: </span><span className={`font-black ${problem.active_test_cases_count >= 30 ? 'text-[#16845a] dark:text-[#86dfb4]' : 'text-[#b87810] dark:text-[#f7d77b]'}`}>{problem.active_test_cases_count}/{problem.test_cases_count}</span></div>
                                    <div className="text-xs"><span className="text-[#8795a9] dark:text-[#a4b6cf]">Checker: </span><span className="font-black text-[#314765] dark:text-[#d2dff1]">{problem.checker_type === 'exact' ? 'точный' : 'по токенам'}</span></div>
                                    <div className="text-xs"><span className={`rounded-full px-2.5 py-1 font-black ${problem.has_reference_solution ? 'bg-[#e8f8f1] dark:bg-[#123b31] text-[#16845a] dark:text-[#86dfb4]' : 'bg-[#fff7d7] dark:bg-[#42351b] text-[#8a6810] dark:text-[#f7d77b]'}`}>{problem.has_reference_solution ? 'Эталон есть' : 'Нет эталона'}</span></div>
                                    <Link href={route('admin.competitions.problems.tests.index', [problem.competition_id, problem.id])} className="rounded-xl bg-[#355da8] px-4 py-2.5 text-center text-xs font-black text-white">Настроить тесты</Link>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                {problems.links.length > 3 && <nav className="mt-7 flex flex-wrap justify-center gap-2">{problems.links.map((link) => link.url ? <Link key={link.label} href={link.url} className={`rounded-lg border px-3 py-2 text-xs font-bold ${link.active ? 'border-[#355da8] dark:border-[#91b8ff] bg-[#355da8] text-white' : 'border-[#dfe7f3] dark:border-[#2d405b] bg-white dark:bg-[#142238] text-[#667892] dark:text-[#aebfd6]'}`} dangerouslySetInnerHTML={{ __html: link.label }} /> : <span key={link.label} className="rounded-lg border px-3 py-2 text-xs text-[#b0bac8] dark:text-[#b6c6da]" dangerouslySetInnerHTML={{ __html: link.label }} />)}</nav>}
            </div>
        </AdminLayout>
    );
}
