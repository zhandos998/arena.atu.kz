import ArenaIcon from '@/Components/ArenaIcon';
import RichTextContent from '@/Components/RichTextContent';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';

function TextSection({ title, children }) {
    if (!children) {
        return null;
    }

    return (
        <section>
            <h2 className="text-xl font-black text-[#173563] dark:text-[#eaf1ff]">{title}</h2>
            <RichTextContent content={children} className="mt-3" />
        </section>
    );
}

export default function Show({ competition, problem }) {
    const { flash } = usePage().props;

    return (
        <AdminLayout title={`${problem.code}. ${problem.title}`} subtitle={competition.title}>
            <Head title={`${problem.code}. ${problem.title}`} />

            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                {flash?.success && (
                    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#bfe9d5] dark:border-[#2b715d] bg-[#e8f8f1] dark:bg-[#123b31] px-4 py-3 text-sm font-bold text-[#16845a] dark:text-[#86dfb4]">
                        <ArenaIcon name="check" className="h-5 w-5 shrink-0" />
                        {flash.success}
                    </div>
                )}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-2 text-sm">
                        <Link href={route('admin.competitions.show', competition.id)} className="truncate font-bold text-[#355da8] dark:text-[#a9c7ff] hover:text-[#23457e]">{competition.title}</Link>
                        <span className="text-[#a2adbc] dark:text-[#a8b9d1]">/</span>
                        <span className="shrink-0 text-[#7184a0] dark:text-[#aebfd6]">Задача {problem.code}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link href={route('admin.competitions.problems.tests.index', [competition.id, problem.id])} className="inline-flex items-center justify-center rounded-xl bg-[#ffd83d] px-4 py-2.5 text-sm font-black text-[#10264f] transition hover:bg-[#ffe36c]">Тесты ({problem.test_cases_count})</Link>
                        <Link href={route('admin.competitions.problems.edit', [competition.id, problem.id])} className="inline-flex items-center justify-center rounded-xl bg-[#355da8] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#294f91]">Изменить задачу</Link>
                    </div>
                </div>

                <article className="mt-6 overflow-hidden rounded-2xl border border-[#dfe7f3] dark:border-[#2d405b] bg-white dark:bg-[#142238] shadow-sm">
                    <header className="border-b border-[#e8edf5] dark:border-[#2d405b] px-6 py-8 text-center sm:px-10">
                        <span className="inline-flex h-11 min-w-11 items-center justify-center rounded-xl bg-[#355da8] px-3 font-mono text-sm font-black text-white">{problem.code}</span>
                        <h1 className="mt-4 text-3xl font-black tracking-tight text-[#142d55] dark:text-[#e8eef9]">{problem.title}</h1>
                        <p className="mt-3 text-xs font-semibold italic text-[#7184a0] dark:text-[#aebfd6]">
                            Время: {problem.time_limit_ms / 1000} сек. · Память: {problem.memory_limit_mb} МБ · Баллы: {problem.score}
                        </p>
                    </header>

                    <div className="grid gap-8 px-6 py-8 sm:px-10">
                        <TextSection title="Условие">{problem.statement}</TextSection>
                        <TextSection title="Входные данные">{problem.input_format}</TextSection>
                        <TextSection title="Выходные данные">{problem.output_format}</TextSection>
                        <TextSection title="Ограничения">{problem.constraints}</TextSection>

                        <section>
                            <h2 className="text-xl font-black text-[#173563] dark:text-[#eaf1ff]">Примеры</h2>
                            {problem.samples.length === 0 ? (
                                <p className="mt-3 text-sm text-[#8795a9] dark:text-[#a4b6cf]">Публичные примеры пока не добавлены.</p>
                            ) : (
                                <div className="mt-4 grid gap-4">
                                    {problem.samples.map((sample, index) => (
                                        <article key={sample.id ?? index} className="overflow-hidden rounded-xl border border-[#bcdcbf] dark:border-[#38734b]">
                                            <div className="grid bg-[#e9f8e8] dark:bg-[#153b2e] text-xs font-black text-[#236329] dark:text-[#8edf9d] sm:grid-cols-2">
                                                <span className="border-b border-[#bcdcbf] dark:border-[#38734b] px-4 py-2 sm:border-r sm:border-b-0">INPUT.TXT · пример {index + 1}</span>
                                                <span className="px-4 py-2">OUTPUT.TXT</span>
                                            </div>
                                            <div className="grid sm:grid-cols-2">
                                                <pre className="overflow-x-auto whitespace-pre-wrap border-b border-[#dfe7f3] dark:border-[#2d405b] p-4 font-mono text-sm leading-6 text-[#253b58] dark:text-[#d5e1f1] sm:border-r sm:border-b-0">{sample.input}</pre>
                                                <pre className="overflow-x-auto whitespace-pre-wrap p-4 font-mono text-sm leading-6 text-[#253b58] dark:text-[#d5e1f1]">{sample.output}</pre>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </article>
            </div>
        </AdminLayout>
    );
}
