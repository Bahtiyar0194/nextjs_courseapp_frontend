import DashboardLayout from "../../../../components/layouts/DashboardLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { AiOutlineCaretDown, AiOutlineCheck, AiOutlineFileDone } from "react-icons/ai";
import axios from "axios";
import Link from "next/link";
import Breadcrumb from "../../../../components/ui/Breadcrumb";
import ButtonLoader from "../../../../components/ui/ButtonLoader";
import AddTestQuestionsModal from "../../../../components/lesson/lesson_task_modals/AddTestQuestionsModal";
import Modal from "../../../../components/ui/Modal";
import TestQuestionBlock from "../../../../components/lesson/lesson_task_modals/test_components/TestQuestionBlock";

export default function CreateTest() {
    const router = useRouter();
    const [showFullLoader, setShowFullLoader] = useState(true);
    const intl = useIntl();

    const [lesson, setLesson] = useState([]);
    const roles = useSelector((state) => state.authUser.roles);

    const [error, setError] = useState([]);
    const [button_loader, setButtonLoader] = useState(false);

    const [add_test_questions_modal, setAddTestQuestionsModal] = useState(false);

    const [task_name, setTaskName] = useState('');
    const [task_description, setTaskDescription] = useState('');

    const [test_questions, setTestQuestions] = useState([]);
    const [test_questions_count, setTestQuestionsCount] = useState(test_questions.length);

    const getLesson = async (lesson_id) => {
        setShowFullLoader(true);
        await axios.get('lessons/' + lesson_id)
            .then(response => {
                setLesson(response.data.lesson);
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

    const createTestSubmit = async (lesson_id) => {
        setButtonLoader(true);

        const form_data = new FormData();
        form_data.append('task_name', task_name);
        form_data.append('task_description', task_description);
        form_data.append('task_type_id', 1);
        form_data.append('test_questions', test_questions);
        form_data.append('operation_type_id', 10);

        await axios.post('tasks/create/' + lesson_id, form_data)
            .then(response => {
                //router.push('/dashboard/lesson/' + lesson_id)
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 422) {
                        setError(err.response.data.data);
                        setButtonLoader(false);
                        if (error.task_name || error.task_description) {
                            let card = document.querySelector('#create_wrap');
                            setTimeout(() => {
                                card.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                    inline: "start",
                                });
                            }, 200);
                        }
                    }
                    else {
                        router.push('/error/' + err.response.status)
                    }
                }
                else {
                    router.push('/error/')
                }
            });
    }

    useEffect(() => {
        if (router.isReady) {
            const { lesson_id } = router.query;
            getLesson(lesson_id);
        }
    }, [router.isReady]);

    return (
        <DashboardLayout showLoader={showFullLoader} title={intl.formatMessage({ id: "task.add_test" })}>
            {roles.includes(2) ?
                <>
                    <Breadcrumb>
                        <Link href={'/dashboard/courses'}>{intl.formatMessage({ id: "page.my_courses.title" })}</Link>
                        <Link href={'/dashboard/courses/' + lesson.course_id}>{lesson.course_name}</Link>
                        <Link href={'/dashboard/lesson/' + lesson.lesson_id}>{lesson.lesson_name}</Link>
                        {intl.formatMessage({ id: "task.add_test" })}
                    </Breadcrumb>

                    <div id="create_wrap" className="col-span-12 relative">
                        <div className="form-group mt-2">
                            <AiOutlineFileDone />
                            <input onInput={e => setTaskName(e.target.value)} type="text" value={task_name} placeholder=" " />
                            <label className={(error.task_name && 'label-error')}>{error.task_name ? error.task_name : intl.formatMessage({ id: "task.test_name" })}</label>
                        </div>

                        <div className="form-group mt-2">
                            <AiOutlineFileDone />
                            <textarea cols="20" onInput={e => setTaskDescription(e.target.value)} value={task_description} placeholder=" "></textarea>
                            <label className={(error.task_description && 'label-error')}>{error.task_description ? error.task_description : intl.formatMessage({ id: "task.test_description" })}</label>
                        </div>

                        {error.test_questions && test_questions.length == 0 && <p className="text-danger mb-4">{intl.formatMessage({ id: "task.test.addTestQuestionsModal.please_add_questions" })}</p>}

                        {test_questions.length > 0 &&
                            test_questions.map((test_question, i) => (
                                <TestQuestionBlock
                                    key={i}
                                    index={i}
                                    roles={roles}
                                    intl={intl}
                                    test_questions={test_questions}
                                    setTestquestions={setTestQuestions}
                                    test_question={test_question}
                                    edit={true}
                                />
                            ))
                        }

                        <p className="mb-4">{intl.formatMessage({ id: "task.test.addTestQuestionsModal.count_of_questions" })}: <span className="text-corp">{test_questions.length}</span></p>

                        <div className="btn-wrap">
                            <button onClick={e => setAddTestQuestionsModal(true)} className="btn btn-primary">
                                {intl.formatMessage({ id: "task.test.addTestQuestionsModal.add_questions" })} <AiOutlineCaretDown className="ml-0.5 h-3 w-3" />
                            </button>
                            <button onClick={e => createTestSubmit(lesson.lesson_id)} className="btn btn-outline-primary">
                                {button_loader === true ? <ButtonLoader /> : <AiOutlineCheck />}
                                <span>{intl.formatMessage({ id: "done" })}</span>
                            </button>
                        </div>
                    </div>


                    <Modal show={add_test_questions_modal} onClose={() => setAddTestQuestionsModal(false)} modal_title={intl.formatMessage({ id: "task.test.addTestQuestionsModal.title" })} modal_size="modal-2xl">
                        <AddTestQuestionsModal
                            test_questions={test_questions}
                            setTestQuestions={setTestQuestions}
                            test_questions_count={test_questions_count}
                            setTestQuestionsCount={setTestQuestionsCount}
                            closeModal={() => setAddTestQuestionsModal(false)} />
                    </Modal>
                </>
                :
                <div className="col-span-12">
                    {intl.formatMessage({ id: "loading" })}
                </div>
            }
        </DashboardLayout>
    );
}