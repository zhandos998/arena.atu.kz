import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

function verdictClass(verdict) {
    if (verdict === 'accepted') return 'bg-[#e8f8f1] text-[#16845a]';
    if (!verdict) return 'bg-[#edf3ff] text-[#355da8]';
    return 'bg-red-50 text-red-700';
}

export default function Index({ submissions, filters, verdicts, stats }) {
    const filter = (verdict) => router.get(route('admin.submissions.index'), verdict ? { verdict } : {}, { preserveState: true, replace: true });

    return (
        <AdminLayout title="Посылки" subtitle="Очередь и результаты проверки решений">
            <Head title="Посылки" />
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#355da8]">Judge queue</p><h1 className="mt-2 text-3xl font-black text-[#142d55]">Посылки участников</h1></div>
                    <select value={filters.verdict ?? ''} onChange={(event) => filter(event.target.value)} className="rounded-xl border-[#ccd7e8] bg-white px-4 py-3 text-sm font-bold text-[#314765] focus:border-[#355da8] focus:ring-[#355da8]"><option value="">Все вердикты</option>{verdicts.map((verdict) => <option key={verdict.value} value={verdict.value}>{verdict.label}</option>)}</select>
                </div>

                <section className="mt-7 grid gap-4 sm:grid-cols-3">
                    {[['Всего', stats.total], ['В очереди', stats.queued], ['Принято', stats.accepted]].map(([label, value]) => <div key={label} className="rounded-2xl border border-[#dfe7f3] bg-white p-5"><p className="text-xs text-[#8795a9]">{label}</p><p className="mt-2 text-3xl font-black text-[#142d55]">{value}</p></div>)}
                </section>

                <section className="mt-7 overflow-hidden rounded-2xl border border-[#dfe7f3] bg-white">
                    {submissions.data.length === 0 ? <div className="px-6 py-14 text-center text-sm text-[#7184a0]">Посылок пока нет.</div> : <div className="divide-y divide-[#edf1f7]">{submissions.data.map((submission) => (
                        <article key={submission.id} className="grid gap-3 p-5 lg:grid-cols-[80px_minmax(0,1fr)_180px_110px_120px_100px] lg:items-center">
                            <Link href={route('submissions.show', submission.id)} className="font-mono text-sm font-black text-[#355da8]">#{submission.id}</Link>
                            <div className="min-w-0"><p className="truncate text-sm font-black text-[#314765]">{submission.problem.code}. {submission.problem.title}</p><p className="mt-1 truncate text-xs text-[#8795a9]">{submission.competition.title} · {submission.user.name}</p></div>
                            <span className={`w-fit rounded-full px-3 py-1.5 text-[10px] font-black ${verdictClass(submission.verdict)}`}>{submission.verdict_label}</span>
                            <span className="text-xs font-bold text-[#667892]">{submission.language}</span>
                            <span className="text-xs font-bold text-[#667892]">{submission.passed_tests}/{submission.total_tests} тестов</span>
                            <span className="text-xs font-black text-[#355da8]">{submission.score} баллов</span>
                        </article>
                    ))}</div>}
                </section>

                {submissions.links.length > 3 && <nav className="mt-7 flex flex-wrap justify-center gap-2">{submissions.links.map((link) => link.url ? <Link key={link.label} href={link.url} className={`rounded-lg border px-3 py-2 text-xs font-bold ${link.active ? 'border-[#355da8] bg-[#355da8] text-white' : 'border-[#dfe7f3] bg-white text-[#667892]'}`} dangerouslySetInnerHTML={{ __html: link.label }} /> : <span key={link.label} className="rounded-lg border px-3 py-2 text-xs text-[#b0bac8]" dangerouslySetInnerHTML={{ __html: link.label }} />)}</nav>}
            </div>
        </AdminLayout>
    );
}
