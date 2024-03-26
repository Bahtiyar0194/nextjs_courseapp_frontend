import { AiOutlineCloseCircle, AiOutlineFileDone } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { setTestQuestionBlocks } from "../../../../store/slices/testQuestionBlocksSlice";
const AnswerElemInput = ({ index, question_id, question_index, answer, properties, intl }) => {

    const dispatch = useDispatch();
    let test_question_blocks = useSelector((state) => state.testQuestionBlocks.test_question_blocks);

    const deleteAnswerElem = (answer_id) => {
        let newArr = JSON.parse(JSON.stringify(test_question_blocks));
        let newAnswers = newArr[question_index].answers.filter(answer => answer.answer_id !== answer_id);
        newArr[question_index].answers.splice(newAnswers, 1);
        dispatch(setTestQuestionBlocks(newArr));
    }

    return (

        properties?.length > 0
            ?
            <div className="mt-4 flex flex-wrap gap-4">
                <div className="form-group-border input-group select flex active w-full">
                    <AiOutlineFileDone />
                    <input data-answer-input={answer.answer_id} defaultValue={answer.answer_value} type="text" placeholder=" " />
                    <select data-answer-select={answer.answer_id} defaultValue={''} >
                        <option disabled value="">{intl.formatMessage({ id: "task.select_a_property" })}</option>
                        {
                            properties?.map((property, i) => (
                                <option key={i} value={property.item_value}>{property.item_value}</option>
                            ))
                        }
                    </select>
                    <label data-answer-label={answer.answer_id}>{intl.formatMessage({ id: "task.test.addTestQuestionsModal.answer_variant" })} № {index + 1}</label>
                </div>
                {test_question_blocks[question_index].answers.length > 2 &&
                    <button type="button" onClick={e => deleteAnswerElem(answer.answer_id)} className="flex items-center text-danger -mt-1"><AiOutlineCloseCircle className="mr-1" /> <span className="text-sm">{intl.formatMessage({ id: "delete" })}</span></button>
                }
            </div>
            :
            <div className="form-group-border active mt-4">
                <AiOutlineFileDone />
                <input data-answer-input={answer.answer_id} defaultValue={answer.answer_value} type="text" placeholder=" " />
                <label data-answer-label={answer.answer_id}>{intl.formatMessage({ id: "task.test.addTestQuestionsModal.answer_variant" })} № {index + 1}</label>
                <div className="px-3 my-2 flex gap-4 flex-wrap">
                    <label className="custom-radio-checkbox">
                        <input data-answer-radio={answer.answer_id} defaultChecked={answer.checked} type="radio" name={'answer_radio_' + question_id} />
                        <span className="text-sm">{intl.formatMessage({ id: "task.test.addTestQuestionsModal.correct_answer" })}</span>
                    </label>
                    {test_question_blocks[question_index].answers.length > 2 && <button type="button" onClick={e => deleteAnswerElem(answer.answer_id)} className="flex items-center text-danger -mt-1"><AiOutlineCloseCircle className="mr-1" /> <span className="text-sm">{intl.formatMessage({ id: "delete" })}</span></button>}
                </div>
            </div>

    )
}

export default AnswerElemInput;