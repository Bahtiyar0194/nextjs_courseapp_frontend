import DashboardLayout from "../../../../components/layouts/DashboardLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineCaretDown, AiOutlineCheck, AiOutlineFileDone } from "react-icons/ai";
import axios from "axios";
import Link from "next/link";
import Breadcrumb from "../../../../components/ui/Breadcrumb";
import ButtonLoader from "../../../../components/ui/ButtonLoader";
import Modal from "../../../../components/ui/Modal";
import { scrollIntoView } from "seamless-scroll-polyfill";
import RoleProvider from "../../../../services/RoleProvider";

export default function CreateTask() {
    const router = useRouter();
    const [showFullLoader, setShowFullLoader] = useState(true);
    const intl = useIntl();

    const [lesson, setLesson] = useState([]);

    const [error, setError] = useState([]);
    const [button_loader, setButtonLoader] = useState(false);

    const [task_name, setTaskName] = useState('');
    const [task_description, setTaskDescription] = useState('');

    const getLesson = async (lesson_id) => {
        setShowFullLoader(true);
        await axios.get('lessons/' + lesson_id)
            .then(response => {
                setLesson(response.data.lesson);
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

    const createTaskSubmit = async (lesson_id) => {
        setButtonLoader(true);

        const form_data = new FormData();
        form_data.append('task_name', task_name);
        form_data.append('task_description', task_description);
        form_data.append('task_type_id', 2);
        form_data.append('operation_type_id', 6);

        await axios.post('tasks/create/' + lesson_id, form_data)
            .then(response => {
                router.push('/dashboard/lesson/' + lesson_id);
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 422) {
                        setError(err.response.data.data);
                        setButtonLoader(false);
                        if (error.task_name || error.task_description) {
                            let card = document.querySelector('#create_wrap');
                            setTimeout(() => {
                                scrollIntoView(card, { behavior: "smooth", block: "center", inline: "center" });
                            }, 200);
                        }
                    }
                    else {
                        router.push({
                            pathname: '/error',
                            query: {
                                status: err.response.status,
                                message: err.response.data.message,
                                url: err.request.responseURL,
                            }
                        });
                    }
                }
                else {
                    router.push('/error');
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
        <DashboardLayout showLoader={showFullLoader} title={intl.formatMessage({ id: "task.title" })}>
            <RoleProvider roles={[2]} redirect={true}>
                <Breadcrumb>
                    <Link href={'/dashboard/courses/catalogue'}>{intl.formatMessage({ id: "page.courses_catalogue.title" })}</Link>
                    <Link href={'/dashboard/courses/' + lesson.course_id}>{lesson.course_name}</Link>
                    <Link href={'/dashboard/lesson/' + lesson.lesson_id}>{lesson.lesson_name}</Link>
                    {intl.formatMessage({ id: "task.title" })}
                </Breadcrumb>

                <div className="col-span-12">
                    <div id="create_wrap" className="form-group mt-2">
                        <AiOutlineFileDone />
                        <input onInput={e => setTaskName(e.target.value)} type="text" value={task_name} placeholder=" " />
                        <label className={error.task_name && 'label-error'}>{error.task_name ? error.task_name : intl.formatMessage({ id: "task.task_name" })}</label>
                    </div>

                    <div className="form-group mt-2">
                        <AiOutlineFileDone />
                        <textarea cols="20" onInput={e => setTaskDescription(e.target.value)} value={task_description} placeholder=" "></textarea>
                        <label className={error.task_description && 'label-error'}>{error.task_description ? error.task_description : intl.formatMessage({ id: "task.task_description" })}</label>
                    </div>

                    <div className="btn-wrap">
                        <button onClick={e => addMaterial()} className="btn btn-primary">
                            {intl.formatMessage({ id: "task.test.addTestQuestionsModal.add_questions" })} <AiOutlineCaretDown className="ml-0.5 h-3 w-3" />
                        </button>
                        <button disabled={button_loader} onClick={e => createTaskSubmit(lesson.lesson_id)} className="btn btn-outline-primary">
                            {button_loader === true ? <ButtonLoader /> : <AiOutlineCheck />}
                            <span>{intl.formatMessage({ id: "done" })}</span>
                        </button>
                    </div>
                </div>
            </RoleProvider>
        </DashboardLayout>
    );
}