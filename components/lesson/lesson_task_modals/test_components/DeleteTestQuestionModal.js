import { AiOutlineDelete, AiOutlineStop } from "react-icons/ai";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { setTestQuestionBlocks } from "../../../../store/slices/testQuestionBlocksSlice";

const DeleteTestQuestionModal = ({ delete_question_id, closeModal }) => {
    const intl = useIntl();

    const dispatch = useDispatch();
    let test_question_blocks = useSelector((state) => state.testQuestionBlocks.test_question_blocks);

    const deleteQuestionSubmit = async (e) => {
        e.preventDefault();
        let newArr = test_question_blocks.filter(item => item.question_id !== delete_question_id);
        dispatch(setTestQuestionBlocks(newArr));
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