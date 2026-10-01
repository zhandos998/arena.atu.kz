import { router, usePage } from '@inertiajs/react';

export default function LocaleSwitcher({ dark = false, compact = false }) {
    const { locale = 'ru', locales = [] } = usePage().props;

    const changeLocale = (value) => {
        if (value === locale) return;

        router.post(route('locale.update'), { locale: value }, {
            preserveScroll: true,
            preserveState: false,
        });
    };

    return (
        <div className={`inline-flex rounded-xl border p-1 ${dark ? 'border-white/15 bg-white/[0.06]' : 'border-[#dfe7f3] dark:border-[#2d405b] bg-[#f7f9fd] dark:bg-[#17263e]'}`} aria-label="Language selector">
            {locales.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    onClick={() => changeLocale(option.value)}
                    className={`${compact ? 'px-2 py-1 text-[9px]' : 'px-2.5 py-1.5 text-[10px]'} rounded-lg font-black transition ${locale === option.value ? 'bg-[#ffd83d] text-[#10264f] shadow-sm' : dark ? 'text-[#b9c9e2] hover:text-white' : 'text-[#7184a0] dark:text-[#aebfd6] hover:text-[#355da8] dark:hover:text-[#a9c7ff]'}`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}
