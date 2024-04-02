import { AiOutlineDelete, AiOutlineStop } from "react-icons/ai";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { setTaskAnswerBlocks } from "../../../../store/slices/taskAnswerBlocksSlice";

const DeleteTaskAnswerBlockModal = ({ delete_task_answer_block_id, closeModal }) => {
    const intl = useIntl();
    const dispatch = useDispatch();
    let task_answer_blocks = useSelector((state) => state.taskAnswerBlocks.task_answer_blocks);

    const deleteSubmit = async (e) => {
        e.preventDefault();
        let newArr = task_answer_blocks.filter(item => item.block_id !== delete_task_answer_block_id);
        dispatch(setTaskAnswerBlocks(newArr));
        closeModal();
    };

    return (
        <div className="modal-body">
            <form onSubmit={e => deleteSubmit(e)} encType="multipart/form-data">
                <p className="my-6">{intl.formatMessage({ id: "lesson.delete_lesson_block_confirm" })}</p>

                <div className="btn-wrap">
                    <button className="btn btn-outline-danger" type="submit"><AiOutlineDelete /> <span>{intl.formatMessage({ id: "yes" })}</span></button>
                    <button onClick={e => {closeModal()}} className="btn btn-light" type="button"><AiOutlineStop /> <span>{intl.formatMessage({ id: "no" })}</span></button>
                </div>
            </form>
        </div>
    );
}

export default DeleteTaskAnswerBlockModal;