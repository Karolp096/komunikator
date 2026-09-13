import { cva } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

const ErrorMessage = ({message, type}) => {
    const styles = cva("p", {
        variants: {
            type: {
                box: ['p-2', 'bg-red-100', 'border-2', 'border-red-800', 'rounded-xl', 'dark:bg-red-300'],
                text: []
            }
        },
        defaultVariants: {
            type: 'text'
        }
    })
    const defaultStyle = 'text-red-900'
    return (
        <p className={twMerge(styles({type}), defaultStyle)}>{message}</p>
    )
}

export default ErrorMessage