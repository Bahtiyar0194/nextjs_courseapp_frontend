import { AiOutlineCloseCircle, AiOutlineFileDone } from "react-icons/ai";
const AnswerElemInput = ({ index, answer, answers, setAnswers, intl }) => {
    const deleteAnswerElem = (answer_id) => {
        setAnswers(answers.filter(answer => answer.answer_id !== answer_id));
    }

    return (
        <div className="form-group mt-4">
            <AiOutlineFileDone />
            <input data-answer-input={answer.answer_id} type="text" placeholder=" " />
            <label data-answer-label={answer.answer_id}>{intl.formatMessage({ id: "task.test.addTestQuestionsModal.answer_variant" })} № {index + 1}</label>
            <div className="px-0.5 mt-2 flex justify-between">
                <label className="custom-radio-checkbox">
                    <input data-answer-radio={answer.answer_id} type="radio" name="correct_answer" />
                    <span className="text-sm">{intl.formatMessage({ id: "task.test.addTestQuestionsModal.correct_answer" })}</span>
                </label>
                {answers.length > 2 && <button type="button" onClick={e => deleteAnswerElem(answer.answer_id)} className="flex items-center text-danger -mt-1"><AiOutlineCloseCircle className="mr-1" /> <span className="text-sm">{intl.formatMessage({ id: "delete" })}</span></button>}
            </div>
        </div>
    )
}

export default AnswerElemInput;