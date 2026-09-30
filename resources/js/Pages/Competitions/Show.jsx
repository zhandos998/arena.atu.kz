import ArenaIcon from '@/Components/ArenaIcon';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/lib/i18n';
import { Head, Link, usePage } from '@inertiajs/react';

function formatDate(value, locale) {
    return new Intl.DateTimeFormat({ ru: 'ru-RU', kk: 'kk-KZ', en: 'en-US' }[locale], {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
}

export default function Show({ competition }) {
    const { flash } = usePage().props;
    const { locale } = useTranslation();
    const copy = {
        ru: { all: 'Все соревнования', registered: 'Вы зарегистрированы', participants: 'Участников', register: 'Зарегистрироваться', unregister: 'Отменить регистрацию', unavailable: 'Самостоятельная регистрация недоступна.', rules: 'Правила', problems: 'Задачи', registerHint: 'Зарегистрируйтесь, чтобы получить доступ к задачам после старта.', opens: 'Задачи откроются', empty: 'В соревновании пока нет задач.', points: 'баллов', solve: 'Решать', open: 'Открытая регистрация', closed: 'Закрытая регистрация' },
        kk: { all: 'Барлық жарыстар', registered: 'Сіз тіркелдіңіз', participants: 'Қатысушылар', register: 'Тіркелу', unregister: 'Тіркелуден бас тарту', unavailable: 'Өздігінен тіркелу қолжетімсіз.', rules: 'Ережелер', problems: 'Есептер', registerHint: 'Жарыс басталғаннан кейін есептерге қол жеткізу үшін тіркеліңіз.', opens: 'Есептер ашылады:', empty: 'Жарыста әзірге есептер жоқ.', points: 'ұпай', solve: 'Шешу', open: 'Ашық тіркелу', closed: 'Жабық тіркелу' },
        en: { all: 'All competitions', registered: 'You are registered', participants: 'Participants', register: 'Register', unregister: 'Cancel registration', unavailable: 'Self-registration is unavailable.', rules: 'Rules', problems: 'Problems', registerHint: 'Register to access the problems after the contest starts.', opens: 'Problems open on', empty: 'This competition has no problems yet.', points: 'points', solve: 'Solve', open: 'Open registration', closed: 'Closed registration' },
    }[locale];

    return (
        <AuthenticatedLayout>
            <Head title={competition.title} />

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                {flash?.success && (
                    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#bfe9d5] bg-[#e8f8f1] px-4 py-3 text-sm font-bold text-[#16845a]">
                        <ArenaIcon name="check" className="h-5 w-5" />
                        {flash.success}
                    </div>
                )}

                <Link href={route('competitions.index')} className="text-sm font-black text-[#355da8] hover:text-[#23457e]">← {copy.all}</Link>

                <section className="relative mt-5 overflow-hidden rounded-[1.75rem] bg-[#193f7d] px-6 py-8 text-white sm:px-8">
                    <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:40px_40px]" />
                    <div className="relative grid gap-7 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
                        <div>
                            <div className="flex flex-wrap gap-2">
                                <span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider">{copy[competition.registration_type]}</span>
                                {competition.is_registered && <span className="rounded-full bg-[#ffd83d] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#10264f]">{copy.registered}</span>}
                            </div>
                            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">{competition.title}</h1>
                            <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-6 text-[#d8e3f5]">{competition.description}</p>
                            <p className="mt-5 text-xs font-bold text-[#aac0df]">{formatDate(competition.starts_at, locale)} — {formatDate(competition.ends_at, locale)}</p>
                        </div>

                        <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                            <p className="text-xs font-bold text-[#aac0df]">{copy.participants}: {competition.registered_users_count}</p>
                            {competition.can_register && (
                                <Link href={route('competitions.registration.store', competition.id)} method="post" as="button" className="mt-3 w-full rounded-xl bg-[#ffd83d] px-4 py-3 text-sm font-black text-[#10264f] hover:bg-[#ffe36c]">
                                    {copy.register}
                                </Link>
                            )}
                            {competition.can_unregister && (
                                <Link href={route('competitions.registration.destroy', competition.id)} method="delete" as="button" className="mt-3 w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-black text-white hover:bg-white/10">
                                    {copy.unregister}
                                </Link>
                            )}
                            {!competition.is_registered && !competition.can_register && (
                                <p className="mt-3 text-sm leading-5 text-[#d8e3f5]">{copy.unavailable}</p>
                            )}
                        </div>
                    </div>
                </section>

                <div className="mt-6 flex flex-wrap gap-2">
                    {competition.language_labels.map((language) => <span key={language} className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-[#355da8] shadow-sm">{language}</span>)}
                </div>

                {competition.rules && (
                    <section className="mt-8 rounded-2xl border border-[#dfe7f3] bg-white p-6">
                        <h2 className="text-xl font-black text-[#142d55]">{copy.rules}</h2>
                        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#667892]">{competition.rules}</p>
                    </section>
                )}

                <section className="mt-8">
                    <h2 className="text-2xl font-black text-[#142d55]">{copy.problems}</h2>

                    {!competition.is_registered ? (
                        <div className="mt-4 rounded-2xl border border-dashed border-[#bdcbe0] bg-white px-6 py-10 text-center text-sm text-[#7184a0]">{copy.registerHint}</div>
                    ) : !competition.has_started ? (
                        <div className="mt-4 rounded-2xl border border-dashed border-[#bdcbe0] bg-white px-6 py-10 text-center text-sm text-[#7184a0]">{copy.opens} {formatDate(competition.starts_at, locale)}.</div>
                    ) : competition.problems.length === 0 ? (
                        <div className="mt-4 rounded-2xl border border-dashed border-[#bdcbe0] bg-white px-6 py-10 text-center text-sm text-[#7184a0]">{copy.empty}</div>
                    ) : (
                        <div className="mt-4 overflow-hidden rounded-2xl border border-[#dfe7f3] bg-white">
                            {competition.problems.map((problem) => (
                                <article key={problem.id} className="grid gap-3 border-b border-[#edf1f7] px-5 py-4 last:border-b-0 sm:grid-cols-[56px_minmax(0,1fr)_auto] sm:items-center">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#355da8] font-mono text-sm font-black text-white">{problem.code}</span>
                                    <div>
                                        <Link href={route('competitions.problems.show', [competition.id, problem.id])} className="text-sm font-black text-[#314765] transition hover:text-[#355da8]">
                                            {problem.title}
                                        </Link>
                                        <p className="mt-1 text-xs text-[#8795a9]">{problem.time_limit_ms} мс · {problem.memory_limit_mb} МБ</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-black text-[#355da8]">{problem.score} {copy.points}</span>
                                        <Link href={route('competitions.problems.show', [competition.id, problem.id])} className="rounded-lg bg-[#edf3ff] px-3 py-2 text-xs font-black text-[#355da8]">{copy.solve}</Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
