import { useState } from "react";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";
import Link from "next/link";
import { AiOutlinePlus, AiOutlineCaretDown, AiOutlineFileImage, AiOutlineAudio, AiOutlineCode } from "react-icons/ai";
import { CDropdown, CDropdownToggle, CDropdownMenu } from "@coreui/react";

import Modal from "../ui/Modal";
import CreateQuestionImageModal from "./lesson_task_modals/test_components/CreateQuestionImageModal";
import CreateQuestionAudioModal from "./lesson_task_modals/test_components/CreateQuestionAudioModal";
import CreateCodeModal from "./lesson_block_modals/CreateCodeModal";

export default function QuestionBlockTypeModals({question_index}) {
    const intl = useIntl();
    const roles = useSelector((state) => state.authUser.roles);

    const [imageModal, setImageModal] = useState(false);
    const [audioModal, setAudioModal] = useState(false);
    const [codeModal, setCodeModal] = useState(false);

    return (
        roles.includes(2) &&
        <>
            <CDropdown>
                <CDropdownToggle color="light" href="#">
                    <AiOutlinePlus/> {intl.formatMessage({ id: "lesson.add_material" })} <AiOutlineCaretDown className="ml-0.5 h-3 w-3" />
                </CDropdownToggle>
                <CDropdownMenu>
                    <Link href={'#'} onClick={() => setImageModal(true)}><AiOutlineFileImage />{intl.formatMessage({ id: "imageModal.image" })}</Link>
                    <Link href={'#'} onClick={() => setAudioModal(true)}><AiOutlineAudio />{intl.formatMessage({ id: "audioModal.audio" })}</Link>
                    <Link href={'#'} onClick={() => setCodeModal(true)}><AiOutlineCode />{intl.formatMessage({ id: "codeModal.code" })}</Link>
                </CDropdownMenu>
            </CDropdown>

            <Modal show={imageModal} onClose={() => setImageModal(false)} modal_title={intl.formatMessage({ id: "imageModal.title" })} modal_size="modal-xl">
                <CreateQuestionImageModal question_index={question_index} closeModal={() => setImageModal(false)}/>
            </Modal>

            <Modal show={audioModal} onClose={() => setAudioModal(false)} modal_title={intl.formatMessage({ id: "audioModal.title" })} modal_size="modal-xl">
                <CreateQuestionAudioModal question_index={question_index} closeModal={() => setAudioModal(false)}/>
            </Modal>
        </>

    )
}