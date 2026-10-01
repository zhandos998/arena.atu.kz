const paths = {
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    bolt: <path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z" />,
    calendar: (
        <>
            <path d="M8 2v4m8-4v4M3 10h18" />
            <rect x="3" y="4" width="18" height="18" rx="3" />
        </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    clock: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </>
    ),
    code: <path d="m8 9-3 3 3 3m8-6 3 3-3 3m-2-9-4 12" />,
    flag: (
        <>
            <path d="M5 21V4" />
            <path d="M5 5c5-3 9 3 14 0v10c-5 3-9-3-14 0" />
        </>
    ),
    lock: (
        <>
            <rect x="5" y="10" width="14" height="11" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </>
    ),
    moon: <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />,
    medal: (
        <>
            <circle cx="12" cy="9" r="6" />
            <path d="m8 14-2 8 6-3 6 3-2-8" />
        </>
    ),
    play: <path d="m9 7 8 5-8 5V7Z" />,
    ranking: (
        <>
            <path d="M4 20V10h4v10M10 20V4h4v16m2 0v-7h4v7" />
            <path d="M2 20h20" />
        </>
    ),
    shield: (
        <>
            <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" />
            <path d="m9 12 2 2 4-5" />
        </>
    ),
    spark: <path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" />,
    sun: (
        <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
        </>
    ),
    terminal: (
        <>
            <rect x="3" y="4" width="18" height="16" rx="3" />
            <path d="m7 9 3 3-3 3m6 0h4" />
        </>
    ),
    trophy: (
        <>
            <path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" />
            <path d="M8 6H4v1a4 4 0 0 0 4 4m8-5h4v1a4 4 0 0 1-4 4m-4 1v5m-4 4h8m-6-4h4" />
        </>
    ),
    users: (
        <>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.9m-2-12a4 4 0 0 1 0 7.8" />
        </>
    ),
};

export default function ArenaIcon({ name, className = 'h-5 w-5' }) {
    return (
        <svg
            aria-hidden="true"
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {paths[name] ?? paths.spark}
        </svg>
    );
}
