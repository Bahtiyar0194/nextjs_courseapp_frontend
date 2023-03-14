import { AiOutlineLink, AiOutlinePlayCircle, AiOutlineCheck, AiOutlineFile } from "react-icons/ai";
import Loader from "../../ui/Loader";
import { useState } from "react";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from 'react-redux';
import { setLessonBlocks, setLessonBlocksCount } from "../../../store/slices/lessonBlocksSlice";
import axios from "axios";

const CreateVideoModal = ({ closeModal }) => {
    const router = useRouter();
    const intl = useIntl();
    const [error, setError] = useState([]);
    const [loader, setLoader] = useState(false);
    const [progress, setProgress] = useState(0);
    const dispatch = useDispatch();
    let lesson_blocks = useSelector((state) => state.lessonBlocks.lesson_blocks);
    const lesson_blocks_count = useSelector((state) => state.lessonBlocks.lesson_blocks_count);

    const [video_name, setVideoName] = useState('');
    const [video_type, setVideoType] = useState('video_file');
    const [video_link, setVideoLink] = useState('');
    const [video_file, setVideoFile] = useState('');

    const createVideoSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);

        const form_data = new FormData();
        form_data.append('video_name', video_name);
        form_data.append('video_type', video_type);
        form_data.append('video_link', video_link);
        form_data.append('video_file', video_file);
        form_data.append('operation_type_id', 7);

        const config = {
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                setProgress(Math.floor((loaded * 100) / total))
            },
        }

        await axios.post('lessons/upload_video', form_data, config)
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
                setVideoName('');
                setVideoType('video_file');
                setVideoLink('');
                setVideoFile('');
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
                <form onSubmit={e => createVideoSubmit(e)} encType="multipart/form-data">
                    <div className="mt-4">
                        <label className="custom-radio">
                            <input type="radio" onChange={e => setVideoType('video_file')} defaultChecked name="video_type" />
                            <span>{intl.formatMessage({ id: "videoModal.form.upload_new_video" })}</span>
                        </label>
                    </div>

                    <div className="mt-2">
                        <label className="custom-radio">
                            <input type="radio" onChange={e => setVideoType('video_url')} name="video_type" />
                            <span>{intl.formatMessage({ id: "videoModal.form.upload_video_from_internet" })}</span>
                        </label>
                    </div>

                    <div className="mt-2">
                        <label className="custom-radio">
                            <input type="radio" onChange={e => setVideoType('video_from_media')} name="video_type" />
                            <span>{intl.formatMessage({ id: "upload_from_media" })}</span>
                        </label>
                    </div>

                    {video_type != 'video_from_media' &&
                        <div className="form-group mt-4">
                            <AiOutlineFile />
                            <input onInput={e => setVideoName(e.target.value)} type="text" value={video_name} placeholder=" " />
                            <label className={(error.video_name && 'label-error')}>{error.video_name ? error.video_name : intl.formatMessage({ id: "videoModal.video_name" })}</label>
                        </div>
                    }

                    {video_type === 'video_file'
                        ?
                        <div className="form-group-file mt-2 mb-4">
                            <input id="video_file" onChange={e => setVideoFile(e.target.files[0])} type="file" accept="video/*" placeholder=" " />
                            <label htmlFor="video_file" className={(error.video_file && 'label-error')}>
                                <AiOutlinePlayCircle />
                                <p className="mb-1">{error.video_file ? error.video_file : video_file ? intl.formatMessage({ id: "file_ready_to_upload" }) : intl.formatMessage({ id: "videoModal.form.upload_video_file" })}</p>
                                {video_file ?
                                    <div>
                                        {video_file.name && <p className="text-xs mb-0">{intl.formatMessage({ id: "selected_file" })}: <b>{video_file.name}</b></p>}
                                        {video_file.size && <p className="text-xs mb-0">{intl.formatMessage({ id: "file_size" })}: <b>{(video_file.size / 1048576).toFixed(2)} {intl.formatMessage({ id: "megabyte" })}</b></p>}
                                    </div>
                                    :
                                    <p className="text-xs mb-0">{intl.formatMessage({ id: "choose_file" })}</p>
                                }
                            </label>
                        </div>
                        :
                        video_type === 'video_url'
                            ?
                            <div className="form-group mt-4">
                                <AiOutlineLink />
                                <input onInput={e => setVideoLink(e.target.value)} type="text" value={video_link} placeholder=" " />
                                <label className={(error.video_link && 'label-error')}>{error.video_link ? error.video_link : intl.formatMessage({ id: "videoModal.form.paste_video_link" })}</label>
                            </div>
                            : "Under construction"
                    }

                    <button className="btn btn-primary mt-4" type="submit"><AiOutlineCheck /> <span>{intl.formatMessage({ id: "done" })}</span></button>
                </form>
            </div>
        </>
    );
};

export default CreateVideoModal;