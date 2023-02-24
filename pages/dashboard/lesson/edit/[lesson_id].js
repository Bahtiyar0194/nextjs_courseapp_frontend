import DashboardLayout from "../../../../components/layouts/DashboardLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Modal from "../../../../components/ui/Modal";
import { AiOutlineCaretDown, AiOutlinePlayCircle, AiOutlineRead, AiOutlineCheck, AiOutlineFileText } from "react-icons/ai";
import { CDropdown, CDropdownToggle, CDropdownMenu } from "@coreui/react";
import axios from "axios";
import Link from "next/link";
import Breadcrumb from "../../../../components/ui/Breadcrumb";
import Loader from "../../../../components/ui/Loader";
import TextEditorModal from "../../../../components/lesson/TextEditorModal";
import CreateVideoModal from "../../../../components/lesson/CreateVideoModal";
import LessonBlock from "../../../../components/lesson/LessonBlock";

export default function CreateLesson() {
    const router = useRouter();
    const [showFullLoader, setShowFullLoader] = useState(true);
    const intl = useIntl();

    const [textModal, setTextModal] = useState(false);
    const [videoModal, setVideoModal] = useState(false);

    const [course, setCourse] = useState([]);
    const roles = useSelector((state) => state.authUser.roles);

    const [error, setError] = useState([]);
    const [loader, setLoader] = useState(false);

    const [lesson_name, setLessonName] = useState('');
    const [lesson_description, setLessonDescription] = useState('');

    const [lesson_blocks, setLessonBlocks] = useState([]);

    const getCourse = async (course_id) => {
        setShowFullLoader(true);
        await axios.get('courses/my-courses/' + course_id)
            .then(response => {
                setCourse(response.data);
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

    const addLesson = async (course_id) => {
        setLoader(true);
        const form_data = new FormData();
        form_data.append('lesson_name', lesson_name);
        form_data.append('lesson_description', lesson_description);
        form_data.append('lesson_type_id', 1);
        form_data.append('course_id', course_id);
        form_data.append('lesson_blocks', JSON.stringify(lesson_blocks));
        form_data.append('operation_type_id', 4);

        await axios.post('lessons/create', form_data)
            .then(response => {
                router.push('/dashboard/lesson/' + response.data.data.lesson_id)
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 422) {
                        setError(err.response.data.data);
                        setLoader(false);
                        if (error.lesson_name || error.lesson_description) {
                            let card = document.querySelector('.card');
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
            const { course_id } = router.query;
            getCourse(course_id);
        }
    }, [router.isReady]);

    return (
        <DashboardLayout showLoader={showFullLoader} title={intl.formatMessage({ id: "lesson.create_lesson" })}>
            {roles.includes(2) ?
                <>
                    <Breadcrumb>
                        <Link href={'/dashboard/my-courses'}>{intl.formatMessage({ id: "page.my_courses.title" })}</Link>
                        <Link href={'/dashboard/my-courses/' + course.course_id}>{course.course_name}</Link>
                        {intl.formatMessage({ id: "lesson.create_lesson" })}
                    </Breadcrumb>



                    <div className="col-span-12 relative">
                        {loader && <Loader className="overlay" />}
                        <div className="card px-4 py-4">
                            <div className="form-group mt-2">
                                <AiOutlineRead />
                                <input onInput={e => setLessonName(e.target.value)} type="text" value={lesson_name} placeholder=" " />
                                <label className={(error.lesson_name && 'label-error')}>{error.lesson_name ? error.lesson_name : intl.formatMessage({ id: "lesson_name" })}</label>
                            </div>

                            <div className="form-group mt-2">
                                <AiOutlineRead />
                                <textarea onInput={e => setLessonDescription(e.target.value)} value={lesson_description} placeholder=" "></textarea>
                                <label className={(error.lesson_description && 'label-error')}>{error.lesson_description ? error.lesson_description : intl.formatMessage({ id: "lesson_description" })}</label>
                            </div>

                            {lesson_blocks.length > 0 &&
                                lesson_blocks.map((lesson_block, i) => (
                                    <LessonBlock key={i} lesson_block={lesson_block} lesson_blocks={lesson_blocks} setLessonBlocks={setLessonBlocks} index={i} edit={true} />
                                ))
                            }

                            {error.lesson_blocks && lesson_blocks.length == 0 && <p className="text-danger text-sm mb-4">{intl.formatMessage({ id: "lesson.please_add_materials" })}</p>}

                            <div className="flex">
                                <CDropdown>
                                    <CDropdownToggle color="primary" href="#">
                                        {intl.formatMessage({ id: "lesson.add_material" })} <AiOutlineCaretDown className="ml-0.5 h-3 w-3" />
                                    </CDropdownToggle>
                                    <CDropdownMenu>
                                        <Link href={'#'} onClick={() => setTextModal(true)}><AiOutlineFileText />{intl.formatMessage({ id: "text_content" })}</Link>
                                        <Link href={'#'} onClick={() => setVideoModal(true)}><AiOutlinePlayCircle />{intl.formatMessage({ id: "videoModal.video" })}</Link>
                                    </CDropdownMenu>
                                </CDropdown>

                                <button onClick={e => addLesson(course.course_id)} className="ml-2 btn btn-outline-primary" type="submit"><AiOutlineCheck /> <span>{intl.formatMessage({ id: "done" })}</span></button>
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
                    <Modal show={textModal} onClose={() => setTextModal(false)} modal_title={intl.formatMessage({ id: "textModal.title" })} modal_size="modal-4xl">
                        <TextEditorModal closeModal={() => setTextModal(false)} lesson_blocks={lesson_blocks} setLessonBlocks={setLessonBlocks} />
                    </Modal>

                    <Modal show={videoModal} onClose={() => setVideoModal(false)} modal_title={intl.formatMessage({ id: "videoModal.title" })} modal_size="modal-2xl">
                        <CreateVideoModal closeModal={() => setVideoModal(false)} lesson_blocks={lesson_blocks} setLessonBlocks={setLessonBlocks} />
                    </Modal>
                </>
            }
        </DashboardLayout>
    );
}