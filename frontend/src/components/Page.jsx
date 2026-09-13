import { useEffect } from "react"

const Page = ({children, title}) => {
    useEffect(() => {
        document.title = title || "Messaging app"
    }, [title])

    return (
        <>
            {children}
        </>
    )
}

export default Page