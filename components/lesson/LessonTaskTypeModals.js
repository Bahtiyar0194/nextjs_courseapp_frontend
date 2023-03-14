import { useState } from "react";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { AiOutlineCaretDown, AiOutlineQuestionCircle, AiOutlineFileSearch, AiOutlineFileDone, AiOutlineFileAdd, AiOutlineRead } from "react-icons/ai";
import { CDropdown, CDropdownToggle, CDropdownMenu } from "@coreui/react";
import Link from "next/link";

export default function LessonTaskTypeModals({ lesson_id }) {
    const intl = useIntl();
    const roles = useSelector((state) => state.authUser.roles);

    return (
        roles.includes(2) &&
        <>
            <CDropdown>
                <CDropdownToggle color="primary" href="#">
                    <AiOutlineRead className="mr-0.5" />{intl.formatMessage({ id: "lesson.add_task" })} <AiOutlineCaretDown className="ml-0.5 h-3 w-3" />
                </CDropdownToggle>
                <CDropdownMenu>
                    <Link href={'#'} onClick={() => setQuestionModal(true)}><AiOutlineQuestionCircle /> {intl.formatMessage({ id: "task.answerTheQuestionModal.title" })}</Link>
                    <Link href={'#'}><AiOutlineFileSearch /> Вставка пропущенных слов</Link>
                    <Link href={'/dashboard/task/create-test/' + lesson_id}><AiOutlineFileDone /> Тестовое задание</Link>
                    <Link href={'#'}><AiOutlineFileAdd /> Приложить файл</Link>
                </CDropdownMenu>
            </CDropdown>
        </>
    )
}