import { AiOutlineDelete, AiOutlineStop } from "react-icons/ai";
import { useState } from "react";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import axios from "axios";
import Loader from "../ui/Loader";

const DeleteLogoModal = ({ closeModal, variable, getSchoolAttributes }) => {
    const intl = useIntl();
    const [loader, setLoader] = useState(false);
    const router = useRouter();

    const deleteLogoSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);

        await axios.post('school/delete_logo/' + variable)
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
                <form onSubmit={e => deleteLogoSubmit(e)} encType="multipart/form-data">
                    <p className="my-6">{intl.formatMessage({ id: "theme.delete_logo_confirm" })}</p>

                    <div className="btn-wrap">
                        <button className="btn btn-outline-danger" type="submit"><AiOutlineDelete /> <span>{intl.formatMessage({ id: "yes" })}</span></button>
                        <button onClick={e => { closeModal() }} className="btn btn-light" type="button"><AiOutlineStop /> <span>{intl.formatMessage({ id: "no" })}</span></button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default DeleteLogoModal;