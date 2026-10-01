import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'rounded-xl border-[#ccd7e8] dark:border-[#3a506e] bg-white dark:bg-[#142238] px-4 py-3 text-[#142d55] dark:text-[#e8eef9] shadow-sm placeholder:text-[#9aa8ba] dark:placeholder:text-[#94a9c4] focus:border-[#355da8] dark:focus:border-[#91b8ff] focus:ring-[#355da8] dark:focus:ring-[#91b8ff] ' +
                className
            }
            ref={localRef}
        />
    );
});
