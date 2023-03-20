import { AiOutlineCheck, AiOutlineStop } from "react-icons/ai";
import Loader from "../ui/Loader";
import { useState } from "react";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import axios from "axios";

const BuyCourseModal = ({ closeModal, course_id, getLessons }) => {
    const router = useRouter();
    const intl = useIntl();
    const [error, setError] = useState([]);
    const [loader, setLoader] = useState(false);
    const [section_name, setSectionName] = useState('');

    const buyCourseSubmit = async (e, course_id, getLessons) => {
        e.preventDefault();
        setLoader(true);

        const form_data = new FormData();
        form_data.append('lesson_name', section_name);
        form_data.append('lesson_type_id', 2);
        form_data.append('course_id', course_id);
        form_data.append('operation_type_id', 4);


        await axios.post('lessons/create', form_data)
            .then(response => {
                getLessons(course_id);
                setLoader(false);
                closeModal();
                setSectionName('');
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
            {loader && <Loader className="overlay" />}
            <div className="modal-body">
                <form onSubmit={e => buyCourseSubmit(e, course_id, getLessons)} encType="multipart/form-data">
                    <p className="my-6">{intl.formatMessage({ id: "lesson.deleteLessonModal.confirm" })}</p>

                    <div className="btn-wrap">
                        <button className="btn btn-outline-primary" type="submit"><AiOutlineCheck /> <span>{intl.formatMessage({ id: "yes" })}</span></button>
                        <button onClick={e => { closeModal() }} className="btn btn-light" type="button"><AiOutlineStop /> <span>{intl.formatMessage({ id: "no" })}</span></button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default BuyCourseModal;