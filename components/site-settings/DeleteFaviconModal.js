import { AiOutlineDelete, AiOutlineStop } from "react-icons/ai";
import { useState } from "react";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import axios from "axios";
import Loader from "../ui/Loader";

const DeleteFaviconModal = ({ closeModal, getSchoolAttributes }) => {
    const intl = useIntl();
    const [loader, setLoader] = useState(false);
    const router = useRouter();

    const deleteFaviconSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);

        await axios.post('school/delete_favicon')
            .then(response => {
                getSchoolAttributes();
                setLoader(false);
                closeModal();
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
                <form onSubmit={e => deleteFaviconSubmit(e)} encType="multipart/form-data">
                    <p className="my-6">{intl.formatMessage({ id: "theme.delete_favicon_confirm" })}</p>

                    <div className="btn-wrap">
                        <button className="btn btn-outline-danger" type="submit"><AiOutlineDelete /> <span>{intl.formatMessage({ id: "yes" })}</span></button>
                        <button onClick={e => { closeModal() }} className="btn btn-light" type="button"><AiOutlineStop /> <span>{intl.formatMessage({ id: "no" })}</span></button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default DeleteFaviconModal;