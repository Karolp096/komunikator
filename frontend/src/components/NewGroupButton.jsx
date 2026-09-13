import { useState } from "react"
import Button from "./Button"
import Dialog from "./Dialog"
import { Plus } from "lucide-react"
import NewGroup from "./NewGroup"
import { useTranslation } from "react-i18next"

const NewGroupButton = () => {
    const [isMaking, setIsMaking] = useState(false)

    const { t } = useTranslation()

    return (
        <div>
            <Button
                intent="secondary"
                title={t("create_group")}
                onClick={() => setIsMaking(true)}
            >
                <Plus />
            </Button>
            <Dialog
                isDisplayed={isMaking}
                setIsDisplayed={setIsMaking}
                content={<NewGroup setDialogDisplayed={setIsMaking} />}
            />
        </div>
    )
}

export default NewGroupButton