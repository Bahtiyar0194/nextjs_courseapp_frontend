import { AiOutlineCheck, AiOutlineQuestion, AiOutlinePlusCircle } from "react-icons/ai";
import { useState } from "react";
import { useIntl } from "react-intl";
import AnswerElemInput from "./test_components/AnswerElemInput";

const EditTestQuestionModal = ({ test_questions, edit_question_id, closeModal }) => {

    const question = test_questions.find(item => item.question_id === edit_question_id);
    const intl = useIntl();

    const [question_input, setQuestionInput] = useState(question.question);
    const [question_error, setQuestionError] = useState('');

    const [answers, setAnswers] = useState(question.answers);

    const [answers_count, setAnswersCount] = useState(answers.length);

    const addAnswerElem = () => {
        setAnswersCount(answers_count + 1);
        setAnswers([...answers, {
            answer_id: answers_count + 1,
            answer_value: ''
        }]);
    }

    const editQuestionSubmit = async (e) => {
        e.preventDefault();
        let i = 0;
        let question_answers = [];
        let empty_answers = 0;
        let correct_answers = 0;

        let answer_inputs = document.querySelectorAll('[data-answer-input]');
        for (let input of answer_inputs) {
            let label = document.querySelector('[data-answer-label="' + input.getAttribute('data-answer-input') + '"]');
            let radio = document.querySelector('[data-answer-radio="' + input.getAttribute('data-answer-input') + '"]');
            if (input.value == '') {
                empty_answers += 1;
                label.classList.add('label-error');
                label.textContent = intl.formatMessage({ id: "task.test.addTestQuestionsModal.answer_variant" }) + ' № ' + (i += 1) + ' ' + intl.formatMessage({ id: "task.test.addTestQuestionsModal.answer_error" });
            }
            else {
                label.classList.remove('label-error');
                label.textContent = intl.formatMessage({ id: "task.test.addTestQuestionsModal.answer_variant" }) + ' № ' + (i += 1);
            }

            if (radio.checked === true) {
                correct_answers += 1;
            }

            question_answers.push({
                answer_id: i,
                answer_value: input.value,
                checked: radio.checked
            })
        }

        let radios = document.querySelectorAll('[data-answer-radio]');

        if (correct_answers === 0) {
            for (let radio of radios) {
                radio.nextElementSibling.classList.add('error');
                radio.nextElementSibling.textContent = intl.formatMessage({ id: "task.test.addTestQuestionsModal.correct_answer_error" });
            }
        }
        else {
            for (let radio of radios) {
                radio.nextElementSibling.classList.remove('error');
                radio.nextElementSibling.textContent = intl.formatMessage({ id: "task.test.addTestQuestionsModal.correct_answer" });
            }
        }

        if (question_input == '') {
            setQuestionError(intl.formatMessage({ id: "task.test.addTestQuestionsModal.question_error" }));
        }
        else {
            setQuestionError('')
        }

        if (question_input != '' && empty_answers === 0 && correct_answers > 0) {


            closeModal();
        }
    };

    return (
        <div className="modal-body">
            {answers_count}
            <form onSubmit={e => editQuestionSubmit(e)} encType="multipart/form-data">
                <div className="form-group mt-4">
                    <AiOutlineQuestion />
                    <input onInput={e => setQuestionInput(e.target.value)} type="text" value={question_input} placeholder=" " />
                    <label className={(question_error && 'label-error')}>{question_error ? question_error : intl.formatMessage({ id: "task.test.addTestQuestionsModal.question" })}</label>
                </div>

                {answers.map((answer, i) => (
                    <AnswerElemInput key={i} index={i} answer={answer} answers={answers} setAnswers={setAnswers} intl={intl} />
                ))}

                <button type="button" onClick={e => addAnswerElem()} className="text-sm flex items-center pb-1 border-b border-dashed border-inactive text-corp"><AiOutlinePlusCircle className="mr-1" /> {intl.formatMessage({ id: "task.test.addTestQuestionsModal.add_variant" })}</button>

                <div className="btn-wrap">
                    <button className="btn btn-primary mt-4" type="submit"><AiOutlineCheck /> <span>{intl.formatMessage({ id: "done" })}</span></button>
                </div>
            </form>
        </div>
    );
}

export default EditTestQuestionModal;