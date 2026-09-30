import ApplicationLogo from '@/Components/ApplicationLogo';
import ArenaIcon from '@/Components/ArenaIcon';
import LocaleSwitcher from '@/Components/LocaleSwitcher';
import { useTranslation } from '@/lib/i18n';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    const { locale } = useTranslation();
    const content = {
        ru: ['Докажите свой уровень', 'на деле.', 'Одна площадка для участия в чемпионатах АТУ, отправки решений и отслеживания результатов.', 'задач', 'на решение', 'рейтинг'],
        kk: ['Деңгейіңізді дәлелдеңіз', 'іс жүзінде.', 'АТУ чемпионаттарына қатысуға, шешімдер жіберуге және нәтижелерді бақылауға арналған бірыңғай платформа.', 'есеп', 'шешуге', 'рейтинг'],
        en: ['Prove your skills', 'in practice.', 'One platform for ATU championships, solution submissions, and result tracking.', 'problems', 'to solve', 'ranking'],
    }[locale] ?? [];
    return (
        <div className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_0.95fr]">
            <aside className="relative hidden overflow-hidden bg-[#193f7d] p-12 text-white lg:flex lg:flex-col lg:justify-between">
                <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.9)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.9)_1px,transparent_1px)] [background-size:48px_48px]" />
                <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full border-[76px] border-[#ffd83d]/10" />

                <Link href={route('home')} className="relative inline-flex w-fit items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">
                        <ApplicationLogo variant="compact" className="h-9 w-9" />
                    </span>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">ATU Programming</p>
                        <p className="text-xl font-bold">Code Arena</p>
                    </div>
                </Link>

                <div className="relative max-w-xl py-12">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffd83d] text-[#10264f]">
                        <ArenaIcon name="code" className="h-7 w-7" />
                    </span>
                    <h1 className="mt-7 text-5xl font-black leading-[1.06] tracking-[-0.035em]">
                        {content[0]} <span className="text-[#ffd83d]">{content[1]}</span>
                    </h1>
                    <p className="mt-5 max-w-lg text-lg leading-8 text-[#d8e3f5]">
                        {content[2]}
                    </p>

                    <div className="mt-10 grid grid-cols-3 gap-3">
                        {[
                            ['8', content[3]],
                            ['4 ч', content[4]],
                            ['Live', content[5]],
                        ].map(([value, label]) => (
                            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur">
                                <p className="text-xl font-black text-[#ffd83d]">{value}</p>
                                <p className="mt-1 text-xs font-medium text-white/55">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative text-xs font-medium text-white/45">
                    Алматинский технологический университет · 2026
                </p>
            </aside>

            <main className="flex min-h-screen flex-col bg-[#f8fafd]">
                <div className="absolute right-5 top-5 z-10 hidden lg:block"><LocaleSwitcher /></div>
                <div className="flex items-center justify-between border-b border-[#e3eaf5] bg-white px-5 py-4 lg:hidden">
                    <Link href={route('home')}>
                        <ApplicationLogo className="h-9 w-auto max-w-[180px]" />
                    </Link>
                    <LocaleSwitcher compact />
                </div>

                <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
                    <div className="w-full max-w-md rounded-2xl border border-[#dfe7f3] bg-white p-6 shadow-xl shadow-[#244b88]/[0.08] sm:p-8">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
