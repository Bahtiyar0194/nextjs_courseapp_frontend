import { AiOutlineDelete, AiOutlineStop } from "react-icons/ai";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { setTestQuestionBlocks } from "../../../../store/slices/testQuestionBlocksSlice";

const DeleteTestQuestionMaterialBlockModal = ({ question_index, delete_test_question_material_block_id, closeModal }) => {
    const intl = useIntl();

    const dispatch = useDispatch();
    let test_question_blocks = useSelector((state) => state.testQuestionBlocks.test_question_blocks);

    const deleteMaterialSubmit = async (e) => {
        e.preventDefault();
        let newArr = JSON.parse(JSON.stringify(test_question_blocks));
        let newMaterials = newArr[question_index].question_materials.filter(material => material.block_id !== delete_test_question_material_block_id);
        newArr[question_index].question_materials.splice(newMaterials, 1);
        dispatch(setTestQuestionBlocks(newArr));
        closeModal();
    };

    return (
        <div className="modal-body">
            <form onSubmit={e => deleteMaterialSubmit(e)} encType="multipart/form-data">
                <p className="mb-6">{intl.formatMessage({ id: "task.test.deleteTestQuestionMaterialModal.confirm" })}</p>

                <div className="btn-wrap">
                    <button className="btn btn-outline-danger" type="submit"><AiOutlineDelete /> <span>{intl.formatMessage({ id: "yes" })}</span></button>
                    <button onClick={e => {closeModal()}} className="btn btn-light" type="button"><AiOutlineStop /> <span>{intl.formatMessage({ id: "no" })}</span></button>
                </div>
            </form>
        </div>
    );
}

export default DeleteTestQuestionMaterialBlockModal;