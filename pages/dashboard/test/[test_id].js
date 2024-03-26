import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { AiOutlineCheckCircle, AiOutlineFileImage, AiOutlineRight } from "react-icons/ai";
import axios from "axios";
import Link from "next/link";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import ButtonLoader from "../../../components/ui/ButtonLoader";
import TestQuestionMaterialBlock from "../../../components/lesson/lesson_task_modals/test_components/TestQuestionMaterialBlock";
import ProgressBar from "../../../components/ui/ProgressBar";
import HtmlToImageButton from "../../../components/ui/HTMLToImageButton";
import { useSelector } from "react-redux";
import HtmlToPDFButton from "../../../components/ui/HtmlToPDFButton";

export default function LessonTest() {
    const router = useRouter();
    const [showFullLoader, setShowFullLoader] = useState(true);
    const intl = useIntl();

    const user = useSelector((state) => state.authUser.user);

    const [task, setTask] = useState([]);

    const [welcome, setWelcome] = useState(true);
    const [button_loader, setButtonLoader] = useState(false);

    const [test_question, setTestQuestion] = useState([]);
    const [test_answer_error, setTestAnswerError] = useState(false);

    const [animated, setAnimated] = useState(false);

    const getTask = async (task_id) => {
        setShowFullLoader(true);

        await axios.get('tasks/' + task_id)
            .then(response => {
                setTask(response.data);
                getNextTestQuestion(task_id);
                setShowFullLoader(false);
            }).catch(err => {
                if (err.response) {
                    router.push({
                        pathname: '/error',
                        query: {
                            status: err.response.status,
                            message: err.response.data.message,
                            url: err.request.responseURL,
                        }
                    });
                }
                else {
                    router.push('/error');
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
                        setAnimated(false);
                    }).catch(err => {
                        if (err.response) {
                            router.push({
                                pathname: '/error',
                                query: {
                                    status: err.response.status,
                                    message: err.response.data.message,
                                    url: err.request.responseURL,
                                }
                            });
                        }
                        else {
                            router.push('/error');
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
        let url = "";

        if ((user.current_role_id == 2 || user.current_role_id == 3) && router.query.executor_id) {
            url = 'tasks/test/get_user_test_result/' + task_id + '/' + router.query.executor_id;
        }
        else {
            url = 'tasks/test/get_test_question/' + task_id;
        }

        await axios.get(url)
            .then(response => {
                if (response.data.progress >= 100) {
                    setWelcome(true);
                }
                setTestQuestion(response.data);
                setTimeout(() => {
                    setAnimated(true);
                }, 1000);
                setButtonLoader(false);
            }).catch(err => {
                if (err.response) {
                    router.push({
                        pathname: '/error',
                        query: {
                            status: err.response.status,
                            message: err.response.data.message,
                            url: err.request.responseURL,
                        }
                    });
                }
                else {
                    router.push('/error');
                }
            });
    }

    useEffect(() => {
        if (router.isReady) {
            const { test_id } = router.query;
            getTask(test_id);
        }
    }, [router.isReady]);

    return (
        <DashboardLayout showLoader={showFullLoader} title={task.task_name}>
            <Breadcrumb>
                <Link href={'/dashboard/courses/catalogue'}>{intl.formatMessage({ id: "page.courses_catalogue.title" })}</Link>
                <Link href={'/dashboard/courses/' + task.course_id}>{task.course_name}</Link>
                <Link href={'/dashboard/lesson/' + task.lesson_id}>{task.lesson_name}</Link>
                {task.task_name}
            </Breadcrumb>

            <div className="col-span-12">
                <div id="test_result" className="card p-6">
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
                                        <h4 className="text-corp">{intl.formatMessage({ id: "task.testing_completed" })}</h4>

                                        <button onClick={e => setWelcome(false)} className="btn btn-outline-primary">
                                            <AiOutlineCheckCircle />
                                            <span>{intl.formatMessage({ id: "task.view_test_results" })}</span>
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

                                    <h3 className={"animate fadeInUp " + (animated ? 'animated' : '')}>{test_question.question.question}</h3>
                                    <div className="custom-grid">
                                        {
                                            test_question.question.question_materials.length > 0 &&
                                            test_question.question.question_materials?.map((question_material_block, i) => (
                                                <TestQuestionMaterialBlock key={i} question_material_block={question_material_block} question_index={i} edit={false} />
                                            ))
                                        }
                                        <div className="col-span-12">
                                            <form onSubmit={e => saveUserAnswer(e, task.task_id)} encType="multipart/form-data">
                                                {test_question.question.question_answers.length > 0 &&
                                                    test_question.question.question_answers.map((answer, i) => (
                                                        <div key={answer.answer_id} className={"animate fadeInLeft mb-4" + (animated ? " animated" : "")} style={{ "transitionDelay": (i * 200) + "ms" }}>
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
                                    <div className="title-wrap mb-4">
                                        <div className="flex gap-4 flex-wrap items-center">
                                            <p className="mb-0">{intl.formatMessage({ id: "task.test.all_questions_count" })}: <span className="text-corp">{test_question.all_questions_count}</span></p>
                                            {task.task_type_id === 1 &&
                                                <p className="mb-0">{intl.formatMessage({ id: "task.test.correct_answers_count" })}: <span className="text-corp">{test_question.correct_answers_count}</span></p>
                                            }
                                        </div>
                                        {task?.task_type_id === 4 &&
                                            <div className="btn-wrap">
                                                <HtmlToImageButton btn_title={'export_to_png'} file_name={task.task_name + ' - ' + test_question.executor} elem_id={'test_result'} btn_size_class={'btn-sm'} />
                                                <HtmlToPDFButton file_name={task.task_name + ' - ' + test_question.executor} elem_id={'test_result'} btn_size_class={'btn-sm'} />
                                            </div>
                                        }
                                    </div>

                                    <p className="text-2xl title-font">{intl.formatMessage({ id: "executor" })}: <b>{test_question.executor}</b></p>

                                    {task?.task_type_id === 4 && test_question.analytic_test_result?.length > 0 &&
                                        <div className="flex flex-col gap-y-2">
                                            {test_question.analytic_test_result.map((res, r) => (
                                                <div>
                                                    <p className="mb-0 text-lg"><b>{res.property_name}</b></p>
                                                    {res.property_description && <p className="mb-2 text-sm">{res.property_description}</p>}
                                                    <ProgressBar className={(res.prop_percentage <= 25 ? "danger" : res.prop_percentage <= 50 ? "orange" : res.prop_percentage <= 70 ? "warning" : res.prop_percentage <= 100 ? "success" : "") + " sm"} percentage={res.prop_percentage} show_percentage={true} />
                                                </div>
                                            ))}
                                        </div>
                                    }

                                    {test_question.all_questions.length > 0 && task?.task_type_id === 1 &&
                                        test_question.all_questions.map((question, q) => (
                                            <div key={question.question_id} className={test_question.all_questions.length != (q + 1) ? 'my-4 border-b-active' : undefined}>
                                                <h4>{question.question}</h4>
                                                <div className="custom-grid">
                                                    {question.question_materials.map((question_material_block, i) => (
                                                        <TestQuestionMaterialBlock key={i} question_material_block={question_material_block} question_index={i} edit={false} />
                                                    ))}

                                                    <div className="col-span-12">
                                                        {
                                                            question.question_answers.length > 0 &&
                                                            question.question_answers.map((answer, i) => (
                                                                <p key={answer.answer_id} className='font-medium mb-4'>
                                                                    <span className={(answer.is_correct == 1 ? 'text-corp' : '')}>{i + 1}. {answer.answer}</span>
                                                                    {task.task_type_id === 1
                                                                        ?
                                                                        <>
                                                                            {answer.is_correct == 0 && answer.selected_by_user == true && <i className="text-sm text-danger"> ({intl.formatMessage({ id: "task.test.your_answer" })})</i>}
                                                                            {answer.is_correct == 1 && answer.selected_by_user == true && <i className="text-sm text-corp"> ({intl.formatMessage({ id: "task.test.you_have_chosen_the_correct_answer" })})</i>}
                                                                            {answer.is_correct == 1 && answer.selected_by_user == false && <i className="text-sm text-corp"> ({intl.formatMessage({ id: "task.test.correct_answer" })})</i>}
                                                                        </>
                                                                        :
                                                                        answer.selected_by_user == true && <i className="text-sm text-corp"> ({intl.formatMessage({ id: "task.test.your_answer" })})</i>
                                                                    }
                                                                </p>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </>
                            }
                        </>
                    }
                </div>
            </div>
        </DashboardLayout>
    );
}