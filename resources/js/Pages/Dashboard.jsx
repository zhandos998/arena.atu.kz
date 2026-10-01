import ArenaIcon from '@/Components/ArenaIcon';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/lib/i18n';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

function StatCard({ icon, label, value, helper, accent = false }) {
    return (
        <article className={`rounded-2xl border p-5 ${accent ? 'border-[#355da8] dark:border-[#91b8ff] bg-[#355da8] text-white' : 'border-[#dfe7f3] dark:border-[#2d405b] bg-white dark:bg-[#142238] text-[#142d55] dark:text-[#e8eef9]'}`}>
            <div className="flex items-start justify-between gap-4">
                <div><p className={`text-xs font-semibold ${accent ? 'text-white/60' : 'text-[#8795a9] dark:text-[#a4b6cf]'}`}>{label}</p><p className="mt-2 text-3xl font-black tracking-tight">{value}</p><p className={`mt-1 text-xs ${accent ? 'text-white/65' : 'text-[#7184a0] dark:text-[#aebfd6]'}`}>{helper}</p></div>
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent ? 'bg-white/10 text-[#ffd83d]' : 'bg-[#edf3ff] dark:bg-[#203858] text-[#355da8] dark:text-[#a9c7ff]'}`}><ArenaIcon name={icon} /></span>
            </div>
        </article>
    );
}

function Countdown({ competition, copy }) {
    const target = new Date(competition.has_started ? competition.ends_at : competition.starts_at).getTime();
    const [remaining, setRemaining] = useState(Math.max(0, target - Date.now()));

    useEffect(() => {
        const timer = window.setInterval(() => setRemaining(Math.max(0, target - Date.now())), 1000);
        return () => window.clearInterval(timer);
    }, [target]);

    const seconds = Math.floor(remaining / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const rest = seconds % 60;

    return (
        <div className="rounded-xl border border-white/10 bg-white/[0.07] px-5 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">{competition.has_started ? copy.untilEnd : copy.untilStart}</p>
            <p className="mt-1 font-mono text-xl font-black text-[#ffd83d]">{[hours, minutes, rest].map((value) => String(value).padStart(2, '0')).join(':')}</p>
        </div>
    );
}

function TasksTable({ competition, tasks, stats, copy }) {
    return (
        <section className="overflow-hidden rounded-2xl border border-[#dfe7f3] dark:border-[#2d405b] bg-white dark:bg-[#142238]">
            <div className="flex items-center justify-between gap-4 border-b border-[#e3eaf5] dark:border-[#2d405b] px-5 py-4 sm:px-6">
                <div><h2 className="font-bold text-[#142d55] dark:text-[#e8eef9]">{copy.roundProblems}</h2><p className="mt-1 text-xs text-[#8795a9] dark:text-[#a4b6cf]">{copy.solved} {stats.solved} / {competition.problems_count}</p></div>
                <span className="rounded-full bg-[#fff7d7] dark:bg-[#42351b] px-3 py-1.5 text-xs font-bold text-[#8a6810] dark:text-[#f7d77b]">{competition.title}</span>
            </div>

            {tasks.length === 0 ? (
                <div className="px-6 py-10 text-center text-sm text-[#7184a0] dark:text-[#aebfd6]">{competition.has_started ? copy.noProblems : copy.problemsAfterStart}</div>
            ) : (
                <div className="divide-y divide-[#edf1f7]">
                    {tasks.map((task) => (
                        <Link key={task.id} href={route('competitions.problems.show', [competition.id, task.id])} className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-[#f8fafd] dark:hover:bg-[#111e31] sm:gap-4 sm:px-6">
                            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${task.status === 'solved' ? 'bg-[#e8f8f1] dark:bg-[#123b31] text-[#16845a] dark:text-[#86dfb4]' : task.status === 'attempted' ? 'bg-[#fff7d7] dark:bg-[#42351b] text-[#8a6810] dark:text-[#f7d77b]' : 'bg-[#edf3ff] dark:bg-[#203858] text-[#355da8] dark:text-[#a9c7ff]'}`}>{task.status === 'solved' ? '✓' : task.code}</span>
                            <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-[#314765] dark:text-[#d2dff1]">{task.title}</span><span className="mt-1 block text-xs text-[#8795a9] dark:text-[#a4b6cf]">{task.score} {copy.points} · {task.attempts} {copy.attempts}</span></span>
                            <span className={`hidden rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider sm:inline-flex ${task.status === 'solved' ? 'bg-[#e8f8f1] dark:bg-[#123b31] text-[#16845a] dark:text-[#86dfb4]' : task.status === 'attempted' ? 'bg-[#fff7d7] dark:bg-[#42351b] text-[#8a6810] dark:text-[#f7d77b]' : 'bg-[#f1f4f8] dark:bg-[#17263e] text-[#8795a9] dark:text-[#a4b6cf]'}`}>{task.status === 'solved' ? copy.solvedStatus : task.status === 'attempted' ? copy.attemptedStatus : copy.openStatus}</span>
                            <ArenaIcon name="arrow" className="h-4 w-4 text-[#a1afc1] dark:text-[#b6c6da]" />
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}

