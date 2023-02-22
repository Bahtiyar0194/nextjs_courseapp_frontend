import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import parse from 'html-react-parser';
import Modal from "../../../components/ui/Modal";
import CreateAnswerTheQuestionModal from "../../../components/lesson/CreateAnswerTheQuestionModal";
import { AiOutlineCaretDown, AiOutlineQuestionCircle, AiOutlineFileSearch, AiOutlineFileDone, AiOutlineFileAdd } from "react-icons/ai";
import { CDropdown, CDropdownToggle, CDropdownMenu } from "@coreui/react";
import axios from "axios";
import Link from "next/link";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import API_URL from "../../../config/api";
import { Player } from 'video-react';
import "../../../node_modules/video-react/dist/video-react.css";

export default function Lesson() {
    const router = useRouter();
    const [showFullLoader, setShowFullLoader] = useState(true);
    const intl = useIntl();
    const [questionModal, setQuestionModal] = useState(false);
    const [lesson, setLesson] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [src, setSrc] = useState(null);

    const roles = useSelector((state) => state.authUser.roles);

    const getLesson = async (lesson_id) => {
        setShowFullLoader(true);
        await axios.get('lessons/' + lesson_id)
            .then(response => {
                setLesson(response.data);
                if (response.data.lesson_type_id == 2) {
                    let url = API_URL + '/lessons/video/' + lesson_id;
                    setSrc(url)
                }
            }).catch(err => {
                if (err.response) {
                    router.push('/error/' + err.response.status)
                }
                else {
                    router.push('/error')
                }
            });
    }

    const getTasks = async (lesson_id) => {
        await axios.get('tasks/my_tasks/' + lesson_id)
            .then(response => {
                setTimeout(() => {
                    setTasks(response.data);
                    setShowFullLoader(false);
                }, 500)
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
            getTasks(lesson_id);
        }
    }, [router.isReady]);

    return (
        <DashboardLayout showLoader={showFullLoader} title={lesson.lesson_name}>
            {lesson.lesson_id ?
                <>
                    <Breadcrumb>
                        <Link href={'/dashboard/my-courses'}>{intl.formatMessage({ id: "page.my_courses.title" })}</Link>
                        <Link href={'/dashboard/my-courses/' + lesson.course_id}>{lesson.course_name}</Link>
                        {lesson.lesson_name}
                    </Breadcrumb>

                    <div className="col-span-12">
                        <div className="card p-4 lg:p-6">
                            <div className="flex max-lg:flex-col lg:justify-between lg:items-center">
                                <h1 className="mb-0 max-lg:mb-4">{lesson.lesson_name}</h1>
                                <CDropdown>
                                    <CDropdownToggle color="primary" href="#">
                                        {intl.formatMessage({ id: "lesson.add_task" })} <AiOutlineCaretDown className="ml-0.5 h-3 w-3" />
                                    </CDropdownToggle>
                                    <CDropdownMenu>
                                        <Link href={'#'} onClick={() => setQuestionModal(true)}><AiOutlineQuestionCircle /> {intl.formatMessage({ id: "task.answerTheQuestionModal.title" })}</Link>
                                        <Link href={'#'}><AiOutlineFileSearch /> Вставка пропущенных слов</Link>
                                        <Link href={'#'}><AiOutlineFileDone /> Тестовое задание</Link>
                                        <Link href={'#'}><AiOutlineFileAdd /> Приложить файл</Link>
                                    </CDropdownMenu>
                                </CDropdown>
                            </div>
                            <div className="mt-4 mb-6">{parse(lesson.lesson_description)}</div>

                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-12 lg:col-span-6">
                                    <Player
                                        playsInline
                                        src={src}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </>
                :
                <div className="col-span-12">
                    {intl.formatMessage({ id: "loading" })}
                </div>
            }

            {roles.includes(2) &&
                <>
                    <Modal show={questionModal} onClose={() => setQuestionModal(false)} modal_title={intl.formatMessage({ id: "task.answerTheQuestionModal.title" })} modal_size="modal-xl">
                        <CreateAnswerTheQuestionModal closeModal={() => setQuestionModal(false)} lesson_id={lesson.lesson_id} getTasks={getTasks} />
                    </Modal>
                </>
            }
        </DashboardLayout>
    );
}