import { twMerge } from "tailwind-merge"

const RadioButton = ({name, value, selected, children, ...props}) => {
    const selectedStyle = selected === value && "bg-blue-500"
    return (
        <label
            className={twMerge(`
                        flex
                        gap-2
                        p-5
                        dark:hover:bg-neutral-700
                        rounded-xl
                        transition
                        hover:cursor-pointer`, 
                        selectedStyle
                    )}
        >
            <input
                type="radio"
                name={name}
                value={value}
                className="hidden"
                {...props}
            />
            {children}
        </label>
    )
}

export default RadioButton