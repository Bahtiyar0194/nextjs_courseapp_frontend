import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Modal from "../../../components/ui/Modal";
import { CDropdown, CDropdownToggle, CDropdownMenu } from "@coreui/react";
import { AiOutlineCaretDown, AiOutlineFileText, AiOutlinePlayCircle, AiOutlinePushpin } from "react-icons/ai";
import axios from "axios";
import Link from "next/link";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import API_URL from "../../../config/api";

export default function Course() {
    const router = useRouter();
    const [showFullLoader, setShowFullLoader] = useState(true);
    const intl = useIntl();
    const [videoModal, setVideoModal] = useState(false);
    const [sectionModal, setSectionModal] = useState(false);
    const [lesson, setLesson] = useState([]);

    const roles = useSelector((state) => state.authUser.roles);

    const getLesson = async (lesson_id) => {
        setShowFullLoader(true);
        await axios.get('lessons/' + lesson_id)
            .then(response => {
                setLesson(response.data);
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
                        <Link href={'/dashboard/my-courses'}>{intl.formatMessage({ id: "page.my_courses.title" })}</Link>
                        <Link href={'/dashboard/my-courses/' + lesson.course_id}>{lesson.course_name}</Link>
                        {lesson.lesson_name}
                    </Breadcrumb>
                    <div className="col-span-12">
                        <div className="card p-4">
                            <h2>{lesson.lesson_name}</h2>
                            <p className="text-justify">{lesson.lesson_description}</p>
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
                    <Modal show={videoModal} onClose={() => setVideoModal(false)} modal_title={intl.formatMessage({ id: "videoLessonModal.title" })} modal_size="modal-xl">
                        <CreateVideoLessonModal closeModal={() => setVideoModal(false)} course_id={course.course_id} getLessons={getLessons} />
                    </Modal>

                    <Modal show={sectionModal} onClose={() => setSectionModal(false)} modal_title={intl.formatMessage({ id: "courseSectionModal.title" })} modal_size="modal-xl">
                        <CreateCourseSectionModal closeModal={() => setSectionModal(false)} course_id={course.course_id} getLessons={getLessons} />
                    </Modal>
                </>
            }
        </DashboardLayout>
    );
}