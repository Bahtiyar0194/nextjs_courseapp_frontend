import { useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { AiOutlineCaretDown, AiOutlineQuestionCircle, AiOutlineFileDone, AiOutlineRead, AiOutlineFileText } from "react-icons/ai";
import { CDropdown, CDropdownToggle, CDropdownMenu } from "@coreui/react";
import Link from "next/link";
import RoleProvider from "../../services/RoleProvider";

export default function LessonTaskTypeModals({ lesson_id }) {
    const intl = useIntl();
    return (
        <RoleProvider roles={[2]}>
            <CDropdown>
                <CDropdownToggle color="primary" href="#">
                    <AiOutlineRead className="mr-0.5" />{intl.formatMessage({ id: "lesson.add_task" })} <AiOutlineCaretDown className="ml-0.5 h-3 w-3" />
                </CDropdownToggle>
                <CDropdownMenu>
                    <Link href={'/dashboard/task/create-task/' + lesson_id}><AiOutlineFileText /> {intl.formatMessage({ id: "task" })}</Link>
                    <Link href={'/dashboard/test/create-test/' + lesson_id}><AiOutlineFileDone /> {intl.formatMessage({ id: "task.test.title" })}</Link>
                </CDropdownMenu>
            </CDropdown>
        </RoleProvider>
    )
}