import { twMerge } from "tailwind-merge"

const TextField = ({
    withLabel,
    type,
    id,
    displayedName,
    setState,
    onChange,
    name,
    wrapperClassName,
    fieldRef,
    children,
    className,
    ...props
}) => {
    if(withLabel == null) {
        withLabel = true
    }
    return (
        <div className={twMerge(wrapperClassName, "flex flex-col gap-2")}>
            {withLabel && <label htmlFor={id}>{displayedName + ":"}</label>}
            <input
                type={type || "text"}
                name={name}
                id={id}
                className={twMerge(`p-2
                    rounded-xl
                    border-2
                    border-black
                    dark:border-white
                    outline-0
                    focus:outline-2
                    focus:bg-neutral-200
                    dark:focus:bg-neutral-700
                    transition
                    flex-1`, className)}
                onChange={e => {
                    setState(e.target.value.trim())
                    if(typeof onChange !== "function") {
                        return
                    }
                    onChange(e)
                }}
                ref={fieldRef}
                {...props}
            />
            {children}
        </div>
    )
}

export default TextField