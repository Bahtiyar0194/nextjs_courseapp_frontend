import DashboardLayout from "../../../components/layouts/DashboardLayout";
import TaskAnswerBlock from "../../../components/lesson/lesson_task_modals/task_answer_components/TaskAnswerBlock";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { AiOutlineFileDone, AiOutlineCheck } from "react-icons/ai";
import axios from "axios";
import Link from "next/link";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import ButtonLoader from "../../../components/ui/ButtonLoader";
import TaskBlock from "../../../components/lesson/lesson_task_modals/TaskBlock";
import TaskAnswerBlockTypeModals from "../../../components/lesson/lesson_task_modals/task_answer_components/TaskAnswerBlockTypeModals";
import { useAutoAnimate } from '@formkit/auto-animate/react';

export default function LessonTask() {
    const router = useRouter();
    const [showFullLoader, setShowFullLoader] = useState(true);
    const intl = useIntl();

    const [task, setTask] = useState([]);

    const [error, setError] = useState([]);
    const [button_loader, setButtonLoader] = useState(false);
    const [animateParent, enableAnimations] = useAutoAnimate();

    const task_answer_blocks = useSelector((state) => state.taskAnswerBlocks.task_answer_blocks);

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

    const taskAnswerSubmit = async () => {
        setButtonLoader(true);

        const form_data = new FormData();
        form_data.append('task_answer', document.querySelector('textarea[name="task_answer"]').value);
        form_data.append('task_answer_blocks', JSON.stringify(task_answer_blocks));
        form_data.append('operation_type_id', 19);

        await axios.post('tasks/create_answer/' + task.task_id, form_data)
            .then(response => {
                setError([]);
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 422) {
                        setError(err.response.data.data);
                        setButtonLoader(false);
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
            const { task_id } = router.query;
            getTask(task_id);
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

            <div className="col-span-12 lg:col-span-7">
                <h2 className="mb-2">{task.task_name}</h2>
                <p className="mb-0">{task.task_description}</p>
                <div className="custom-grid">
                    {
                        task.task_blocks?.length > 0 && task.task_blocks?.map((task_block, i) => (
                            <TaskBlock key={i} task_block={task_block} index={i} />
                        ))
                    }
                </div>
            </div>

            <div className="col-span-12 lg:col-span-5">
                {/* <StickyBox offsetTop={6} offsetBottom={6}> */}
                <h4 className="mb-4">{intl.formatMessage({ id: "task.your_answer_to_this_task" })}</h4>

                <div className="form-group-border label-inactive mb-4">
                    <AiOutlineFileDone />
                    <textarea name="task_answer" cols="40" defaultValue="" placeholder=" "></textarea>
                    <label className={error.task_answer && 'label-error'}>{error.task_answer ? error.task_answer : intl.formatMessage({ id: "task.enter_the_answer_to_this_task" })}</label>
                </div>

                {task_answer_blocks.length > 0 &&
                    <div className="custom-grid" ref={animateParent}>
                        {task_answer_blocks.map((answer_block, i) => (
                            <TaskAnswerBlock key={i} task_answer_block={answer_block} index={i} edit={true} />
                        ))}
                    </div>
                }

                <div className="btn-wrap mt-4">
                    <TaskAnswerBlockTypeModals />
                    <button onClick={() => taskAnswerSubmit()} disabled={button_loader} className="btn btn-outline-primary">
                        {button_loader === true ? <ButtonLoader /> : <AiOutlineCheck />}
                        <span>{intl.formatMessage({ id: "done" })}</span>
                    </button>
                </div>
                {/* </StickyBox> */}
            </div>
        </DashboardLayout>
    );
}