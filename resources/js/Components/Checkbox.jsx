export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:border-slate-600 dark:bg-[#142238] dark:text-[#91b8ff] dark:focus:ring-[#91b8ff] ' +
                className
            }
        />
    );
}