function Leaderboard({ rows, copy }) {
    return (
        <section className="overflow-hidden rounded-2xl border border-[#dfe7f3] dark:border-[#2d405b] bg-white dark:bg-[#142238]">
            <div className="flex items-center justify-between border-b border-[#e3eaf5] dark:border-[#2d405b] px-5 py-4"><div><h2 className="font-bold text-[#142d55] dark:text-[#e8eef9]">{copy.rating}</h2><p className="mt-1 text-xs text-[#8795a9] dark:text-[#a4b6cf]">{copy.realResults}</p></div><ArenaIcon name="ranking" className="h-5 w-5 text-[#355da8] dark:text-[#a9c7ff]" /></div>
            {rows.length === 0 ? <p className="px-5 py-8 text-center text-sm text-[#7184a0] dark:text-[#aebfd6]">{copy.noResults}</p> : <div className="divide-y divide-[#edf1f7]">{rows.map((row) => (
                <div key={row.user_id} className={`grid grid-cols-[30px_1fr_auto] items-center gap-3 px-5 py-3.5 ${row.is_current ? 'bg-[#edf3ff] dark:bg-[#203858]' : ''}`}>
                    <span className={`font-mono text-xs font-bold ${row.rank <= 3 ? 'text-[#b1830c] dark:text-[#f7d77b]' : 'text-[#8795a9] dark:text-[#a4b6cf]'}`}>{row.rank}</span>
                    <div className="min-w-0"><p className={`truncate text-sm font-bold ${row.is_current ? 'text-[#234d8f] dark:text-[#a9c7ff]' : 'text-[#314765] dark:text-[#d2dff1]'}`}>{row.is_current ? copy.you : row.name}</p><p className="mt-0.5 text-[11px] text-[#8795a9] dark:text-[#a4b6cf]">{row.solved} {copy.problems} · {row.score} {copy.points}</p></div>
                    <span className="font-mono text-xs font-semibold text-[#7184a0] dark:text-[#aebfd6]">{row.penalty_minutes} {copy.minutes}</span>
                </div>
            ))}</div>}
        </section>
    );
}

