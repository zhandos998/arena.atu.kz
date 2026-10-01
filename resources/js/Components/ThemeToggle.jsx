import ArenaIcon from '@/Components/ArenaIcon';
import { useTranslation } from '@/lib/i18n';
import { useState } from 'react';

const labels = {
    ru: { light: 'Включить светлую тему', dark: 'Включить тёмную тему' },
    kk: { light: 'Ашық тақырыпты қосу', dark: 'Қараңғы тақырыпты қосу' },
    en: { light: 'Switch to light mode', dark: 'Switch to dark mode' },
};

export default function ThemeToggle({ onDarkSurface = false }) {
    const { locale } = useTranslation();
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
    const label = (labels[locale] ?? labels.ru)[isDark ? 'light' : 'dark'];

    const toggleTheme = () => {
        const nextIsDark = !isDark;

        document.documentElement.classList.toggle('dark', nextIsDark);
        document.documentElement.style.colorScheme = nextIsDark ? 'dark' : 'light';
        try {
            localStorage.setItem('atu-color-theme', nextIsDark ? 'dark' : 'light');
        } catch {
            // The theme still changes when browser storage is unavailable.
        }
        setIsDark(nextIsDark);
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={label}
            title={label}
            aria-pressed={isDark}
            className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#355da8] dark:focus-visible:ring-[#91b8ff] ${
                onDarkSurface
                    ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                    : 'border-[#dfe7f3] bg-white text-[#355da8] hover:bg-[#edf3ff] dark:border-[#344761] dark:bg-[#17263d] dark:text-[#fbd875] dark:hover:bg-[#213651]'
            }`}
        >
            <ArenaIcon name={isDark ? 'sun' : 'moon'} className="h-4 w-4" />
        </button>
    );
}
