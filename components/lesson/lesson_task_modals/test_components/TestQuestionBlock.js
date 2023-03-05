import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineDelete } from "react-icons/ai";
const TestQuestionBlock = ({ index, roles, intl, test_questions, setTestquestions, test_question, edit }) => {

    function deleteTestQuestionBlock(question_id) {
        let newArr = test_questions.filter(item => item.question_id !== question_id);
        setTestquestions(newArr);
    }

    function moveTestQuestionBlock(index, direction) {
        let newArr = JSON.parse(JSON.stringify(test_questions));
        if (direction == 'up') {
            newArr.splice(index - 1, 0, newArr.splice(index, 1)[0]);
        }
        else if (direction == 'down') {
            newArr.splice(index + 1, 0, newArr.splice(index, 1)[0]);
        }
        setTestquestions(newArr);
    }

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
                            <span className="text-sm">{i + 1}. {answer.answer}</span>
                        </label>
                    </p>
                ))
            }
        </div>
    )
}

export default TestQuestionBlock;