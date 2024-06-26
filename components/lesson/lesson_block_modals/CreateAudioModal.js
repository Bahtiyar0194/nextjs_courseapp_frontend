import { AiOutlineAudio, AiOutlineCheck, AiOutlineFile } from "react-icons/ai";
import Loader from "../../ui/Loader";
import { useState } from "react";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from 'react-redux';
import { setLessonBlocks, setLessonBlocksCount } from "../../../store/slices/lessonBlocksSlice";
import { setTaskBlocks, setTaskBlocksCount } from '../../../store/slices/taskBlocksSlice';
import { setTaskAnswerBlocks, setTaskAnswerBlocksCount } from "../../../store/slices/taskAnswerBlocksSlice";
import axios from "axios";

const CreateAudioModal = ({ create_lesson, create_task, create_task_answer, upload_file, getDiskData, closeModal }) => {
    const router = useRouter();
    const intl = useIntl();
    const [error, setError] = useState([]);
    const [loader, setLoader] = useState(false);
    const [progress, setProgress] = useState(0);
    const dispatch = useDispatch();

    let lesson_blocks = useSelector((state) => state.lessonBlocks.lesson_blocks);
    const lesson_blocks_count = useSelector((state) => state.lessonBlocks.lesson_blocks_count);

    let task_blocks = useSelector((state) => state.taskBlocks.task_blocks);
    const task_blocks_count = useSelector((state) => state.taskBlocks.task_blocks_count);

    let task_answer_blocks = useSelector((state) => state.taskAnswerBlocks.task_answer_blocks);
    const task_answer_blocks_count = useSelector((state) => state.taskAnswerBlocks.task_answer_blocks_count);

    const [audio_name, setAudioName] = useState('');
    const [audio_type, setAudioType] = useState('audio_file');
    const [audio_file, setAudioFile] = useState('');
    const [audios, setAudios] = useState([]);
    const [selected_audio_id, setSelectedAudioId] = useState('');

    const changeAudioType = (audio_type) => {
        setAudioType(audio_type);

        if (audio_type === 'audio_from_media') {
            getAudios();
        }
    }

    const getAudios = async () => {
        setLoader(true);
        await axios.get('media/get_audios')
            .then(response => {
                setAudios(response.data);
                setLoader(false);
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
    }

    const createAudioSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);

        const form_data = new FormData();
        form_data.append('audio_name', audio_name);
        form_data.append('audio_type', audio_type);
        form_data.append('audio_file', audio_file);
        form_data.append('selected_audio_id', selected_audio_id);
        form_data.append('operation_type_id', 8);

        const config = {
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                setProgress(Math.floor((loaded * 100) / total))
            },
        }

        await axios.post('media/upload_audio', form_data, config)
            .then(response => {
                const data = response.data.data;

                if (create_lesson === true) {
                    dispatch(setLessonBlocksCount(lesson_blocks_count + 1));
                    lesson_blocks = [...lesson_blocks, {
                        'block_id': lesson_blocks_count + 1,
                        'file_type_id': data.file_type_id,
                        'file_id': data.file_id,
                        'file_name': data.file_name,
                        'file_target': data.file_target
                    }];
                    dispatch(setLessonBlocks(lesson_blocks));
                }

                if (create_task === true) {
                    dispatch(setTaskBlocksCount(task_blocks_count + 1));
                    task_blocks = [...task_blocks, {
                        'block_id': task_blocks_count + 1,
                        'file_type_id': data.file_type_id,
                        'file_id': data.file_id,
                        'file_name': data.file_name,
                        'file_target': data.file_target
                    }];
                    dispatch(setTaskBlocks(task_blocks));
                }

                if (create_task_answer === true) {
                    dispatch(setTaskAnswerBlocksCount(task_answer_blocks_count + 1));
                    task_answer_blocks = [...task_answer_blocks, {
                        'block_id': task_answer_blocks_count + 1,
                        'file_type_id': data.file_type_id,
                        'file_id': data.file_id,
                        'file_name': data.file_name,
                        'file_target': data.file_target
                    }];
                    dispatch(setTaskAnswerBlocks(task_answer_blocks));
                }

                if (upload_file === true) {
                    getDiskData();
                }

                setLoader(false);
                setAudioName('');
                setAudioType('audio_file');
                setAudioFile('');
                setSelectedAudioId('');
                setError([]);
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
    }

    return (
        <>
            {loader && <Loader className="overlay" progress={progress} />}
            <div className="modal-body">
                <form onSubmit={e => createAudioSubmit(e)} encType="multipart/form-data">
                    {upload_file === false &&
                        <div className="mb-4">
                            <div>
                                <label className="custom-radio">
                                    <input type="radio" onChange={e => changeAudioType('audio_file')} checked={audio_type === 'audio_file'} name="audio_type" />
                                    <span>{intl.formatMessage({ id: "audioModal.form.upload_new_audio" })}</span>
                                </label>
                            </div>

                            <div className="mt-2">
                                <label className="custom-radio">
                                    <input type="radio" onChange={e => changeAudioType('audio_from_media')} checked={audio_type === 'audio_from_media'} name="audio_type" />
                                    <span>{intl.formatMessage({ id: "upload_from_media" })}</span>
                                </label>
                            </div>
                        </div>
                    }

                    {audio_type != 'audio_from_media' &&
                        <div className="form-group">
                            <AiOutlineFile />
                            <input onInput={e => setAudioName(e.target.value)} type="text" value={audio_name} placeholder=" " />
                            <label className={(error.audio_name && 'label-error')}>{error.audio_name ? error.audio_name : intl.formatMessage({ id: "audioModal.audio_name" })}</label>
                        </div>
                    }

                    {audio_type === 'audio_file'
                        ?
                        <div className="form-group-file mt-2 mb-4">
                            <input id="audio_file" onChange={e => setAudioFile(e.target.files[0])} type="file" accept="audio/*" placeholder=" " />
                            <label htmlFor="audio_file" className={(error.audio_file && 'label-error' || error.lack_of_disk_space && 'label-error')}>
                                <AiOutlineAudio />
                                <p className="mb-1">
                                    {
                                        error.audio_file
                                            ?
                                            error.audio_file
                                            :
                                            error.lack_of_disk_space
                                                ?
                                                intl.formatMessage({ id: "lack_of_disk_space" })
                                                :
                                                audio_file
                                                    ?
                                                    intl.formatMessage({ id: "file_ready_to_upload" })
                                                    :
                                                    intl.formatMessage({ id: "audioModal.form.upload_audio_file" })
                                    }
                                </p>
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
                        :
                        <div className="form-group mt-6 mb-4">
                            <AiOutlineFile />
                            <select defaultValue={''} onChange={e => setSelectedAudioId(e.target.value)}>
                                <option value='' selected>{intl.formatMessage({ id: "choose_file" })}</option>
                                {audios.map(audio => (
                                    <option key={audio.file_id} value={audio.file_id}>{audio.file_name}</option>
                                ))}
                            </select>
                            <label className={(error.selected_audio_id && 'label-error')}>{error.selected_audio_id ? error.selected_audio_id : intl.formatMessage({ id: "selected_file" })}</label>
                        </div>
                    }

                    <button className="btn btn-primary mt-4" type="submit"><AiOutlineCheck /> <span>{intl.formatMessage({ id: "done" })}</span></button>
                </form>
            </div>
        </>
    );
};

export default CreateAudioModal;