import { AiOutlineRead, AiOutlineLink, AiOutlinePlayCircle, AiOutlineCheck } from "react-icons/ai";
import Loader from "../ui/Loader";
import { useState } from "react";
import { useIntl } from "react-intl";

const CreateVideoLessonModal = ({ course_id }) => {
    const intl = useIntl();
    const [error, setError] = useState([]);
    const [loader, setLoader] = useState(false);

    const [lesson_name, setLessonName] = useState('');
    const [lesson_description, setLessonDescription] = useState('');

    const [video_type, setVideoType] = useState('own_video');
    const [video_link, setVideoLink] = useState('');
    const [video_file, setVideoFile] = useState('');

    const createVideoLessonSubmit = async (e, course_id) => {
        e.preventDefault();
        //setLoader(true);

        const form_data = new FormData();
        form_data.append('lesson_name', lesson_name);
        form_data.append('lesson_description', lesson_description);
        form_data.append('course_id', course_id);
        form_data.append('video_type', video_type);
        form_data.append('video_link', video_link);
        form_data.append('video_file', video_file);


        for (let [key, value] of form_data) {
            console.log(`${key}: ${value}`)
        }

        // await axios.post('lessons/create', form_data)
        //     .then(response => {
        //         setLessonName('');
        //         setLessonDescription('');

        //         setLoader(false);
        //         // setCourseModal(false);
        //         // getCourse();
        //     }).catch(error => {
        //         setError(error.response.data.data);
        //         setLoader(false);
        //     });
    }

    return (
        <>
            {loader && <Loader className="overlay" />}
            <div className="modal-body">
                <form onSubmit={e => createVideoLessonSubmit(e, course_id)} encType="multipart/form-data">
                    <div className="form-group mt-4">
                        <AiOutlineRead />
                        <input onInput={e => setLessonName(e.target.value)} type="text" value={lesson_name} placeholder=" " />
                        <label className={(error.lesson_name && 'label-error')}>{error.lesson_name ? error.lesson_name : intl.formatMessage({ id: "lesson_name" })}</label>
                    </div>

                    <div className="form-group mt-4">
                        <AiOutlineRead />
                        <textarea onInput={e => setLessonDescription(e.target.value)} value={lesson_description} placeholder=" "></textarea>
                        <label className={(error.lesson_description && 'label-error')}>{error.lesson_description ? error.lesson_description : intl.formatMessage({ id: "lesson_description" })}</label>
                    </div>

                    <div className="mt-2">
                        <label className="custom-radio">
                            <input type="radio" onChange={e => setVideoType('own_video')} defaultChecked name="video_type" />
                            <span>{intl.formatMessage({ id: "videoLessonModal.form.upload_own_video" })}</span>
                        </label>
                    </div>

                    <div className="mt-2">
                        <label className="custom-radio">
                            <input type="radio" onChange={e => setVideoType('video_from_internet')} name="video_type" />
                            <span>{intl.formatMessage({ id: "videoLessonModal.form.upload_video_from_internet" })}</span>
                        </label>
                    </div>

                    {video_type === 'own_video'
                        ?
                        <div className="form-group-file mt-2 mb-4">
                            <input id="video_file" onChange={e => setVideoFile(e.target.files[0])} type="file" accept="video/*" placeholder=" " />
                            <label htmlFor="video_file" className={(error.video_file && 'label-error')}>
                                <AiOutlinePlayCircle />
                                <p className="mb-1">{error.video_file ? error.video_file : intl.formatMessage({ id: "videoLessonModal.form.upload_video_file" })}</p>
                                {video_file ?
                                    <div>
                                        {video_file.name && <p className="text-xs mb-0">{intl.formatMessage({ id: "file_name" })}: <b>{video_file.name}</b></p>}
                                        {video_file.size && <p className="text-xs mb-0">{intl.formatMessage({ id: "file_size" })}: <b>{(video_file.size / 1048576).toFixed(2)} МБ</b></p>}
                                    </div>
                                    :
                                    <p className="text-xs mb-0">{intl.formatMessage({ id: "choose_file" })}</p>

                                }
                            </label>
                        </div>
                        :
                        video_type === 'video_from_internet'
                            ?
                            <div className="form-group mt-4">
                                <AiOutlineLink />
                                <input onInput={e => setVideoLink(e.target.value)} type="text" value={video_link} placeholder=" " />
                                <label className={(error.video_link && 'label-error')}>{error.video_link ? error.video_link : intl.formatMessage({ id: "videoLessonModal.form.paste_video_link" })}</label>
                            </div>
                            : ""
                    }

                    <button className="btn btn-primary mt-4" type="submit"><AiOutlineCheck /> <span>{intl.formatMessage({ id: "done" })}</span></button>
                </form>
            </div>
        </>
    );
};

export default CreateVideoLessonModal;