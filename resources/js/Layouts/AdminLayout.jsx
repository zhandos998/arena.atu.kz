import ApplicationLogo from '@/Components/ApplicationLogo';
import ArenaIcon from '@/Components/ArenaIcon';
import LocaleSwitcher from '@/Components/LocaleSwitcher';
import { useTranslation } from '@/lib/i18n';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const navigation = [
    { label: 'Обзор', icon: 'ranking', routeName: 'admin.dashboard' },
    {
        label: 'Соревнования',
        icon: 'trophy',
        routeName: 'admin.competitions.index',
        activeRoutes: ['admin.competitions.index', 'admin.competitions.create', 'admin.competitions.show'],
    },
    {
        label: 'Задачи',
        icon: 'code',
        routeName: 'admin.problems.index',
        activeRoutes: ['admin.problems.*', 'admin.competitions.problems.create', 'admin.competitions.problems.show', 'admin.competitions.problems.edit'],
    },
    { label: 'Тесты и проверка', icon: 'shield', routeName: 'admin.tests.index', activeRoutes: ['admin.tests.*', 'admin.competitions.problems.tests.*'] },
    { label: 'Посылки', icon: 'bolt', routeName: 'admin.submissions.index', activeRoutes: ['admin.submissions.*'] },
    { label: 'Участники', icon: 'users', hash: '#participants' },
];

function NavigationItem({ item, onNavigate }) {
    const { t } = useTranslation();
    const active = item.activeRoutes
        ? item.activeRoutes.some((routeName) => route().current(routeName))
        : item.routeName
            ? route().current(item.routeName)
            : false;
    const href = item.routeName ? route(item.routeName) : `${route('admin.dashboard')}${item.hash}`;
    const className = active
        ? 'flex items-center gap-3 rounded-xl bg-white/10 px-3 py-3 text-sm font-bold text-white ring-1 ring-white/10'
        : 'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#b9c9e2] transition hover:bg-white/[0.07] hover:text-white';
    const content = (
        <>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.07]">
                <ArenaIcon name={item.icon} className="h-[18px] w-[18px]" />
            </span>
            <span>{t(item.label)}</span>
        </>
    );

    return (
        <Link href={href} className={className} onClick={onNavigate}>
            {content}
        </Link>
    );
}

function Sidebar({ user, onNavigate }) {
    const { t } = useTranslation();
    return (
        <div className="flex h-full flex-col bg-[#102b58] text-white">
            <div className="border-b border-white/10 px-5 py-5">
                <Link href={route('home')} className="flex items-center gap-3" onClick={onNavigate}>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white">
                        <ApplicationLogo variant="compact" className="h-8 w-8" />
                    </span>
                    <span className="min-w-0">
                        <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#8fa8ce]">ATU Programming</span>
                        <span className="block text-lg font-black leading-6">Code Arena</span>
                    </span>
                </Link>
            </div>

            <div className="px-5 pb-3 pt-5">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#ffd83d] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#10264f]">
                    <ArenaIcon name="shield" className="h-3.5 w-3.5" />
                    {t('Администратор')}
                </span>
            </div>

            <nav className="grid flex-1 content-start gap-1 overflow-y-auto px-3 py-3" aria-label="Навигация администратора">
                {navigation.map((item) => (
                    <NavigationItem key={item.label} item={item} onNavigate={onNavigate} />
                ))}
            </nav>

            <div className="border-t border-white/10 p-4">
                <div className="flex items-center gap-3 rounded-xl bg-white/[0.06] p-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ffd83d] text-sm font-black uppercase text-[#10264f]">
                        {user.name?.charAt(0)}
                    </span>
                    <span className="min-w-0">
                        <span className="block truncate text-sm font-bold text-white">{user.name}</span>
                        <span className="block truncate text-[11px] text-[#8fa8ce]">{user.email}</span>
                    </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                    <Link
                        href={route('dashboard')}
                        className="rounded-lg border border-white/10 px-3 py-2 text-center text-xs font-semibold text-[#b9c9e2] transition hover:bg-white/[0.07] hover:text-white"
                        onClick={onNavigate}
                    >
                        {t('Кабинет')}
                    </Link>
                    <Link
                        href={route('profile.edit')}
                        className="rounded-lg border border-white/10 px-3 py-2 text-center text-xs font-semibold text-[#b9c9e2] transition hover:bg-white/[0.07] hover:text-white"
                        onClick={onNavigate}
                    >
                        {t('Профиль')}
                    </Link>
                </div>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="mt-2 w-full rounded-lg px-3 py-2 text-center text-xs font-semibold text-[#f3aeb5] transition hover:bg-red-500/10 hover:text-white"
                >
                    {t('Выйти из системы')}
                </Link>
            </div>
        </div>
    );
}

export default function AdminLayout({ children, title = 'Панель администратора', subtitle = 'Управление соревнованиями АТУ' }) {
    const user = usePage().props.auth.user;
    const { t } = useTranslation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#f3f6fb] text-[#142d55]">
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">
                <Sidebar user={user} />
            </aside>

            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 bg-[#0b1e3d]/60 backdrop-blur-sm"
                        aria-label={t('Закрыть меню')}
                        onClick={() => setSidebarOpen(false)}
                    />
                    <aside className="relative h-full w-[min(18rem,calc(100vw-3rem))] shadow-2xl">
                        <Sidebar user={user} onNavigate={() => setSidebarOpen(false)} />
                    </aside>
                </div>
            )}

            <div className="lg:pl-72">
                <header className="sticky top-0 z-30 border-b border-[#dfe7f3] bg-white/95 backdrop-blur">
                    <div className="flex h-[72px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                        <div className="flex min-w-0 items-center gap-3">
                            <button
                                type="button"
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#dfe7f3] text-xl text-[#355da8] lg:hidden"
                                aria-label={t('Открыть меню')}
                                aria-expanded={sidebarOpen}
                                onClick={() => setSidebarOpen(true)}
                            >
                                ≡
                            </button>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-black text-[#173563] sm:text-base">{t(title)}</p>
                                <p className="hidden text-xs text-[#8795a9] sm:block">{t(subtitle)}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <LocaleSwitcher compact />
                            <span className="hidden items-center gap-2 rounded-full bg-[#e8f8f1] px-3 py-2 text-xs font-bold text-[#16845a] sm:flex">
                                <span className="h-2 w-2 rounded-full bg-[#32b67a]" />
                                {t('Система онлайн')}
                            </span>
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#355da8] text-xs font-black uppercase text-white lg:hidden">
                                {user.name?.charAt(0)}
                            </span>
                        </div>
                    </div>
                </header>

                <main>{children}</main>
            </div>
        </div>
    );
}
