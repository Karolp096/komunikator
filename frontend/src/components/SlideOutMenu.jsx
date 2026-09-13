const SlideOutMenu = ({ isOpen, setIsOpen, children }) => {
    return (
        isOpen && (
            <>
                <div
                    className="fixed top-0 left-0 z-20 size-full"
                    onClick={() => setIsOpen(false)}
                >
                </div>
                <div
                    className=" absolute
                                top-full
                                right-0
                                flex
                                flex-col
                                gap-2
                                w-screen
                                md:max-w-[35vw]
                                bg-white
                                dark:bg-neutral-800
                                shadow
                                shadow-black
                                rounded-xl
                                z-30
                                p-5"
                >
                    {children}
                </div>
            </>
        )
    )
}

export default SlideOutMenu