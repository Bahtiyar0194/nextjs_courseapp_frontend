import { AiOutlineCheck, AiOutlineQuestion } from "react-icons/ai";
import Loader from "../ui/Loader";
import { useState } from "react";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import axios from "axios";

const CreateAnswerTheQuestionModal = ({ closeModal, lesson_id, getTasks }) => {
    const router = useRouter();
    const intl = useIntl();
    const [error, setError] = useState([]);
    const [loader, setLoader] = useState(false);
    const [task_name, setTaskName] = useState('');

    const createCreateAnswerQuestionSubmit = async (e, lesson_id, getTasks) => {
        e.preventDefault();
        setLoader(true);

        const form_data = new FormData();
        form_data.append('task_name', task_name);
        form_data.append('task_type_id', 1);
        form_data.append('lesson_id', lesson_id);
        form_data.append('operation_type_id', 6);


        await axios.post('tasks/create', form_data)
            .then(response => {
                getTasks(lesson_id);
                setLoader(false);
                closeModal();
                setTaskName('');
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
                <form onSubmit={e => createCreateAnswerQuestionSubmit(e, lesson_id, getTasks)} encType="multipart/form-data">
                    <div className="form-group mt-4">
                        <AiOutlineQuestion />
                        <input onInput={e => setTaskName(e.target.value)} type="text" value={task_name} placeholder=" " />
                        <label className={(error.task_name && 'label-error')}>{error.task_name ? error.task_name : intl.formatMessage({ id: "task.task_name" })}</label>
                    </div>
                    <button className="btn btn-primary mt-4" type="submit"><AiOutlineCheck /> <span>{intl.formatMessage({ id: "done" })}</span></button>
                </form>
            </div>
        </>
    );
};

export default CreateAnswerTheQuestionModal;