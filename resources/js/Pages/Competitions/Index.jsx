import ArenaIcon from '@/Components/ArenaIcon';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/lib/i18n';
import { Head, Link } from '@inertiajs/react';

function formatDate(value, locale) {
    return new Intl.DateTimeFormat({ ru: 'ru-RU', kk: 'kk-KZ', en: 'en-US' }[locale], {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
}

function CompetitionCard({ competition, copy, locale }) {
    const now = new Date();
    const startsAt = new Date(competition.starts_at);
    const endsAt = new Date(competition.ends_at);
    const state = now < startsAt ? copy.registration : now <= endsAt ? copy.running : copy.finished;

    return (
        <article className="flex flex-col rounded-2xl border border-[#dfe7f3] bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${now >= startsAt && now <= endsAt ? 'bg-[#e8f8f1] text-[#16845a]' : 'bg-[#edf3ff] text-[#355da8]'}`}>
                    {state}
                </span>
                {competition.is_registered && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#fff7d7] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#7b5c08]">
                        <ArenaIcon name="check" className="h-3.5 w-3.5" />
                        {copy.participating}
                    </span>
                )}
            </div>

            <h2 className="mt-5 text-xl font-black text-[#142d55]">{competition.title}</h2>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#7184a0]">
                {competition.description || copy.defaultDescription}
            </p>

            <dl className="mt-5 grid gap-3 border-t border-[#edf1f7] pt-4 text-xs text-[#667892]">
                <div className="flex items-start gap-3">
                    <ArenaIcon name="calendar" className="mt-0.5 h-4 w-4 shrink-0 text-[#355da8]" />
                    <span className="font-bold leading-5">{formatDate(competition.starts_at, locale)} — {formatDate(competition.ends_at, locale)}</span>
                </div>
                <div className="flex items-center gap-3">
                    <ArenaIcon name="users" className="h-4 w-4 shrink-0 text-[#355da8]" />
                    <span className="font-bold">{competition.registered_users_count} {copy.participants} · {competition.problems_count} {copy.problems}</span>
                </div>
            </dl>

            <div className="mt-4 flex flex-wrap gap-2">
                {competition.language_labels.map((language) => (
                    <span key={language} className="rounded-lg bg-[#f3f6fb] px-2.5 py-1.5 text-[11px] font-bold text-[#667892]">{language}</span>
                ))}
            </div>

            <Link
                href={route('competitions.show', competition.id)}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#355da8] px-4 py-3 text-sm font-black text-white transition hover:bg-[#294f91]"
            >
                {copy.open}
                <ArenaIcon name="arrow" className="h-4 w-4" />
            </Link>
        </article>
    );
}

export default function Index({ competitions }) {
    const { locale } = useTranslation();
    const copy = {
        ru: { title: 'Соревнования', description: 'Выберите опубликованный турнир, зарегистрируйтесь и решайте задачи после старта.', registration: 'Регистрация', running: 'Идёт сейчас', finished: 'Завершено', participating: 'Вы участвуете', defaultDescription: 'Соревнование по программированию для студентов АТУ.', participants: 'участников', problems: 'задач', open: 'Открыть соревнование', empty: 'Нет открытых соревнований', emptyText: 'Новые турниры появятся здесь после публикации администратором.' },
        kk: { title: 'Жарыстар', description: 'Жарияланған турнирді таңдап, тіркеліңіз және басталғаннан кейін есептерді шешіңіз.', registration: 'Тіркелу', running: 'Қазір өтуде', finished: 'Аяқталды', participating: 'Сіз қатысасыз', defaultDescription: 'АТУ студенттеріне арналған бағдарламалау жарысы.', participants: 'қатысушы', problems: 'есеп', open: 'Жарысты ашу', empty: 'Ашық жарыстар жоқ', emptyText: 'Жаңа турнирлер әкімші жариялағаннан кейін осында пайда болады.' },
        en: { title: 'Competitions', description: 'Choose a published contest, register, and solve problems after it starts.', registration: 'Registration', running: 'Live now', finished: 'Finished', participating: 'You are participating', defaultDescription: 'A programming competition for ATU students.', participants: 'participants', problems: 'problems', open: 'Open competition', empty: 'No open competitions', emptyText: 'New contests will appear here after an administrator publishes them.' },
    }[locale];
    return (
        <AuthenticatedLayout>
            <Head title={copy.title} />

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#355da8]">ATU Code Arena</p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-[#142d55]">{copy.title}</h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667892]">{copy.description}</p>
                </div>

                {competitions.data.length === 0 ? (
                    <div className="mt-8 rounded-2xl border border-dashed border-[#bdcbe0] bg-white px-6 py-14 text-center">
                        <ArenaIcon name="trophy" className="mx-auto h-10 w-10 text-[#355da8]" />
                        <h2 className="mt-4 text-xl font-black text-[#142d55]">{copy.empty}</h2>
                        <p className="mt-2 text-sm text-[#7184a0]">{copy.emptyText}</p>
                    </div>
                ) : (
                    <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {competitions.data.map((competition) => <CompetitionCard key={competition.id} competition={competition} copy={copy} locale={locale} />)}
                    </div>
                )}

                {competitions.links.length > 3 && (
                    <nav className="mt-8 flex flex-wrap justify-center gap-2" aria-label="Страницы соревнований">
                        {competitions.links.map((link) => link.url ? (
                            <Link
                                key={link.label}
                                href={link.url}
                                preserveScroll
                                className={`rounded-lg border px-3 py-2 text-xs font-bold ${link.active ? 'border-[#355da8] bg-[#355da8] text-white' : 'border-[#dfe7f3] bg-white text-[#667892]'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            <span key={link.label} className="rounded-lg border border-[#e6ebf3] bg-[#f7f9fc] px-3 py-2 text-xs font-bold text-[#b0bac8]" dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </nav>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
