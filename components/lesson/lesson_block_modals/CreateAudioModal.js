import { AiOutlineAudio, AiOutlineCheck, AiOutlineFile } from "react-icons/ai";
import Loader from "../../ui/Loader";
import { useState } from "react";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from 'react-redux';
import { setLessonBlocks, setLessonBlocksCount } from "../../../store/slices/lessonBlocksSlice";
import axios from "axios";

const CreateAudioModal = ({ closeModal }) => {
    const router = useRouter();
    const intl = useIntl();
    const [error, setError] = useState([]);
    const [loader, setLoader] = useState(false);
    const [progress, setProgress] = useState(0);
    const dispatch = useDispatch();
    let lesson_blocks = useSelector((state) => state.lessonBlocks.lesson_blocks);
    const lesson_blocks_count = useSelector((state) => state.lessonBlocks.lesson_blocks_count);

    const [audio_name, setAudioName] = useState('');
    const [audio_type, setAudioType] = useState('audio_file');
    const [audio_file, setAudioFile] = useState('');

    const createAudioSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);

        const form_data = new FormData();
        form_data.append('audio_name', audio_name);
        form_data.append('audio_file', audio_file);
        form_data.append('operation_type_id', 8);

        const config = {
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                setProgress(Math.floor((loaded * 100) / total))
            },
        }

        await axios.post('lessons/upload_audio', form_data, config)
            .then(response => {
                const data = response.data.data;

                dispatch(setLessonBlocksCount(lesson_blocks_count + 1));
                lesson_blocks = [...lesson_blocks, {
                    'block_id': lesson_blocks_count + 1,
                    'file_type_id': data.file_type_id,
                    'file_id': data.file_id,
                    'file_name': data.file_name,
                    'file_target': data.file_target
                }];
                dispatch(setLessonBlocks(lesson_blocks));

                setLoader(false);
                setAudioName('');
                setAudioType('audio_file');
                setAudioFile('');
                closeModal();
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 422) {
                        setError(err.response.data.data);
                        setLoader(false);
                    }
                    else {
                        router.push('/error/' + err.response.status)
                    }
                }
                else {
                    router.push('/error/')
                }
            });
    }

    return (
        <>
            {loader && <Loader className="overlay" progress={progress} />}
            <div className="modal-body">
                <form onSubmit={e => createAudioSubmit(e)} encType="multipart/form-data">
                    <div className="mt-4">
                        <label className="custom-radio">
                            <input type="radio" onChange={e => setAudioType('audio_file')} defaultChecked name="audio_type" />
                            <span>{intl.formatMessage({ id: "audioModal.form.upload_new_audio" })}</span>
                        </label>
                    </div>

                    <div className="mt-2">
                        <label className="custom-radio">
                            <input type="radio" onChange={e => setAudioType('audio_from_media')} name="audio_type" />
                            <span>{intl.formatMessage({ id: "upload_from_media" })}</span>
                        </label>
                    </div>

                    {audio_type != 'audio_from_media' &&
                        <div className="form-group mt-4">
                            <AiOutlineFile />
                            <input onInput={e => setAudioName(e.target.value)} type="text" value={audio_name} placeholder=" " />
                            <label className={(error.audio_name && 'label-error')}>{error.audio_name ? error.audio_name : intl.formatMessage({ id: "audioModal.audio_name" })}</label>
                        </div>
                    }

                    {audio_type === 'audio_file'
                        ?
                        <div className="form-group-file mt-2 mb-4">
                            <input id="audio_file" onChange={e => setAudioFile(e.target.files[0])} type="file" accept="audio/*" placeholder=" " />
                            <label htmlFor="audio_file" className={(error.audio_file && 'label-error')}>
                                <AiOutlineAudio />
                                <p className="mb-1">{error.audio_file ? error.audio_file : audio_file ? intl.formatMessage({ id: "file_ready_to_upload" }) : intl.formatMessage({ id: "audioModal.form.upload_audio_file" })}</p>
                                {audio_file ?
                                    <div>
                                        {audio_file.name && <p className="text-xs mb-0">{intl.formatMessage({ id: "selected_file" })}: <b>{audio_file.name}</b></p>}
                                        {audio_file.size && <p className="text-xs mb-0">{intl.formatMessage({ id: "file_size" })}: <b>{(audio_file.size / 1048576).toFixed(2)} {intl.formatMessage({ id: "megabyte" })}</b></p>}
                                    </div>
                                    :
                                    <p className="text-xs mb-0">{intl.formatMessage({ id: "choose_file" })}</p>
                                }
                            </label>
                        </div>
                        : "Under construction"
                    }

                    <button className="btn btn-primary mt-4" type="submit"><AiOutlineCheck /> <span>{intl.formatMessage({ id: "done" })}</span></button>
                </form>
            </div>
        </>
    );
};

export default CreateAudioModal;