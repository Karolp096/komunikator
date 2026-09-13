import { cva } from "class-variance-authority"
import { Link } from "react-router-dom"
import { twMerge } from "tailwind-merge"

const styles = cva('button', {
    variants: {
        intent: {
            primary: [
                'border-blue-500',
                'border-2',
                'bg-blue-500',
                'text-white',
                'hover:bg-white',
                'hover:text-blue-500',
                'active:bg-blue-200'
            ],
            secondary: [
                'hover:bg-neutral-300',
                'active:bg-neutral-400',
                'dark:hover:bg-neutral-700',
                'dark:active:bg-neutral-800'
            ]
        },
        btnType: {
            round: ['rounded-full'],
            notRound: ['rounded-xl']
        },
        disabled: {
            false: null,
            true: [
                'bg-gray-500',
                'text-gray-200',
                'hover:bg-gray-500',
                'opacity-95',
                'hover:text-gray-200',
                'hover:cursor-default',
                'border-gray-500',
                'transition-none',
                'active:bg-gray-500'
            ]
        }
    },
    defaultVariants: {
        intent: 'primary',
        btnType: 'round',
        diabled: false
    }
})

const Button = ({intent, btnType, size, isLink, href, disabled, className, children, ...props}) => {
    const defaultStyles = 'flex justify-center items-center transition cursor-pointer select-none p-3'
    return (
        isLink ? <Link
            to={disabled ? null : href}
            className={
                twMerge(styles({intent, btnType, size, disabled}), className, defaultStyles)
            }
            {...props}
        >
            {children}
            </Link> :
        <button
            className={
                twMerge(styles({intent, btnType, size, disabled}), className, defaultStyles)
            }
            disabled={disabled || undefined}
            {...props}
        >
            { children }
        </button>
    )
}

export default Button