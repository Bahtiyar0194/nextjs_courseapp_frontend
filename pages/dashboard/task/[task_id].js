import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { AiOutlineCheckCircle, AiOutlineRight } from "react-icons/ai";
import axios from "axios";
import Link from "next/link";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import ButtonLoader from "../../../components/ui/ButtonLoader";
import TestQuestionMaterialBlock from "../../../components/lesson/lesson_task_modals/test_components/TestQuestionMaterialBlock";

export default function LessonTask() {
    const router = useRouter();
    const [showFullLoader, setShowFullLoader] = useState(true);
    const intl = useIntl();

    const [task, setTask] = useState([]);
    const roles = useSelector((state) => state.authUser.roles);

    const [welcome, setWelcome] = useState(true);
    const [button_loader, setButtonLoader] = useState(false);

    const [test_question, setTestQuestion] = useState([]);
    const [test_answer_error, setTestAnswerError] = useState(false);

    const getTask = async (task_id) => {
        setShowFullLoader(true);
        await axios.get('tasks/' + task_id)
            .then(response => {
                setTask(response.data);
                getNextTestQuestion(task_id);
                setShowFullLoader(false);
            }).catch(err => {
                if (err.response) {
                    router.push('/error/' + err.response.status)
                }
                else {
                    router.push('/error')
                }
            });
    }

    const saveUserAnswer = async (e, task_id) => {
        e.preventDefault();
        setButtonLoader(true);

        let checked_answer_inputs = 0;
        let answer_inputs = e.target.querySelectorAll("input[name='answer-radio']");

        for (let input of answer_inputs) {
            if (input.checked === true) {
                checked_answer_inputs += 1;

                await axios.post('tasks/test/save_user_answer/' + input.value)
                    .then(response => {

                    }).catch(err => {
                        if (err.response) {
                            router.push('/error/' + err.response.status)
                        }
                        else {
                            router.push('/error')
                        }
                    });
            }
        }

        if (checked_answer_inputs === 0) {
            setTestAnswerError(true);
            setButtonLoader(false);
        }
        else {
            getNextTestQuestion(task_id);
        }
    }

    const getNextTestQuestion = async (task_id) => {
        await axios.get('tasks/test/get_test_question/' + task_id)
            .then(response => {
                if (response.data.progress >= 100) {
                    setWelcome(true);
                }
                setTestQuestion(response.data);
                setButtonLoader(false);
            }).catch(err => {
                if (err.response) {
                    router.push('/error/' + err.response.status)
                }
                else {
                    router.push('/error')
                }
            });
    }


    useEffect(() => {
        if (router.isReady) {
            const { task_id } = router.query;
            getTask(task_id);
        }
    }, [router.isReady]);

    return (
        <DashboardLayout showLoader={showFullLoader} title={intl.formatMessage({ id: "task.add_test" })}>
            {
                task.task_id
                    ?
                    <>
                        <Breadcrumb>
                            <Link href={'/dashboard/courses/catalogue'}>{intl.formatMessage({ id: "page.courses_catalogue.title" })}</Link>
                            <Link href={'/dashboard/courses/' + task.course_id}>{task.course_name}</Link>
                            <Link href={'/dashboard/lesson/' + task.lesson_id}>{task.lesson_name}</Link>
                            {task.task_name}
                        </Breadcrumb>

                        <div className="col-span-12">
                            <div className="card p-6">
                                <h2 className="mb-2">{task.task_name}</h2>
                                <p className="mb-4">{task.task_description}</p>

                                {welcome === true
                                    ?
                                    <>
                                        {
                                            test_question.progress < 100
                                                ?
                                                <button disabled={button_loader} onClick={e => setWelcome(false)} className="btn btn-primary">
                                                    {button_loader === true ? <ButtonLoader /> : <AiOutlineRight />}
                                                    <span>{
                                                        test_question.progress == 0
                                                            ?
                                                            intl.formatMessage({ id: "task.start_the_test" })
                                                            :
                                                            intl.formatMessage({ id: "task.continue_the_test" })
                                                    }</span>
                                                </button>
                                                :
                                                <>
                                                    <h4 className="text-corp">Тестирование завершено!</h4>

                                                    <button onClick={e => setWelcome(false)} className="btn btn-outline-primary">
                                                        <AiOutlineCheckCircle />
                                                        <span>Посмотреть результаты</span>
                                                    </button>
                                                </>
                                        }
                                    </>

                                    :
                                    <>
                                        <hr className="my-6"></hr>

                                        {test_question.progress < 100 ?
                                            <>
                                                <div className="progress">
                                                    <div className="progress-bar" style={{ width: test_question.progress + '%' }}></div>
                                                </div>

                                                <p>{intl.formatMessage({ id: "task.test.addTestQuestionsModal.question" })}: <span className="text-corp">{test_question.answered_questions_count + 1}/{test_question.all_questions_count}</span></p>

                                                <h3>{test_question.question.question}</h3>
                                                <div className="custom-grid">
                                                    {
                                                        test_question.question.question_materials.length > 0 &&
                                                        test_question.question.question_materials.map((question_material_block, i) => (
                                                            <div key={i} className="col-span-12 lg:col-span-4">
                                                                <TestQuestionMaterialBlock question_material_block={question_material_block} question_index={i} edit={false} />
                                                            </div>
                                                        ))
                                                    }
                                                    <div className="col-span-12">
                                                        <form onSubmit={e => saveUserAnswer(e, task.task_id)} encType="multipart/form-data">
                                                            {test_question.question.question_answers.length > 0 &&
                                                                test_question.question.question_answers.map((answer, i) => (
                                                                    <div key={answer.answer_id} className="mt-4">
                                                                        <label className="custom-radio-checkbox">
                                                                            <input type="radio" defaultValue={answer.answer_id} defaultChecked={false} name="answer-radio" />
                                                                            <span>{answer.answer}</span>
                                                                        </label>
                                                                    </div>
                                                                ))
                                                            }

                                                            {test_answer_error && <p className="text-danger text-sm mt-4">{intl.formatMessage({ id: "task.test.select_your_answer" })}</p>}

                                                            <button type="submit" disabled={button_loader} className="btn btn-primary mt-4">
                                                                {button_loader === true ? <ButtonLoader /> : <AiOutlineRight />}
                                                                <span>{intl.formatMessage({ id: "continue" })}</span>
                                                            </button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className="flex gap-4 flex-wrap">
                                                    <p className="mb-0">{intl.formatMessage({ id: "task.test.all_questions_count" })}: <span className="text-corp">{test_question.all_questions_count}</span></p>
                                                    <p className="mb-0">{intl.formatMessage({ id: "task.test.correct_answers_count" })}: <span className="text-corp">{test_question.correct_answers_count}</span></p>
                                                </div>

                                                {test_question.all_questions.length > 0 &&
                                                    test_question.all_questions.map((question, q) => (
                                                        <div key={question.question_id} className={test_question.all_questions.length != (q + 1) ? 'my-4 border-b-active' : undefined}>
                                                            <h3>{question.question}</h3>
                                                            {
                                                                question.question_materials.length > 0 &&
                                                                <div className="custom-grid">
                                                                    {question.question_materials.map((question_material_block, i) => (
                                                                        <div key={i} className="col-span-12 lg:col-span-3">
                                                                            <TestQuestionMaterialBlock question_material_block={question_material_block} question_index={i} edit={false} />
                                                                        </div>
                                                                    ))}

                                                                    <div className="col-span-12">
                                                                        {
                                                                            question.question_answers.length > 0 &&
                                                                            question.question_answers.map((answer, i) => (
                                                                                <p key={answer.answer_id} className='text-lg font-medium mb-4'>
                                                                                    <span className={(answer.is_correct == 1 ? 'text-corp' : undefined)}>{i + 1}. {answer.answer}</span>
                                                                                    {answer.is_correct == 0 && answer.selected_by_user == true && <i className="text-sm text-danger"> ({intl.formatMessage({ id: "task.test.your_answer" })})</i>}
                                                                                    {answer.is_correct == 1 && answer.selected_by_user == true && <i className="text-sm text-corp"> ({intl.formatMessage({ id: "task.test.you_have_chosen_the_correct_answer" })})</i>}
                                                                                    {answer.is_correct == 1 && answer.selected_by_user == false && <i className="text-sm text-corp"> ({intl.formatMessage({ id: "task.test.correct_answer" })})</i>}
                                                                                </p>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                </div>
                                                            }
                                                        </div>
                                                    ))
                                                }
                                            </>
                                        }
                                    </>
                                }
                            </div>
                        </div>
                    </>
                    :
                    <div className="col-span-12">
                        {intl.formatMessage({ id: "loading" })}
                    </div>
            }
        </DashboardLayout>
    );
}