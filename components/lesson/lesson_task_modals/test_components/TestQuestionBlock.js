import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import Modal from "../../../ui/Modal";
import EditTestQuestionModal from "../EditTestQuestionModal";
import { useState } from "react";
const TestQuestionBlock = ({ index, roles, intl, test_questions, moveTestQuestionBlock, editTestQuestionBlock, deleteTestQuestionBlock, test_question, edit }) => {

    const [edit_test_question_modal, setEditTestQuestionModal] = useState(false);

    return (
        <div className={"lesson-block " + (edit === true && "edit")}>
            {roles.includes(2) && edit === true &&
                <div className="flex justify-between items-center border-b-active pb-4 mb-4">
                    <div>
                        <p className='mb-0 text-corp'>{intl.formatMessage({ id: "task.test.addTestQuestionsModal.question" })} № {index + 1}</p>
                    </div>
                    <div className='btn-wrap'>
                        {index > 0 && <button title={intl.formatMessage({ id: "move_up" })} onClick={e => moveTestQuestionBlock(index, 'up')} className="btn-up"><AiOutlineArrowUp /></button>}
                        {index != test_questions.length - 1 && <button title={intl.formatMessage({ id: "move_down" })} onClick={e => moveTestQuestionBlock(index, 'down')} className="btn-down"><AiOutlineArrowDown /></button>}
                        <button title={intl.formatMessage({ id: "edit" })} onClick={e => setEditTestQuestionModal(true)} className="btn-edit"><AiOutlineEdit /></button>
                        <button title={intl.formatMessage({ id: "delete" })} onClick={e => deleteTestQuestionBlock(test_question.question_id)} className="btn-delete"><AiOutlineDelete /></button>
                    </div>
                </div>
            }
            <h3>{test_question.question}</h3>

            {test_question.answers.length > 0 &&
                test_question.answers.map((answer, i) => (
                    <p key={i}>
                        <label className="custom-radio-checkbox">
                            <input type="radio" disabled checked={answer.checked} />
                            <span className="text-sm">{i + 1}. {answer.answer_value}</span>
                        </label>
                    </p>
                ))
            }

            <Modal
                show={edit_test_question_modal}
                onClose={() => setEditTestQuestionModal(false)}
                modal_title={intl.formatMessage({ id: "task.test.editTestQuestionsModal.title" })}
                modal_size="modal-xl"
            >
                <EditTestQuestionModal test_questions={test_questions} edit_question_id={test_question.question_id} closeModal={() => setEditTestQuestionModal(false)} />
            </Modal>

        </div>


    )
}

export default TestQuestionBlock;