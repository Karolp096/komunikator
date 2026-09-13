import { X } from "lucide-react"
import Button from "./Button"

const Dialog = ({content, isDisplayed, setIsDisplayed}) => {
    return (
        <>
            {isDisplayed && (
                <div
                    className="bg-[#ffffff8a] dark:bg-[#00000092] fixed top-0 left-0 w-screen h-screen z-50"
                    onClick={() => setIsDisplayed(false)}
                >
                    <div
                        className=" flex
                                    flex-col
                                    min-h-[40%]
                                    min-w-[50%]
                                    max-h-[90%]
                                    max-w-[90%]
                                    rounded-xl
                                    bg-white
                                    dark:bg-neutral-900
                                    shadow
                                    shadow-black
                                    p-5
                                    absolute
                                    top-1/2
                                    left-1/2
                                    translate-[-50%]
                                    animate-scale-up"
                        onClick={e => e.stopPropagation()}
                    >
                        <Button
                            className="self-end"
                            intent="secondary"
                            onClick={() => setIsDisplayed(false)}
                        >
                            <X />
                        </Button>
                        <div className="flex-1 p-2 relative">
                            {content}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Dialog