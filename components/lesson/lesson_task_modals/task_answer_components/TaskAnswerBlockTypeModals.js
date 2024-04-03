import { useState } from "react";
import { useIntl } from "react-intl";
import Link from "next/link";
import { AiOutlinePlus, AiOutlineCaretDown, AiOutlineFileImage, AiOutlinePlayCircle, AiOutlineFileText, AiOutlineAudio, AiOutlineTable, AiOutlineCode } from "react-icons/ai";
import { CDropdown, CDropdownToggle, CDropdownMenu } from "@coreui/react";

import Modal from "../../../ui/Modal";
import TextEditorModal from "../../lesson_block_modals/TextEditorModal";
import TableModal from "../../lesson_block_modals/TableModal";
import CreateImageModal from "../../lesson_block_modals/CreateImageModal";
import CreateVideoModal from "../../lesson_block_modals/CreateVideoModal";
import CreateAudioModal from "../../lesson_block_modals/CreateAudioModal";
import CreateCodeModal from "../../lesson_block_modals/CreateCodeModal";

export default function TaskAnswerBlockTypeModals() {
    const intl = useIntl();

    const [textModal, setTextModal] = useState(false);
    const [tableModal, setTableModal] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [videoModal, setVideoModal] = useState(false);
    const [audioModal, setAudioModal] = useState(false);
    const [codeModal, setCodeModal] = useState(false);

    return (
        <>
            <CDropdown>
                <CDropdownToggle color="primary" href="#">
                    <AiOutlinePlus /> {intl.formatMessage({ id: "lesson.add_material" })} <AiOutlineCaretDown className="ml-0.5 h-3 w-3" />
                </CDropdownToggle>
                <CDropdownMenu>
                    {/* <Link href={'#'} onClick={() => setTextModal(true)}><AiOutlineFileText />{intl.formatMessage({ id: "textModal.text" })}</Link> */}
                    <Link href={'#'} onClick={() => setTableModal(true)}><AiOutlineTable />{intl.formatMessage({ id: "tableModal.table" })}</Link>
                    <Link href={'#'} onClick={() => setImageModal(true)}><AiOutlineFileImage />{intl.formatMessage({ id: "imageModal.image" })}</Link>
                    <Link href={'#'} onClick={() => setVideoModal(true)}><AiOutlinePlayCircle />{intl.formatMessage({ id: "videoModal.video" })}</Link>
                    <Link href={'#'} onClick={() => setAudioModal(true)}><AiOutlineAudio />{intl.formatMessage({ id: "audioModal.audio" })}</Link>
                    <Link href={'#'} onClick={() => setCodeModal(true)}><AiOutlineCode />{intl.formatMessage({ id: "codeModal.code" })}</Link>
                </CDropdownMenu>
            </CDropdown>


            {/* <Modal show={textModal} onClose={() => setTextModal(false)} modal_title={intl.formatMessage({ id: "textModal.title" })} modal_size="modal-4xl">
                <TextEditorModal create_task_answer={true} closeModal={() => setTextModal(false)} />
            </Modal> */}

            <Modal show={tableModal} onClose={() => setTableModal(false)} modal_title={intl.formatMessage({ id: "tableModal.title" })} modal_size="modal-xl">
                <TableModal create_task_answer={true} closeModal={() => setTableModal(false)} />
            </Modal>

            <Modal show={imageModal} onClose={() => setImageModal(false)} modal_title={intl.formatMessage({ id: "imageModal.title" })} modal_size="modal-xl">
                <CreateImageModal create_task_answer={true} upload_file={false} closeModal={() => setImageModal(false)} />
            </Modal>

            <Modal show={videoModal} onClose={() => setVideoModal(false)} modal_title={intl.formatMessage({ id: "videoModal.title" })} modal_size="modal-xl">
                <CreateVideoModal create_task_answer={true} upload_file={false} closeModal={() => setVideoModal(false)} />
            </Modal>

            <Modal show={audioModal} onClose={() => setAudioModal(false)} modal_title={intl.formatMessage({ id: "audioModal.title" })} modal_size="modal-xl">
                <CreateAudioModal create_task_answer={true} upload_file={false} closeModal={() => setAudioModal(false)} />
            </Modal>

            <Modal show={codeModal} onClose={() => setCodeModal(false)} modal_title={intl.formatMessage({ id: "codeModal.title" })} modal_size="modal-4xl">
                <CreateCodeModal create_task_answer={true} closeModal={() => setCodeModal(false)} />
            </Modal>
        </>
    )
}