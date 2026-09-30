const logoSources = {
    compact: '/atu-compact.png',
    wordmark: '/atu-logo.png',
};

export default function ApplicationLogo({
    variant = 'wordmark',
    className = '',
    alt = 'Алматинский технологический университет',
    ...props
}) {
    return (
        <img
            {...props}
            src={logoSources[variant] ?? logoSources.wordmark}
            alt={alt}
            className={['object-contain', className].filter(Boolean).join(' ')}
        />
    );
}
