import ApplicationLogo from '@/Components/ApplicationLogo';
import ArenaIcon from '@/Components/ArenaIcon';
import Dropdown from '@/Components/Dropdown';
import LocaleSwitcher from '@/Components/LocaleSwitcher';
import { useTranslation } from '@/lib/i18n';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

function NavigationLink({ item, mobile = false }) {
    const active = route().current(item.routeName);

    return (
        <Link
            href={route(item.routeName)}
            className={
                mobile
                    ? `rounded-xl px-4 py-3 text-sm font-semibold ${active ? 'bg-[#edf3ff] text-[#355da8]' : 'text-[#667892] hover:bg-[#f3f6fb]'}`
                    : `inline-flex h-full items-center border-b-2 px-1 text-sm font-semibold transition ${active ? 'border-[#355da8] text-[#234d8f]' : 'border-transparent text-[#7184a0] hover:text-[#234d8f]'}`
            }
        >
            {item.label}
        </Link>
    );
}

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { t } = useTranslation();
    const navigation = user.is_admin
        ? [
              { label: t('Админ-панель'), routeName: 'admin.dashboard' },
              { label: t('Соревнования'), routeName: 'competitions.index' },
              { label: t('Кабинет участника'), routeName: 'dashboard' },
              { label: t('Профиль'), routeName: 'profile.edit' },
          ]
        : [
              { label: t('Обзор'), routeName: 'dashboard' },
              { label: t('Соревнования'), routeName: 'competitions.index' },
              { label: t('Профиль'), routeName: 'profile.edit' },
          ];
    const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col bg-[#f3f6fb] text-[#142d55]">
            <nav className="sticky top-0 z-40 border-b border-[#dfe7f3] bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
                    <div className="flex h-full min-w-0 items-center gap-8">
                        <Link href={route('home')} className="flex shrink-0 items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3ff]">
                                <ApplicationLogo variant="compact" className="h-8 w-8" />
                            </span>
                            <div className="hidden sm:block">
                                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8795a9]">ATU Programming</p>
                                <p className="text-base font-black leading-5 text-[#173563]">Code Arena</p>
                            </div>
                        </Link>

                        <div className="hidden h-full items-center gap-7 md:flex">
                            {navigation.map((item) => (
                                <NavigationLink key={item.routeName} item={item} />
                            ))}
                        </div>
                    </div>

                    <div className="hidden items-center gap-3 sm:flex">
                        <LocaleSwitcher compact />
                        <span className="flex items-center gap-2 rounded-full bg-[#e8f8f1] px-3 py-2 text-xs font-bold text-[#16845a]">
                            <span className="h-2 w-2 rounded-full bg-[#32b67a]" />
                            {t('Система онлайн')}
                        </span>

                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center gap-3 rounded-xl border border-[#dfe7f3] bg-white px-3 py-2 text-left transition hover:border-[#b8c9e4]">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#355da8] text-xs font-black uppercase text-white">
                                        {user.name?.charAt(0)}
                                    </span>
                                    <span className="hidden max-w-36 truncate text-sm font-bold text-[#314765] lg:block">{user.name}</span>
                                    <svg className="h-4 w-4 text-[#8795a9]" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <Dropdown.Link href={route('profile.edit')}>{t('Профиль')}</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">{t('Выйти')}</Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileNavigationOpen((open) => !open)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dfe7f3] text-[#355da8] sm:hidden"
                        aria-label="Открыть меню"
                    >
                        <span className="text-xl leading-none">{mobileNavigationOpen ? '×' : '≡'}</span>
                    </button>
                </div>

                {mobileNavigationOpen && (
                    <div className="grid gap-1 border-t border-[#e3eaf5] bg-white p-4 sm:hidden">
                        {navigation.map((item) => (
                            <NavigationLink key={item.routeName} item={item} mobile />
                        ))}
                        <Link href={route('logout')} method="post" as="button" className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50">
                            {t('Выйти')}
                        </Link>
                    </div>
                )}
            </nav>

            {header && (
                <header className="border-b border-[#dfe7f3] bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main className="flex-1">{children}</main>

            <footer className="shrink-0 border-t border-[#dfe7f3] bg-white">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-[#8795a9] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <p>ATU Code Arena · {t('Платформа соревнований по программированию')}</p>
                    <span className="flex items-center gap-2">
                        <ArenaIcon name="shield" className="h-4 w-4" />
                        {t('Честная игра и автоматическая проверка')}
                    </span>
                </div>
            </footer>
        </div>
    );
}
