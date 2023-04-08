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
import { AiOutlineDelete, AiOutlineEdit, AiOutlineLeftCircle, AiOutlineRightCircle } from "react-icons/ai";
import Modal from "../../../components/ui/Modal";
import DeleteLessonModal from "../../../components/lesson/DeleteLessonModal";
import StickyBox from "react-sticky-box";
import RoleProvider from "../../../services/RoleProvider";

export default function Lesson() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [showFullLoader, setShowFullLoader] = useState(true);
    const intl = useIntl();
    const [lesson, setLesson] = useState([]);
    const lesson_blocks = useSelector((state) => state.lessonBlocks.lesson_blocks);
    const [lesson_tasks, setLessonTasks] = useState([]);
    const [delete_lesson_modal, setDeleteLessonModal] = useState(false);

    const getLesson = async (lesson_id) => {
        setShowFullLoader(true);
        await axios.get('lessons/' + lesson_id)
            .then(response => {
                setLesson(response.data.lesson);
                dispatch(setLessonBlocks(response.data.lesson_blocks));
                getLessonTasks(lesson_id);
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

    const getNextLesson = (lesson_id) => {
        getLesson(lesson_id);
        router.push('/dashboard/lesson/' + lesson_id);
    }

    const getLessonTasks = async (lesson_id) => {
        await axios.get('tasks/my-tasks/' + lesson_id)
            .then(response => {
                setLessonTasks(response.data);
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
            const { lesson_id } = router.query;
            getLesson(lesson_id);
        }
    }, [router.isReady]);

    return (
        <DashboardLayout showLoader={showFullLoader} title={lesson.lesson_name}>
            {lesson.lesson_id
                ?
                <>
                    {lesson.subscribed == true
                        ?
                        <>
                            <Breadcrumb>
                                {lesson.subscribed == true
                                    ?
                                    <Link href={'/dashboard/courses/my-courses'}>{intl.formatMessage({ id: "page.my_courses.title" })}</Link>
                                    :
                                    <Link href={'/dashboard/courses/catalogue'}>{intl.formatMessage({ id: "page.courses_catalogue.title" })}</Link>
                                }
                                <Link href={'/dashboard/courses/' + lesson.course_id}>{lesson.course_name}</Link>
                                {lesson.lesson_name}
                            </Breadcrumb>

                            <RoleProvider roles={[2]}>
                                <div className="col-span-12">
                                    <div className="btn-wrap">
                                        <LessonTaskTypeModals lesson_id={lesson.lesson_id} />
                                        <Link className="btn btn-outline-primary" href={'/dashboard/lesson/edit/' + lesson.lesson_id}><AiOutlineEdit /> {intl.formatMessage({ id: "edit" })}</Link>
                                        <button onClick={e => setDeleteLessonModal(true)} className="btn btn-outline-danger"><AiOutlineDelete /> {intl.formatMessage({ id: "delete" })}</button>
                                    </div>
                                </div>

                                <Modal show={delete_lesson_modal} onClose={() => setDeleteLessonModal(false)} modal_title={intl.formatMessage({ id: "lesson.deleteLessonModal.title" })} modal_size="modal-xl">
                                    <DeleteLessonModal course_id={lesson.course_id} delete_lesson_id={lesson.lesson_id} redirect={true} getLessons={false} closeModal={() => setDeleteLessonModal(false)} />
                                </Modal>
                            </RoleProvider>

                            <div className={'col-span-12 ' + (lesson_tasks.length > 0 && 'lg:col-span-8')}>
                                <h1>{lesson.lesson_name}</h1>
                                <p className="text-lg mb-6">{lesson.lesson_description}</p>

                                {lesson_blocks.length > 0 && <hr className="mb-6"></hr>}
                                <div className="custom-grid">
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
                                                        <Link href={
                                                            lesson_task.task_type_id == 1
                                                                ?
                                                                "/dashboard/test/" + lesson_task.task_id
                                                                :
                                                                "/dashboard/task/" + lesson_task.task_id
                                                        } className="block">
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

                            <div className="col-span-12">
                                <div className="btn-wrap">
                                    {lesson.previous_lesson && <button className="btn btn-light" onClick={e => getNextLesson(lesson.previous_lesson.lesson_id)}><AiOutlineLeftCircle className="mr-1" /> {intl.formatMessage({ id: "lesson.previous_lesson" })} - <b>{lesson.previous_lesson.lesson_name}</b></button>}
                                    {lesson.next_lesson && <button className="btn btn-outline-primary" onClick={e => getNextLesson(lesson.next_lesson.lesson_id)}><AiOutlineRightCircle className="mr-1" /> {intl.formatMessage({ id: "lesson.next_lesson" })} - <b>{lesson.next_lesson.lesson_name}</b></button>}
                                </div>
                            </div>
                        </>
                        :
                        <div className="col-span-12">
                            {intl.formatMessage({ id: "page.my_courses.you_are_not_subscribed_to_this_course" })}
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