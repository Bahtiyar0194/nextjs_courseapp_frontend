import API_URL from '../../config/api';
import { Player } from 'video-react';
import "../../node_modules/video-react/dist/video-react.css";
import ReactAudioPlayer from 'react-audio-player';
import { useIntl } from "react-intl";
import { useState } from 'react';
import { useRouter } from 'next/router';
import { AiOutlineDelete, AiOutlineFile, AiOutlineSave } from 'react-icons/ai';
import Loader from './Loader';
import axios from 'axios';

const PreviewFileModal = ({ file, closeModal, getFiles, edit_file_name, setEditFileName, openDeleteFileModal }) => {
    const intl = useIntl();
    const [error, setError] = useState([]);
    const [loader, setLoader] = useState(false);
    const router = useRouter();

    const saveFile = async (e) => {
        setLoader(true);
        const form_data = new FormData();
        form_data.append('file_name', edit_file_name);
        form_data.append('operation_type_id', 12);

        await axios.post('media/update/' + file.file_id, form_data)
            .then(response => {
                setLoader(false);
                setError([]);
                getFiles();
                closeModal();
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 422) {
                        setError(err.response.data.data);
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
    };

    return (
        <>
            {loader && <Loader className="overlay" />}
            <div className="modal-body">
                <div className="form-group-border active mt-6 mb-4">
                    <AiOutlineFile />
                    <input autoComplete="edit-file-name" onInput={e => setEditFileName(e.target.value)} type="text" value={edit_file_name} placeholder=" " />
                    <label className={(error.file_name && 'label-error')}>{error.file_name ? error.file_name : intl.formatMessage({ id: "file_name" })}</label>
                </div>

                {file.file_type_id == 1 &&
                    <Player playsInline src={API_URL + '/media/video/' + file.file_id} />
                }

                {file.file_type_id == 2 &&
                    <ReactAudioPlayer width="100%" src={API_URL + '/media/audio/' + file.file_id} controls />
                }

                {file.file_type_id == 3 &&
                    <img className='w-full border-active rounded-lg' src={API_URL + '/media/image/' + file.file_id} />
                }

                <div className="btn-wrap mt-4">
                    <button type="button" className="btn btn-outline-primary" onClick={e => saveFile(file.file_id)}> <AiOutlineSave /> <span>{intl.formatMessage({ id: "save_changes" })}</span></button>
                    <button type="button" className="btn btn-outline-danger" onClick={e => openDeleteFileModal()}> <AiOutlineDelete /> <span>{intl.formatMessage({ id: "delete" })}</span></button>
                </div>
            </div>
        </>
    );
};

export default PreviewFileModal;