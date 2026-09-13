import { twMerge } from "tailwind-merge"
import ErrorMessage from "./ErrorMessage"

const Form = ({ className, onSubmit, children, error, ...props }) => {
    const defaultStyle = "flex flex-col gap-5"
    return (
        <form
            className={twMerge(defaultStyle, className)}
            onSubmit={e => {
                e.preventDefault()
                onSubmit(e)
            }}
            {...props}
        >
            {error && (<ErrorMessage type="box" message={error} />)}
            {children}
        </form>
    )
}

export default Form