import { AiOutlineDelete, AiOutlineStop } from "react-icons/ai";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { setTaskBlocks } from "../../../store/slices/taskBlocksSlice";

const DeleteTaskBlockModal = ({ delete_task_block_id, closeModal }) => {
    const intl = useIntl();
    const dispatch = useDispatch();
    let task_blocks = useSelector((state) => state.taskBlocks.task_blocks);

    const deleteSubmit = async (e) => {
        e.preventDefault();
        let newArr = task_blocks.filter(item => item.block_id !== delete_task_block_id);
        dispatch(setTaskBlocks(newArr));
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

export default DeleteTaskBlockModal;