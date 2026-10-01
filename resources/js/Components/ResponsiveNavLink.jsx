import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-700 focus:border-indigo-700 focus:bg-indigo-100 focus:text-indigo-800 dark:border-[#91b8ff] dark:bg-[#203858] dark:text-[#a9c7ff] dark:focus:border-[#91b8ff] dark:focus:bg-[#29446a] dark:focus:text-white'
                    : 'border-transparent text-gray-600 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-[#17273d] hover:text-gray-800 dark:hover:text-slate-100 focus:border-gray-300 dark:focus:border-slate-600 focus:bg-gray-50 dark:focus:bg-[#17273d] focus:text-gray-800 dark:focus:text-slate-100'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
