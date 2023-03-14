import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLessonBlocks } from "../../../store/slices/lessonBlocksSlice";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import LessonBlock from "../../../components/lesson/LessonBlock";
import LessonTaskTypeModals from "../../../components/lesson/LessonTaskTypeModals";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import Modal from "../../../components/ui/Modal";
import DeleteLessonModal from "../../../components/lesson/DeleteLessonModal";
import StickyBox from "react-sticky-box";

export default function Lesson() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [showFullLoader, setShowFullLoader] = useState(true);
    const intl = useIntl();
    const [lesson, setLesson] = useState([]);
    const lesson_blocks = useSelector((state) => state.lessonBlocks.lesson_blocks);
    const [lesson_tasks, setLessonTasks] = useState([]);
    const [delete_lesson_modal, setDeleteLessonModal] = useState(false);
    const roles = useSelector((state) => state.authUser.roles);

    const getLesson = async (lesson_id) => {
        setShowFullLoader(true);
        await axios.get('lessons/' + lesson_id)
            .then(response => {
                setLesson(response.data.lesson);
                dispatch(setLessonBlocks(response.data.lesson_blocks));
                getLessonTasks(lesson_id);
            }).catch(err => {
                if (err.response) {
                    router.push('/error/' + err.response.status)
                }
                else {
                    router.push('/error')
                }
            });
    }

    const getLessonTasks = async (lesson_id) => {
        await axios.get('tasks/my-tasks/' + lesson_id)
            .then(response => {
                setLessonTasks(response.data);
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

    useEffect(() => {
        if (router.isReady) {
            const { lesson_id } = router.query;
            getLesson(lesson_id);
        }
    }, [router.isReady]);

    return (
        <DashboardLayout showLoader={showFullLoader} title={lesson.lesson_name}>
            {lesson.lesson_id ?
                <>
                    <Breadcrumb>
                        <Link href={'/dashboard/courses'}>{intl.formatMessage({ id: "page.my_courses.title" })}</Link>
                        <Link href={'/dashboard/courses/' + lesson.course_id}>{lesson.course_name}</Link>
                        {lesson.lesson_name}
                    </Breadcrumb>

                    {roles.includes(2) &&
                        <>
                            <div className="col-span-12">
                                <div className="btn-wrap">
                                    <LessonTaskTypeModals lesson_id={lesson.lesson_id} />
                                    <Link className="btn btn-outline-primary" href={'/dashboard/lesson/edit/' + lesson.lesson_id}><AiOutlineEdit /> {intl.formatMessage({ id: "edit" })}</Link>
                                    <button onClick={e => setDeleteLessonModal(true)} className="btn btn-outline-danger"><AiOutlineDelete /> {intl.formatMessage({ id: "delete" })}</button>
                                </div>
                            </div>

                            <Modal show={delete_lesson_modal} onClose={() => setDeleteLessonModal(false)} modal_title={intl.formatMessage({ id: "lesson.deleteLessonModal.title" })} modal_size="modal-xl">
                                <DeleteLessonModal course_id={lesson.course_id} delete_lesson_id={lesson.lesson_id} closeModal={() => setDeleteLessonModal(false)} />
                            </Modal>
                        </>
                    }

                    <div className={'col-span-12 ' + (lesson_tasks.length > 0 && 'lg:col-span-8')}>
                        <div className="card p-3 lg:p-6">
                            <h1>{lesson.lesson_name}</h1>
                            <p className="text-lg mb-6">{lesson.lesson_description}</p>

                            {lesson_blocks.length > 0 && <hr className="mb-6"></hr>}

                            {lesson_blocks.map((lesson_block, i) => (
                                <LessonBlock key={i} lesson_block={lesson_block} index={i} />
                            ))}
                        </div>
                    </div>

                    {lesson_tasks.length > 0 &&
                        <div className="col-span-12 lg:col-span-4">
                            <StickyBox offsetTop={6} offsetBottom={6}>
                                <div className="card p-3 lg:p-6">
                                    <h3 className="mb-1">{intl.formatMessage({ id: "task.tasks_for_this_lesson" })}</h3>
                                    <p className="text-inactive">{intl.formatMessage({ id: "task.number_of_tasks" })}: <span className="font-medium text-corp">{lesson_tasks.length}</span></p>
                                    <hr className="mb-0"></hr>
                                    <ul className="tasks-list-group">
                                        {lesson_tasks.map((lesson_task, i) => (
                                            <li key={i}>
                                                <Link href={"/dashboard/task/" + lesson_task.task_id} className="block">
                                                    <h5 className="mb-1">{lesson_task.task_name}</h5>
                                                    <p className="text-active mb-2">{lesson_task.task_description.substring(0, 200)}{lesson_task.task_description.length > 200 && '...'}</p>
                                                    <span className="badge badge-light">{lesson_task.task_type_name}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </StickyBox>
                        </div>
                    }
                </>
                :
                <div className="col-span-12">
                    {intl.formatMessage({ id: "loading" })}
                </div>
            }
        </DashboardLayout>
    );
}