import { AiOutlineCamera, AiOutlineStop, AiOutlineUpload } from "react-icons/ai";
import { useIntl } from "react-intl";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Loader from "../ui/Loader";

const UploadFaviconModal = ({ closeModal, favicon_file, setFaviconFile, getSchoolAttributes }) => {
    const router = useRouter();
    const intl = useIntl();
    const [error, setError] = useState([]);
    const [loader, setLoader] = useState(false);
    const [progress, setProgress] = useState(0);

    const setFaviconSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);

        const form_data = new FormData();
        form_data.append('favicon_file', favicon_file);

        const config = {
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                setProgress(Math.floor((loaded * 100) / total))
            },
        }

        await axios.post('school/upload_favicon', form_data, config)
            .then(response => {
                getSchoolAttributes();
                setLoader(false);
                setError([]);
                closeModal();
            }).catch(err => {
                console.log(err)
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
                <form onSubmit={e => setFaviconSubmit(e)} encType="multipart/form-data">
                    <div className="form-group-file mt-6 mb-4">
                        <input id={"favicon"} onChange={e => setFaviconFile(e.target.files[0])} type="file" accept="image/*" placeholder=" " />
                        <label htmlFor={"favicon"} className={(error.favicon_file && 'label-error')}>
                            <AiOutlineCamera />
                            <p>
                                {
                                    error.favicon_file
                                        ?
                                        error.favicon_file
                                        :
                                        favicon_file
                                            ?
                                            intl.formatMessage({ id: "file_ready_to_upload" })
                                            :
                                            intl.formatMessage({ id: "imageModal.form.upload_image_file" })
                                }
                            </p>
                            {favicon_file
                                ?
                                <div>
                                    {favicon_file.name && <p className="text-xs mb-0">{intl.formatMessage({ id: "selected_file" })}: <b>{favicon_file.name}</b></p>}
                                    {favicon_file.size && <p className="text-xs mb-0">{intl.formatMessage({ id: "file_size" })}: <b>{(favicon_file.size / 1048576).toFixed(2)} {intl.formatMessage({ id: "megabyte" })}</b></p>}
                                </div>
                                :
                                <p className="text-xs mb-0">{intl.formatMessage({ id: "choose_file" })}</p>
                            }
                        </label>
                    </div>

                    {favicon_file
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

export default UploadFaviconModal;