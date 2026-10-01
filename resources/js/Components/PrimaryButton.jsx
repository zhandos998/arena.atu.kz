export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-xl border border-transparent bg-[#355da8] px-5 py-3 text-sm font-bold text-white shadow-sm transition duration-150 ease-in-out hover:bg-[#294f91] focus:outline-none focus:ring-2 focus:ring-[#355da8] dark:focus:ring-[#91b8ff] focus:ring-offset-2 dark:focus:ring-offset-[#0c1628] active:bg-[#23457e] ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
