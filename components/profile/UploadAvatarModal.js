import { AiOutlineCamera, AiOutlineStop, AiOutlineUpload } from "react-icons/ai";
import { useIntl } from "react-intl";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Loader from "../ui/Loader";

const UploadAvatarModal = ({ closeModal, image_file, setImageFile, userId, getMe, getUsers }) => {
    const router = useRouter();
    const intl = useIntl();
    const [error, setError] = useState([]);
    const [loader, setLoader] = useState(false);
    const [progress, setProgress] = useState(0);

    const setAvatarSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);

        const form_data = new FormData();
        form_data.append('image_file', image_file);

        const config = {
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                setProgress(Math.floor((loaded * 100) / total))
            },
        }

        await axios.post(userId ? ('auth/upload_avatar/' + userId) : 'auth/upload_avatar', form_data, config)
            .then(response => {
                if (userId) {
                    getMe(userId);
                    getUsers();
                }
                else {
                    getMe();
                }
                setLoader(false);
                setError([]);
                closeModal();
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 422) {
                        setError(err.response.data);
                        setLoader(false);
                    }
                    else {
                        router.push({
                            pathname: '/error',
                            query: {
                                status: err.response.status,
                                message: err.response.data.message,
                                url: err.request.responseURL,
                            }
                        });
                    }
                }
                else {
                    router.push('/error');
                }
            });
    }

    return (
        <>
            {loader && <Loader className="overlay" progress={progress} />}
            <div className="modal-body">
                <form onSubmit={e => setAvatarSubmit(e)} encType="multipart/form-data">
                    <div className="form-group-file mt-6 mb-4">
                        <input id="image_file" onChange={e => setImageFile(e.target.files[0])} type="file" accept="image/*" placeholder=" " />
                        <label htmlFor="image_file" className={(error.image_file && 'label-error')}>
                            <AiOutlineCamera />
                            <p>
                                {
                                    error.image_file
                                        ?
                                        error.image_file
                                        :
                                        image_file
                                            ?
                                            intl.formatMessage({ id: "file_ready_to_upload" })
                                            :
                                            intl.formatMessage({ id: "imageModal.form.upload_image_file" })
                                }
                            </p>
                            {image_file
                                ?
                                <div>
                                    {image_file.name && <p className="text-xs mb-0">{intl.formatMessage({ id: "selected_file" })}: <b>{image_file.name}</b></p>}
                                    {image_file.size && <p className="text-xs mb-0">{intl.formatMessage({ id: "file_size" })}: <b>{(image_file.size / 1048576).toFixed(2)} {intl.formatMessage({ id: "megabyte" })}</b></p>}
                                </div>
                                :
                                <p className="text-xs mb-0">{intl.formatMessage({ id: "choose_file" })}</p>
                            }
                        </label>
                    </div>

                    {image_file
                        &&
                        <div className="btn-wrap">
                            <button className="btn btn-primary" type="submit"><AiOutlineUpload /> <span>{intl.formatMessage({ id: "upload" })}</span></button>
                            <button onClick={e => closeModal()} className="btn btn-light" type="button"><AiOutlineStop /> <span>{intl.formatMessage({ id: "cancel" })}</span></button>
                        </div>
                    }
                </form>
            </div>
        </>
    );
};

export default UploadAvatarModal;