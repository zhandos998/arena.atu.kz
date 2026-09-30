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
                'rounded-xl border-[#ccd7e8] bg-white px-4 py-3 text-[#142d55] shadow-sm placeholder:text-[#9aa8ba] focus:border-[#355da8] focus:ring-[#355da8] ' +
                className
            }
            ref={localRef}
        />
    );
});
