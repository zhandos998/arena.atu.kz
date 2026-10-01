import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/lib/i18n';
import { Head, Link, usePoll } from '@inertiajs/react';

function badgeClass(verdict) {
    if (verdict === 'accepted') return 'bg-[#e8f8f1] dark:bg-[#123b31] text-[#16845a] dark:text-[#86dfb4]';
    if (!verdict) return 'bg-[#edf3ff] dark:bg-[#203858] text-[#355da8] dark:text-[#a9c7ff]';
    return 'bg-red-50 dark:bg-[#3a222c] text-red-700 dark:text-red-300';
}

export default function Show({ submission }) {
    const { locale } = useTranslation();
    const copy = {
        ru: { result: 'Результат проверки', allPassed: 'Все тесты пройдены', stoppedAt: 'Остановлено на тесте', checked: 'Проверено тестов' },
        kk: { result: 'Тексеру нәтижесі', allPassed: 'Барлық тест өтті', stoppedAt: 'Тоқтаған тест', checked: 'Тексерілген тесттер' },
        en: { result: 'Judging result', allPassed: 'All tests passed', stoppedAt: 'Stopped on test', checked: 'Tests checked' },
    }[locale];
    usePoll(2500, {}, { keepAlive: false });

    const testSummary = submission.status !== 'finished'
        ? `${copy.checked}: ${submission.tested_count}`
        : submission.verdict === 'accepted'
          ? copy.allPassed
          : submission.failed_test
            ? `${copy.stoppedAt} ${submission.failed_test}`
            : submission.verdict_label;

    return (
        <AuthenticatedLayout>
            <Head title={`Посылка #${submission.id}`} />
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <Link href={route('competitions.problems.show', [submission.competition.id, submission.problem.id])} className="text-sm font-black text-[#355da8] dark:text-[#a9c7ff]">← Вернуться к задаче</Link>

                <section className="mt-5 rounded-2xl border border-[#dfe7f3] dark:border-[#2d405b] bg-white dark:bg-[#142238] p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#355da8] dark:text-[#a9c7ff]">Посылка #{submission.id}</p>
                            <h1 className="mt-2 text-2xl font-black text-[#142d55] dark:text-[#e8eef9]">{submission.problem.code}. {submission.problem.title}</h1>
                            <p className="mt-2 text-sm text-[#7184a0] dark:text-[#aebfd6]">Язык: {submission.language} · Баллы: {submission.score}</p>
                        </div>
                        <span className={`rounded-full px-4 py-2 text-xs font-black ${badgeClass(submission.verdict)}`}>{submission.verdict_label}</span>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl bg-[#f7f9fd] dark:bg-[#17263e] p-4"><p className="text-xs text-[#8795a9] dark:text-[#a4b6cf]">{copy.result}</p><p className="mt-1 text-lg font-black text-[#142d55] dark:text-[#e8eef9]">{testSummary}</p></div>
                        <div className="rounded-xl bg-[#f7f9fd] dark:bg-[#17263e] p-4"><p className="text-xs text-[#8795a9] dark:text-[#a4b6cf]">Время</p><p className="mt-1 text-lg font-black text-[#142d55] dark:text-[#e8eef9]">{submission.execution_time_ms ?? '—'} мс</p></div>
                        <div className="rounded-xl bg-[#f7f9fd] dark:bg-[#17263e] p-4"><p className="text-xs text-[#8795a9] dark:text-[#a4b6cf]">Статус</p><p className="mt-1 text-lg font-black text-[#142d55] dark:text-[#e8eef9]">{submission.status}</p></div>
                    </div>

                    {submission.compiler_output && <pre className="mt-6 max-h-72 overflow-auto rounded-xl bg-[#10264f] p-4 font-mono text-xs leading-5 text-[#eaf1ff]">{submission.compiler_output}</pre>}

                    {submission.results.length > 0 && (
                        <div className="mt-6 overflow-hidden rounded-xl border border-[#e3eaf5] dark:border-[#2d405b]">
                            {submission.results.map((result) => (
                                <div key={result.position} className="grid grid-cols-[70px_minmax(0,1fr)_90px] items-center gap-3 border-b border-[#edf1f7] dark:border-[#2d405b] px-4 py-3 text-xs last:border-b-0">
                                    <span className="font-black text-[#314765] dark:text-[#d2dff1]">Тест {result.position}</span>
                                    <span className={result.verdict === 'accepted' ? 'font-bold text-[#16845a] dark:text-[#86dfb4]' : 'font-bold text-red-600 dark:text-red-300'}>{result.verdict_label}</span>
                                    <span className="text-right text-[#8795a9] dark:text-[#a4b6cf]">{result.execution_time_ms ?? '—'} мс</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <h2 className="mt-7 text-lg font-black text-[#142d55] dark:text-[#e8eef9]">Исходный код</h2>
                    <pre className="mt-3 max-h-[600px] overflow-auto rounded-xl bg-[#10264f] p-5 font-mono text-xs leading-5 text-[#eaf1ff]">{submission.source_code}</pre>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
