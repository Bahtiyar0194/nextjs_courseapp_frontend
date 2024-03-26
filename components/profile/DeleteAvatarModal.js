import { AiOutlineDelete, AiOutlineStop } from "react-icons/ai";
import { useState } from "react";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import axios from "axios";
import Loader from "../ui/Loader";

const DeleteAvatarModal = ({ closeModal, userId, getMe, getUsers }) => {
    const intl = useIntl();
    const [loader, setLoader] = useState(false);
    const router = useRouter();

    const deleteAvatarSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);

        await axios.post(userId ? ('auth/delete_avatar/' + userId) : 'auth/delete_avatar')
            .then(response => {
                if (userId) {
                    getMe(userId);
                    getUsers();
                }
                else {
                    getMe();
                }
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
                <form onSubmit={e => deleteAvatarSubmit(e)} encType="multipart/form-data">
                    <p className="my-6">{intl.formatMessage({ id: "page.users.delete_profile_photo_confirm" })}</p>

                    <div className="btn-wrap">
                        <button className="btn btn-outline-danger" type="submit"><AiOutlineDelete /> <span>{intl.formatMessage({ id: "yes" })}</span></button>
                        <button onClick={e => { closeModal() }} className="btn btn-light" type="button"><AiOutlineStop /> <span>{intl.formatMessage({ id: "no" })}</span></button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default DeleteAvatarModal;