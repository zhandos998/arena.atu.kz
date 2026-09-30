import ApplicationLogo from '@/Components/ApplicationLogo';
import LocaleSwitcher from '@/Components/LocaleSwitcher';
import { useTranslation } from '@/lib/i18n';
import { Head, Link } from '@inertiajs/react';

const errors = {
    403: ['Доступ запрещён', 'У вас нет прав для просмотра этой страницы.'],
    404: ['Страница не найдена', 'Запрошенная страница не существует или была перемещена.'],
    419: ['Сессия завершена', 'Обновите страницу и повторите действие.'],
    429: ['Слишком много запросов', 'Подождите немного и повторите попытку.'],
    500: ['Ошибка сервера', 'Произошла внутренняя ошибка. Мы уже можем её диагностировать.'],
    503: ['Сервис временно недоступен', 'Попробуйте открыть страницу через несколько минут.'],
};

export default function Error({ status }) {
    const { t } = useTranslation();
    const [title, description] = errors[status] ?? errors[500];

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f3f6fb] px-4 py-12 text-[#142d55]">
            <Head title={`${status} — ${t(title)}`} />
            <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(#dfe7f3_1px,transparent_1px),linear-gradient(90deg,#dfe7f3_1px,transparent_1px)] [background-size:36px_36px]" />

            <section className="relative w-full max-w-xl rounded-[2rem] border border-[#dfe7f3] bg-white p-7 text-center shadow-xl shadow-[#355da8]/10 sm:p-10">
                <div className="flex items-center justify-between gap-4">
                    <Link href={route('home')} className="flex items-center gap-3 text-left">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf3ff]"><ApplicationLogo variant="compact" className="h-8 w-8" /></span>
                        <span><span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-[#8795a9]">ATU Programming</span><span className="block text-base font-black text-[#173563]">Code Arena</span></span>
                    </Link>
                    <LocaleSwitcher compact />
                </div>

                <div className="mx-auto mt-9 flex h-24 w-24 items-center justify-center rounded-3xl bg-[#193f7d] font-mono text-3xl font-black text-[#ffd83d]">{status}</div>
                <h1 className="mt-6 text-3xl font-black tracking-tight">{t(title)}</h1>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#667892]">{t(description)}</p>
                <p className="mt-3 text-xs text-[#9aa8ba]">{t('Если проблема повторяется, сообщите администратору код ошибки.')} ({status})</p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <button type="button" onClick={() => window.history.back()} className="rounded-xl border border-[#ccd7e8] px-5 py-3 text-sm font-black text-[#667892] transition hover:bg-[#f3f6fb]">← {t('Назад')}</button>
                    <Link href={route('home')} className="rounded-xl bg-[#355da8] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#355da8]/20 transition hover:bg-[#294f91]">{t('На главную')}</Link>
                </div>
            </section>
        </main>
    );
}
