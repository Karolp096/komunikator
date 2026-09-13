import ModifiableUserListElement from "./ModifiableUserListElement"

const ModifiableUserList = ({list, setList}) => {
    function removeUser(user) {
        setList(l => l.filter(usr => usr.id != user.id))
    }

    return (
        <ul
            className=" flex
                        gap-5
                        overflow-auto
                        w-full
                        max-h-50
                        flex-wrap
                        p-5
                        bg-neutral-100
                        dark:bg-neutral-800
                        rounded-xl"
        >
            {list.map((usr) => (
                <ModifiableUserListElement key={usr.id} user={usr} removeUser={removeUser} />
            ))}
        </ul>
    )
}

export default ModifiableUserList