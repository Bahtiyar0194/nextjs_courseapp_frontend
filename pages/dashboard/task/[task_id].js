import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { AiOutlineFileDone, AiOutlineCheck } from "react-icons/ai";
import axios from "axios";
import Link from "next/link";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import ButtonLoader from "../../../components/ui/ButtonLoader";
import TaskBlock from "../../../components/lesson/lesson_task_modals/TaskBlock";
import StickyBox from "react-sticky-box";

export default function LessonTask() {
    const router = useRouter();
    const [showFullLoader, setShowFullLoader] = useState(true);
    const intl = useIntl();

    const [task, setTask] = useState([]);
    const [task_answer, setTaskAnswer] = useState([]);

    const [error, setError] = useState([]);
    const [button_loader, setButtonLoader] = useState(false);

    const getTask = async (task_id) => {
        setShowFullLoader(true);
        await axios.get('tasks/' + task_id)
            .then(response => {
                setTask(response.data);
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

    useEffect(() => {
        if (router.isReady) {
            const { task_id } = router.query;
            getTask(task_id);
        }
    }, [router.isReady]);

    return (
        task.task_id ?
            <DashboardLayout showLoader={showFullLoader} title={task.task_name}>
                <Breadcrumb>
                    <Link href={'/dashboard/courses/catalogue'}>{intl.formatMessage({ id: "page.courses_catalogue.title" })}</Link>
                    <Link href={'/dashboard/courses/' + task.course_id}>{task.course_name}</Link>
                    <Link href={'/dashboard/lesson/' + task.lesson_id}>{task.lesson_name}</Link>
                    {task.task_name}
                </Breadcrumb>

                <div className="col-span-12 lg:col-span-8">
                    <div className="card p-3 lg:p-6">
                        <h2 className="mb-2">{task.task_name}</h2>
                        <p className="mb-4">{task.task_description}</p>
                        <div className="custom-grid">
                            {
                                task.task_blocks?.length > 0 && task.task_blocks?.map((task_block, i) => (
                                    <TaskBlock key={i} task_block={task_block} index={i} />
                                ))
                            }
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-4">
                    <StickyBox offsetTop={6} offsetBottom={6}>
                        <div className="card p-3 lg:p-6">
                            <h4 className="mb-4">{intl.formatMessage({ id: "task.your_answer_to_this_task" })}</h4>

                            <div className="form-group mt-2">
                                <AiOutlineFileDone />
                                <textarea cols="40" onInput={e => setTaskAnswer(e.target.value)} value={task_answer} placeholder=" "></textarea>
                                <label className={error.task_description && 'label-error'}>{error.task_answer ? error.task_answer : intl.formatMessage({ id: "task.enter_the_answer_to_this_task" })}</label>
                            </div>

                            <button disabled={button_loader} onClick={e => createTaskSubmit(lesson.lesson_id)} className="btn btn-outline-primary">
                                {button_loader === true ? <ButtonLoader /> : <AiOutlineCheck />}
                                <span>{intl.formatMessage({ id: "done" })}</span>
                            </button>
                        </div>
                    </StickyBox>
                </div>
            </DashboardLayout>
            :
            <div className="col-span-12">
                {intl.formatMessage({ id: "loading" })}
            </div>
    );
}