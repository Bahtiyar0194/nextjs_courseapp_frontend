import { AiOutlineDelete, AiOutlineStop } from "react-icons/ai";
import { useState } from "react";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import axios from "axios";
import Loader from "../ui/Loader";

const DeleteFileModal = ({ file, closeModal, closePreviewFileModal, getDiskData }) => {
    const intl = useIntl();
    const [loader, setLoader] = useState(false);
    const router = useRouter();

    const deleteFileSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        const form_data = new FormData();
        form_data.append('operation_type_id', 13);

        await axios.post('media/delete/' + file.file_id, form_data)
            .then(response => {
                setLoader(false);
                getDiskData();
                closeModal();
                closePreviewFileModal(file);
            }).catch(err => {
                if (err.response) {
                    router.push({
                        pathname: '/error',
                        query: {
                            status: err.response.status,
                            message: err.response.data.message,
                            url: err.request.responseURL,
                        }
                    });
                }
                else {
                    router.push('/error');
                }
            });
    };

    return (
        <>
            {loader && <Loader className="overlay" />}
            <div className="modal-body">
                <form onSubmit={e => deleteFileSubmit(e)} encType="multipart/form-data">
                    <p className="mb-6">{intl.formatMessage({ id: "file_delete_confirm" })}</p>

                    <div className="btn-wrap">
                        <button className="btn btn-outline-danger" type="submit"><AiOutlineDelete /> <span>{intl.formatMessage({ id: "yes" })}</span></button>
                        <button onClick={e => { closeModal() }} className="btn btn-light" type="button"><AiOutlineStop /> <span>{intl.formatMessage({ id: "no" })}</span></button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default DeleteFileModal;