export default function Dashboard({ competition, tasks, leaderboard, stats }) {
    const user = usePage().props.auth.user;
    const { locale } = useTranslation();
    const firstName = user.name?.split(' ')[0] ?? '';
    const copy = {
        ru: { title: 'Кабинет участника', noCompetition: 'Вы пока не участвуете в соревнованиях', noCompetitionText: 'Откройте список опубликованных турниров и зарегистрируйтесь.', competitions: 'Открыть соревнования', live: 'Соревнование идёт', upcoming: 'До начала соревнования', ended: 'Соревнование завершено', hello: 'Вперёд', progress: 'Ваши данные рассчитаны по реальным посылкам этого соревнования.', untilEnd: 'До конца', untilStart: 'До начала', continue: 'Открыть соревнование', position: 'Текущая позиция', place: 'место в рейтинге', solvedProblems: 'Решено задач', ofProblems: 'из задач соревнования', earned: 'Набрано баллов', realSubmissions: 'по проверенным посылкам', penalty: 'Штрафное время', minutesRating: 'минут в рейтинге', roundProblems: 'Задачи раунда', solved: 'Решено', noProblems: 'В соревновании нет задач.', problemsAfterStart: 'Задачи появятся после начала соревнования.', points: 'баллов', attempts: 'попыток', solvedStatus: 'Решено', attemptedStatus: 'Попытка', openStatus: 'Открыть', rating: 'Рейтинг', realResults: 'По результатам проверенных посылок', noResults: 'Результатов пока нет.', you: 'Вы', problems: 'задач', minutes: 'мин' },
        kk: { title: 'Қатысушы кабинеті', noCompetition: 'Сіз әзірге жарыстарға қатыспайсыз', noCompetitionText: 'Жарияланған турнирлер тізімін ашып, тіркеліңіз.', competitions: 'Жарыстарды ашу', live: 'Жарыс өтіп жатыр', upcoming: 'Жарыстың басталуына дейін', ended: 'Жарыс аяқталды', hello: 'Алға', progress: 'Деректер осы жарыстағы нақты жіберілімдер бойынша есептелді.', untilEnd: 'Аяқталуына дейін', untilStart: 'Басталуына дейін', continue: 'Жарысты ашу', position: 'Ағымдағы орын', place: 'рейтингтегі орын', solvedProblems: 'Шешілген есептер', ofProblems: 'жарыс есептерінен', earned: 'Жиналған ұпай', realSubmissions: 'тексерілген жіберілімдер бойынша', penalty: 'Айып уақыты', minutesRating: 'рейтинг минуттары', roundProblems: 'Раунд есептері', solved: 'Шешілді', noProblems: 'Жарыста есептер жоқ.', problemsAfterStart: 'Есептер жарыс басталғаннан кейін ашылады.', points: 'ұпай', attempts: 'әрекет', solvedStatus: 'Шешілді', attemptedStatus: 'Әрекет', openStatus: 'Ашу', rating: 'Рейтинг', realResults: 'Тексерілген жіберілімдер нәтижесі бойынша', noResults: 'Нәтижелер әзірге жоқ.', you: 'Сіз', problems: 'есеп', minutes: 'мин' },
        en: { title: 'Participant dashboard', noCompetition: 'You are not participating in a competition yet', noCompetitionText: 'Open the published competitions and register.', competitions: 'Open competitions', live: 'Competition in progress', upcoming: 'Competition has not started', ended: 'Competition finished', hello: 'Keep going', progress: 'Your data is calculated from real submissions in this competition.', untilEnd: 'Time remaining', untilStart: 'Starts in', continue: 'Open competition', position: 'Current position', place: 'place in ranking', solvedProblems: 'Problems solved', ofProblems: 'of competition problems', earned: 'Points earned', realSubmissions: 'from judged submissions', penalty: 'Penalty time', minutesRating: 'ranking minutes', roundProblems: 'Round problems', solved: 'Solved', noProblems: 'This competition has no problems.', problemsAfterStart: 'Problems will appear after the competition starts.', points: 'points', attempts: 'attempts', solvedStatus: 'Solved', attemptedStatus: 'Attempted', openStatus: 'Open', rating: 'Leaderboard', realResults: 'Based on judged submissions', noResults: 'No results yet.', you: 'You', problems: 'problems', minutes: 'min' },
    }[locale];

    if (!competition) {
        return <AuthenticatedLayout><Head title={copy.title} /><div className="mx-auto max-w-4xl px-4 py-16 sm:px-6"><section className="rounded-3xl border border-dashed border-[#bdcbe0] dark:border-[#415a78] bg-white dark:bg-[#142238] px-6 py-16 text-center"><ArenaIcon name="trophy" className="mx-auto h-12 w-12 text-[#355da8] dark:text-[#a9c7ff]" /><h1 className="mt-5 text-2xl font-black text-[#142d55] dark:text-[#e8eef9]">{copy.noCompetition}</h1><p className="mt-3 text-sm text-[#7184a0] dark:text-[#aebfd6]">{copy.noCompetitionText}</p><Link href={route('competitions.index')} className="mt-6 inline-flex rounded-xl bg-[#355da8] px-5 py-3 text-sm font-black text-white">{copy.competitions}</Link></section></div></AuthenticatedLayout>;
    }

    const stateLabel = competition.has_ended ? copy.ended : competition.has_started ? copy.live : copy.upcoming;

    return (
        <AuthenticatedLayout>
            <Head title={copy.title} />
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <section className="relative overflow-hidden rounded-[1.75rem] bg-[#193f7d] px-6 py-8 text-white sm:px-8 lg:px-10">
                    <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:22px_22px]" />
                    <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"><div><div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-[#ffd83d]"><span className="h-2 w-2 rounded-full bg-[#53d59b]" />{stateLabel}</div><h1 className="mt-5 text-3xl font-black sm:text-4xl">{copy.hello}, {firstName}!</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#d8e3f5]">{competition.title}. {copy.progress}</p></div><div className="flex flex-col gap-3 sm:flex-row sm:items-center">{!competition.has_ended && <Countdown competition={competition} copy={copy} />}<Link href={route('competitions.show', competition.id)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ffd83d] px-5 py-3.5 text-sm font-bold text-[#10264f]">{copy.continue}<ArenaIcon name="arrow" /></Link></div></div>
                </section>

                <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard icon="trophy" label={copy.position} value={stats.rank ? `#${stats.rank}` : '—'} helper={copy.place} accent />
                    <StatCard icon="check" label={copy.solvedProblems} value={`${stats.solved} / ${competition.problems_count}`} helper={copy.ofProblems} />
                    <StatCard icon="bolt" label={copy.earned} value={stats.score} helper={copy.realSubmissions} />
                    <StatCard icon="clock" label={copy.penalty} value={stats.penalty_minutes} helper={copy.minutesRating} />
                </section>

                <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_340px]"><TasksTable competition={competition} tasks={tasks} stats={stats} copy={copy} /><Leaderboard rows={leaderboard} copy={copy} /></div>
            </div>
        </AuthenticatedLayout>
    );
}
