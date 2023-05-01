import { useState } from "react";
import { useIntl } from "react-intl";
import Link from "next/link";
import { AiOutlineFileImage, AiOutlinePlayCircle, AiOutlineAudio, AiOutlineFileAdd } from "react-icons/ai";
import { CDropdown, CDropdownToggle, CDropdownMenu } from "@coreui/react";

import Modal from "./Modal";
import CreateImageModal from "../lesson/lesson_block_modals/CreateImageModal";
import CreateVideoModal from "../lesson/lesson_block_modals/CreateVideoModal";
import CreateAudioModal from "../lesson/lesson_block_modals/CreateAudioModal";

export default function UploadFileModals({ getDiskData }) {
    const intl = useIntl();

    const [imageModal, setImageModal] = useState(false);
    const [videoModal, setVideoModal] = useState(false);
    const [audioModal, setAudioModal] = useState(false);

    return (
        <>
            <CDropdown>
                <CDropdownToggle color="outline-primary" href="#">
                    <AiOutlineFileAdd /> <span>{intl.formatMessage({ id: "upload_file" })}</span>
                </CDropdownToggle>
                <CDropdownMenu>
                    <Link href={'#'} onClick={() => setImageModal(true)}><AiOutlineFileImage />{intl.formatMessage({ id: "imageModal.image" })}</Link>
                    <Link href={'#'} onClick={() => setVideoModal(true)}><AiOutlinePlayCircle />{intl.formatMessage({ id: "videoModal.video" })}</Link>
                    <Link href={'#'} onClick={() => setAudioModal(true)}><AiOutlineAudio />{intl.formatMessage({ id: "audioModal.audio" })}</Link>
                </CDropdownMenu>
            </CDropdown>

            <Modal show={imageModal} onClose={() => setImageModal(false)} modal_title={intl.formatMessage({ id: "imageModal.title" })} modal_size="modal-xl">
                <CreateImageModal upload_file={true} getDiskData={getDiskData} closeModal={() => setImageModal(false)} />
            </Modal>

            <Modal show={videoModal} onClose={() => setVideoModal(false)} modal_title={intl.formatMessage({ id: "videoModal.title" })} modal_size="modal-xl">
                <CreateVideoModal upload_file={true} getDiskData={getDiskData} closeModal={() => setVideoModal(false)} />
            </Modal>

            <Modal show={audioModal} onClose={() => setAudioModal(false)} modal_title={intl.formatMessage({ id: "audioModal.title" })} modal_size="modal-xl">
                <CreateAudioModal upload_file={true} getDiskData={getDiskData} closeModal={() => setAudioModal(false)} />
            </Modal>
        </>
    )
}