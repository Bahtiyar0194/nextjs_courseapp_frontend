import { AiOutlineRead, AiOutlineCheck } from "react-icons/ai";
import Loader from "../ui/Loader";
import { useState } from "react";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import axios from "axios";

const CreateCourseSectionModal = ({ closeModal, course_id, getLessons }) => {
    const router = useRouter();
    const intl = useIntl();
    const [error, setError] = useState([]);
    const [loader, setLoader] = useState(false);
    const [section_name, setSectionName] = useState('');

    const createCourseSectionSubmit = async (e, course_id, getLessons) => {
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
            {loader && <Loader className="overlay" />}
            <div className="modal-body">
                <form onSubmit={e => createCourseSectionSubmit(e, course_id, getLessons)} encType="multipart/form-data">
                    <div className="form-group mt-4">
                        <AiOutlineRead />
                        <input onInput={e => setSectionName(e.target.value)} type="text" value={section_name} placeholder=" " />
                        <label className={(error.lesson_name && 'label-error')}>{error.lesson_name ? error.lesson_name : intl.formatMessage({ id: "section_name" })}</label>
                    </div>
                    <button className="btn btn-primary mt-4" type="submit"><AiOutlineCheck /> <span>{intl.formatMessage({ id: "done" })}</span></button>
                </form>
            </div>
        </>
    );
};

export default CreateCourseSectionModal;