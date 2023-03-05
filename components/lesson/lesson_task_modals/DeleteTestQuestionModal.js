import { AiOutlineDelete, AiOutlineStop } from "react-icons/ai";
import { useIntl } from "react-intl";

const DeleteTestQuestionModal = ({ test_questions, setTestQuestions, delete_question_id, closeModal }) => {
    const intl = useIntl();

    const deleteQuestionSubmit = async (e) => {
        e.preventDefault();
        let newArr = test_questions.filter(item => item.question_id !== delete_question_id);
        setTestQuestions(newArr);
        closeModal();
    };

    return (
        <div className="modal-body">
            <form onSubmit={e => deleteQuestionSubmit(e)} encType="multipart/form-data">
                <p className="my-6">{intl.formatMessage({ id: "task.test.deleteTestQuestionsModal.confirm" })}</p>

                <div className="btn-wrap">
                    <button className="btn btn-outline-danger" type="submit"><AiOutlineDelete /> <span>{intl.formatMessage({ id: "yes" })}</span></button>
                    <button onClick={e => {closeModal()}} className="btn btn-light" type="button"><AiOutlineStop /> <span>{intl.formatMessage({ id: "no" })}</span></button>
                </div>
            </form>
        </div>
    );
}

export default DeleteTestQuestionModal;