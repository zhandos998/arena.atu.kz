import ArenaIcon from '@/Components/ArenaIcon';
import InputError from '@/Components/InputError';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/lib/i18n';
import { Head, Link, useForm, usePage, usePoll } from '@inertiajs/react';

function TextSection({ title, children }) {
    if (!children) return null;

    return (
        <section>
            <h2 className="text-xl font-black text-[#173563] dark:text-[#eaf1ff]">{title}</h2>
            <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#405674] dark:text-[#b9cbe3]">{children}</div>
        </section>
    );
}

function verdictClass(verdict) {
    if (verdict === 'accepted') return 'bg-[#e8f8f1] dark:bg-[#123b31] text-[#16845a] dark:text-[#86dfb4]';
    if (!verdict) return 'bg-[#edf3ff] dark:bg-[#203858] text-[#355da8] dark:text-[#a9c7ff]';
    return 'bg-red-50 dark:bg-[#3a222c] text-red-700 dark:text-red-300';
}

export default function Show({ competition, problem, submissions }) {
    const { flash } = usePage().props;
    const { locale } = useTranslation();
    const copy = {
        ru: { problem: 'Задача', competitionProblems: 'Задачи соревнования', totalScore: 'Общий балл', time: 'Время', memory: 'Память', points: 'Баллы', statement: 'Условие', input: 'Входные данные', output: 'Выходные данные', constraints: 'Ограничения', examples: 'Примеры', example: 'Пример', submit: 'Отправить решение', hint: 'Код будет выполнен в изолированном контейнере на скрытых тестах.', language: 'Язык', source: 'Исходный код', sending: 'Отправляем…', send: 'Отправить на проверку', attempts: 'Мои попытки', noAttempts: 'Вы ещё не отправляли решения.', score: 'баллов', allPassed: 'Все тесты пройдены', stoppedAt: 'Остановлено на тесте', checked: 'Проверено тестов' },
        kk: { problem: 'Есеп', competitionProblems: 'Жарыс есептері', totalScore: 'Жалпы ұпай', time: 'Уақыт', memory: 'Жад', points: 'Ұпай', statement: 'Шарты', input: 'Кіріс деректері', output: 'Шығыс деректері', constraints: 'Шектеулер', examples: 'Мысалдар', example: 'Мысал', submit: 'Шешімді жіберу', hint: 'Код жасырын тесттерде оқшауланған контейнерде орындалады.', language: 'Тіл', source: 'Бастапқы код', sending: 'Жіберілуде…', send: 'Тексеруге жіберу', attempts: 'Менің әрекеттерім', noAttempts: 'Сіз әлі шешім жібермедіңіз.', score: 'ұпай', allPassed: 'Барлық тест өтті', stoppedAt: 'Тоқтаған тест', checked: 'Тексерілген тесттер' },
        en: { problem: 'Problem', competitionProblems: 'Competition problems', totalScore: 'Total score', time: 'Time', memory: 'Memory', points: 'Points', statement: 'Statement', input: 'Input', output: 'Output', constraints: 'Constraints', examples: 'Examples', example: 'Example', submit: 'Submit solution', hint: 'The code will run in an isolated container against hidden tests.', language: 'Language', source: 'Source code', sending: 'Submitting…', send: 'Submit for judging', attempts: 'My submissions', noAttempts: 'You have not submitted a solution yet.', score: 'points', allPassed: 'All tests passed', stoppedAt: 'Stopped on test', checked: 'Tests checked' },
    }[locale];
    const form = useForm({ language: competition.allowed_languages[0]?.value ?? '', source_code: '' });
    usePoll(3000, { only: ['submissions'] }, { keepAlive: false });

    const submit = (event) => {
        event.preventDefault();
        form.post(route('competitions.problems.submissions.store', [competition.id, problem.id]), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${problem.code}. ${problem.title}`} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {flash?.success && (
                    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#bfe9d5] dark:border-[#2b715d] bg-[#e8f8f1] dark:bg-[#123b31] px-4 py-3 text-sm font-bold text-[#16845a] dark:text-[#86dfb4]">
                        <ArenaIcon name="check" className="h-5 w-5" />
                        {flash.success}
                    </div>
                )}

                <div className="mb-5 flex flex-wrap items-center gap-2 text-sm">
                    <Link href={route('competitions.show', competition.id)} className="font-black text-[#355da8] dark:text-[#a9c7ff]">{competition.title}</Link>
                    <span className="text-[#a2adbc] dark:text-[#a8b9d1]">/</span>
                    <span className="text-[#7184a0] dark:text-[#aebfd6]">{copy.problem} {problem.code}</span>
                </div>

                <nav className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-[#dfe7f3] dark:border-[#2d405b] bg-white dark:bg-[#142238] p-3 shadow-sm" aria-label={copy.competitionProblems}>
                    <div className="flex min-w-0 gap-2 overflow-x-auto">
                        {competition.problems.map((competitionProblem) => {
                            const active = competitionProblem.id === problem.id;
                            const suffix = competitionProblem.progress === 'full' ? '++' : competitionProblem.progress === 'partial' ? '+' : '';
                            const progressClass = competitionProblem.progress === 'full'
                                ? 'bg-[#e8f8f1] dark:bg-[#123b31] text-[#16845a] dark:text-[#86dfb4]'
                                : competitionProblem.progress === 'partial'
                                  ? 'bg-[#fff7d7] dark:bg-[#42351b] text-[#8a6810] dark:text-[#f7d77b]'
                                  : 'bg-[#edf3ff] dark:bg-[#203858] text-[#355da8] dark:text-[#a9c7ff]';

                            return (
                                <Link
                                    key={competitionProblem.id}
                                    href={route('competitions.problems.show', [competition.id, competitionProblem.id])}
                                    preserveScroll
                                    title={`${competitionProblem.title} · ${competitionProblem.best_score} ${copy.score}`}
                                    aria-label={`${competitionProblem.code}. ${competitionProblem.title}`}
                                    aria-current={active ? 'page' : undefined}
                                    className={`flex h-11 min-w-11 shrink-0 items-center justify-center rounded-xl px-3 font-mono text-sm font-black transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#355da8] dark:focus-visible:ring-[#91b8ff] ${progressClass} ${active ? '-translate-y-0.5 shadow-md shadow-[#355da8]/20' : ''}`}
                                >
                                    {competitionProblem.code}{suffix}
                                </Link>
                            );
                        })}
                    </div>
                    <div className="shrink-0 rounded-xl bg-[#193f7d] px-4 py-2 text-right text-white">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-white/60">{copy.totalScore}</p>
                        <p className="font-mono text-lg font-black text-[#ffd83d]">{competition.total_score}</p>
                    </div>
                </nav>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
                    <article className="overflow-hidden rounded-2xl border border-[#dfe7f3] dark:border-[#2d405b] bg-white dark:bg-[#142238] shadow-sm">
                        <header className="border-b border-[#e8edf5] dark:border-[#2d405b] px-6 py-8 text-center sm:px-10">
                            <span className="inline-flex h-11 min-w-11 items-center justify-center rounded-xl bg-[#355da8] px-3 font-mono text-sm font-black text-white">{problem.code}</span>
                            <h1 className="mt-4 text-3xl font-black text-[#142d55] dark:text-[#e8eef9]">{problem.title}</h1>
                            <p className="mt-3 text-xs font-semibold italic text-[#7184a0] dark:text-[#aebfd6]">{copy.time}: {problem.time_limit_ms / 1000} s · {copy.memory}: {problem.memory_limit_mb} MB · {copy.points}: {problem.score}</p>
                        </header>

                        <div className="grid gap-8 px-6 py-8 sm:px-10">
                            <TextSection title={copy.statement}>{problem.statement}</TextSection>
                            <TextSection title={copy.input}>{problem.input_format}</TextSection>
                            <TextSection title={copy.output}>{problem.output_format}</TextSection>
                            <TextSection title={copy.constraints}>{problem.constraints}</TextSection>

                            <section>
                                <h2 className="text-xl font-black text-[#173563] dark:text-[#eaf1ff]">{copy.examples}</h2>
                                <div className="mt-4 grid gap-4">
                                    {problem.samples.map((sample, index) => (
                                        <article key={sample.id} className="overflow-hidden rounded-xl border border-[#bcdcbf] dark:border-[#38734b]">
                                            <div className="bg-[#eef9ef] dark:bg-[#153b2e] px-4 py-2 text-xs font-black text-[#24713d] dark:text-[#8edf9d]">{copy.example} №{index + 1}</div>
                                            <div className="grid divide-y divide-[#dcebdd] md:grid-cols-2 md:divide-x md:divide-y-0">
                                                <div className="p-4"><p className="text-[10px] font-black uppercase text-[#7184a0] dark:text-[#aebfd6]">INPUT</p><pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-xs text-[#142d55] dark:text-[#e8eef9]">{sample.input}</pre></div>
                                                <div className="p-4"><p className="text-[10px] font-black uppercase text-[#7184a0] dark:text-[#aebfd6]">OUTPUT</p><pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-xs text-[#142d55] dark:text-[#e8eef9]">{sample.output}</pre></div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </article>

                    <aside className="grid h-fit gap-6 xl:sticky xl:top-24">
                        <form onSubmit={submit} className="rounded-2xl border border-[#dfe7f3] dark:border-[#2d405b] bg-white dark:bg-[#142238] p-5 shadow-sm">
                            <h2 className="text-xl font-black text-[#142d55] dark:text-[#e8eef9]">{copy.submit}</h2>
                            <p className="mt-2 text-xs leading-5 text-[#7184a0] dark:text-[#aebfd6]">{copy.hint}</p>

                            <label htmlFor="language" className="mt-5 block text-sm font-bold text-[#314765] dark:text-[#d2dff1]">{copy.language}</label>
                            <select id="language" value={form.data.language} onChange={(event) => form.setData('language', event.target.value)} className="mt-2 block w-full rounded-xl border-[#ccd7e8] dark:border-[#3a506e] px-4 py-3 text-sm focus:border-[#355da8] dark:focus:border-[#91b8ff] focus:ring-[#355da8] dark:focus:ring-[#91b8ff]">
                                {competition.allowed_languages.map((language) => <option key={language.value} value={language.value}>{language.label}</option>)}
                            </select>
                            <InputError message={form.errors.language} className="mt-2" />

                            <label htmlFor="source_code" className="mt-4 block text-sm font-bold text-[#314765] dark:text-[#d2dff1]">{copy.source}</label>
                            <textarea id="source_code" rows="18" value={form.data.source_code} onChange={(event) => form.setData('source_code', event.target.value)} className="mt-2 block w-full rounded-xl border-[#ccd7e8] dark:border-[#3a506e] bg-[#10264f] px-4 py-3 font-mono text-xs leading-5 text-[#eaf1ff] shadow-sm focus:border-[#6f91cc] focus:ring-[#6f91cc] dark:focus:ring-[#a2c4ff]" spellCheck="false" required />
                            <InputError message={form.errors.source_code} className="mt-2" />

                            <button type="submit" disabled={form.processing} className="mt-5 w-full rounded-xl bg-[#355da8] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#355da8]/20 disabled:opacity-60">
                                {form.processing ? copy.sending : copy.send}
                            </button>
                        </form>

                        <section className="rounded-2xl border border-[#dfe7f3] dark:border-[#2d405b] bg-white dark:bg-[#142238] p-5">
                            <h2 className="text-lg font-black text-[#142d55] dark:text-[#e8eef9]">{copy.attempts}</h2>
                            {submissions.length === 0 ? (
                                <p className="mt-4 text-sm text-[#7184a0] dark:text-[#aebfd6]">{copy.noAttempts}</p>
                            ) : (
                                <div className="mt-4 grid gap-2">
                                    {submissions.map((submission) => (
                                        <Link key={submission.id} href={route('submissions.show', submission.id)} className="flex items-center justify-between gap-3 rounded-xl border border-[#e3eaf5] dark:border-[#2d405b] p-3 hover:bg-[#f7f9fd] dark:hover:bg-[#17263e]">
                                            <div>
                                                <p className="text-xs font-black text-[#314765] dark:text-[#d2dff1]">#{submission.id} · {submission.language}</p>
                                                <p className="mt-1 text-[11px] text-[#8795a9] dark:text-[#a4b6cf]">
                                                    {submission.status !== 'finished'
                                                        ? `${copy.checked}: ${submission.tested_count}`
                                                        : submission.verdict === 'accepted'
                                                          ? copy.allPassed
                                                          : submission.failed_test
                                                            ? `${copy.stoppedAt} ${submission.failed_test}`
                                                            : submission.verdict_label}
                                                    {' · '}{submission.score} {copy.score}
                                                </p>
                                            </div>
                                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${verdictClass(submission.verdict)}`}>{submission.verdict_label}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </section>
                    </aside>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
