import ArenaIcon from '@/Components/ArenaIcon';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';

function formatDate(value) {
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
}

function CompetitionCard({ competition }) {
    const published = competition.status === 'published';
    const archived = competition.status === 'archived';

    return (
        <article className="rounded-2xl border border-[#dfe7f3] bg-white p-5 shadow-sm shadow-[#355da8]/[0.03]">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <span className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${published ? 'bg-[#e8f8f1] text-[#16845a]' : archived ? 'bg-[#edf0f5] text-[#667892]' : 'bg-[#fff7d7] text-[#8a6810]'}`}>
                    {competition.status_label}
                </span>
                <span className="text-xs font-semibold text-[#8795a9]">#{competition.id}</span>
            </div>

            <h2 className="mt-4 text-lg font-black text-[#142d55]">{competition.title}</h2>

            <dl className="mt-5 grid gap-3 border-t border-[#edf1f7] pt-4 text-xs">
                <div className="flex items-start gap-3">
                    <ArenaIcon name="calendar" className="mt-0.5 h-4 w-4 shrink-0 text-[#355da8]" />
                    <div>
                        <dt className="font-semibold text-[#8795a9]">Период проведения</dt>
                        <dd className="mt-1 font-bold leading-5 text-[#314765]">
                            {formatDate(competition.starts_at)} — {formatDate(competition.ends_at)}
                        </dd>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <ArenaIcon name="users" className="mt-0.5 h-4 w-4 shrink-0 text-[#355da8]" />
                    <div>
                        <dt className="font-semibold text-[#8795a9]">Доступ</dt>
                        <dd className="mt-1 font-bold text-[#314765]">{competition.registration_label}</dd>
                    </div>
                </div>
            </dl>

            <div className="mt-4 flex flex-wrap gap-2">
                {competition.language_labels.map((language) => (
                    <span key={language} className="rounded-lg bg-[#edf3ff] px-2.5 py-1.5 text-[11px] font-bold text-[#355da8]">
                        {language}
                    </span>
                ))}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#edf1f7] pt-4">
                <span className="text-xs font-bold text-[#7184a0]">
                    Задач: {competition.problems_count}
                </span>
                <Link
                    href={route('admin.competitions.show', competition.id)}
                    className="inline-flex items-center gap-2 text-sm font-black text-[#355da8] transition hover:text-[#23457e]"
                >
                    Управлять
                    <ArenaIcon name="arrow" className="h-4 w-4" />
                </Link>
            </div>
        </article>
    );
}

export default function Index({ competitions }) {
    const { flash } = usePage().props;

    return (
        <AdminLayout title="Соревнования" subtitle="Создание и управление турнирами">
            <Head title="Соревнования" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {flash?.success && (
                    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#bfe9d5] bg-[#e8f8f1] px-4 py-3 text-sm font-bold text-[#16845a]">
                        <ArenaIcon name="check" className="h-5 w-5 shrink-0" />
                        {flash.success}
                    </div>
                )}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#355da8]">Турниры АТУ</p>
                        <h1 className="mt-2 text-3xl font-black tracking-tight text-[#142d55]">Соревнования</h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667892]">
                            Настраивайте даты, формат регистрации и языки программирования.
                        </p>
                    </div>
                    <Link
                        href={route('admin.competitions.create')}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#355da8] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#355da8]/20 transition hover:bg-[#294f91]"
                    >
                        <span className="text-lg leading-none">+</span>
                        Создать соревнование
                    </Link>
                </div>

                {competitions.data.length === 0 ? (
                    <section className="mt-8 rounded-2xl border border-dashed border-[#bdcbe0] bg-white px-6 py-14 text-center">
                        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf3ff] text-[#355da8]">
                            <ArenaIcon name="trophy" className="h-7 w-7" />
                        </span>
                        <h2 className="mt-5 text-xl font-black text-[#142d55]">Пока нет соревнований</h2>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7184a0]">
                            Создайте первый турнир, а затем добавьте в него задачи и тесты.
                        </p>
                    </section>
                ) : (
                    <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {competitions.data.map((competition) => (
                            <CompetitionCard key={competition.id} competition={competition} />
                        ))}
                    </section>
                )}

                {competitions.links.length > 3 && (
                    <nav className="mt-8 flex flex-wrap justify-center gap-2" aria-label="Страницы соревнований">
                        {competitions.links.map((link) => (
                            link.url ? (
                                <Link
                                    key={link.label}
                                    href={link.url}
                                    preserveScroll
                                    className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${link.active ? 'border-[#355da8] bg-[#355da8] text-white' : 'border-[#dfe7f3] bg-white text-[#667892] hover:border-[#b8c9e4]'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span
                                    key={link.label}
                                    className="rounded-lg border border-[#e6ebf3] bg-[#f7f9fc] px-3 py-2 text-xs font-bold text-[#b0bac8]"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            )
                        ))}
                    </nav>
                )}
            </div>
        </AdminLayout>
    );
}
