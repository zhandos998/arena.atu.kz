export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-semibold text-[#314765] dark:text-[#d2dff1] ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
