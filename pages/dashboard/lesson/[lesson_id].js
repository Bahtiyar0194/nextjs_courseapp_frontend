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
import { AiOutlineEdit } from "react-icons/ai";

export default function Lesson() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [showFullLoader, setShowFullLoader] = useState(true);
    const intl = useIntl();
    const [lesson, setLesson] = useState([]);
    const lesson_blocks = useSelector((state) => state.lessonBlocks.lesson_blocks);
    const roles = useSelector((state) => state.authUser.roles);

    const getLesson = async (lesson_id) => {
        setShowFullLoader(true);
        await axios.get('lessons/' + lesson_id)
            .then(response => {
                setLesson(response.data.lesson);
                dispatch(setLessonBlocks(response.data.lesson_blocks));
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

                    <div className="col-span-12 relative">
                        <div className="card p-3 lg:p-6">
                            <h1>{lesson.lesson_name}</h1>
                            <p className="text-lg">{lesson.lesson_description}</p>

                            {lesson_blocks.length > 0 && <hr className="mb-6"></hr>}

                            {lesson_blocks.map((lesson_block, i) => (
                                <LessonBlock key={i} lesson_block={lesson_block} index={i} />
                            ))
                            }
                        </div>
                    </div>

                    <div className="col-span-12">
                        {roles.includes(2) &&
                            <div className="btn-wrap">
                                <LessonTaskTypeModals lesson_id={lesson.lesson_id} />
                                <Link className="btn btn-outline-primary" href={'/dashboard/lesson/edit/' + lesson.lesson_id}><AiOutlineEdit /> {intl.formatMessage({ id: "edit" })}</Link>
                            </div>
                        }
                    </div>
                </>
                :
                <div className="col-span-12">
                    {intl.formatMessage({ id: "loading" })}
                </div>
            }
        </DashboardLayout>
    );
}