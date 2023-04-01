import DashboardLayout from "../../../../components/layouts/DashboardLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setLessonBlocks, setLessonBlocksCount } from "../../../../store/slices/lessonBlocksSlice";
import { useRouter } from "next/router";
import { AiOutlineRead, AiOutlineCheck } from "react-icons/ai";
import axios from "axios";
import Link from "next/link";
import Breadcrumb from "../../../../components/ui/Breadcrumb";
import ButtonLoader from "../../../../components/ui/ButtonLoader";
import LessonBlockTypeModals from "../../../../components/lesson/LessonBlockTypeModals";
import LessonBlock from "../../../../components/lesson/LessonBlock";
import { scrollIntoView } from "seamless-scroll-polyfill";
import RoleProvider from "../../../../services/RoleProvider";
import { useAutoAnimate } from '@formkit/auto-animate/react';

export default function CreateLesson() {
    const router = useRouter();
    const [showFullLoader, setShowFullLoader] = useState(true);
    const intl = useIntl();

    const [course, setCourse] = useState([]);

    const [error, setError] = useState([]);
    const [button_loader, setButtonLoader] = useState(false);

    const [lesson_name, setLessonName] = useState('');
    const [lesson_description, setLessonDescription] = useState('');

    const dispatch = useDispatch();
    const lesson_blocks = useSelector((state) => state.lessonBlocks.lesson_blocks);
    const [animateParent, enableAnimations] = useAutoAnimate();

    const getCourse = async (course_id) => {
        setShowFullLoader(true);
        await axios.get('courses/my-courses/' + course_id)
            .then(response => {
                setCourse(response.data);
                dispatch(setLessonBlocks([]));
                dispatch(setLessonBlocksCount(0));
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

    const addLesson = async (course_id) => {
        setButtonLoader(true);

        let blocks = JSON.parse(JSON.stringify(lesson_blocks));

        for (let index = 0; index < blocks.length; index++) {
            let lesson_block = blocks[index];
            if (lesson_block.block_type_id == 5) {
                let block = document.querySelector('#block_' + lesson_block.block_id);
                let table = block.querySelector('.table').outerHTML;
                blocks[index].content = table;
            }
        }

        const form_data = new FormData();
        form_data.append('lesson_name', lesson_name);
        form_data.append('lesson_description', lesson_description);
        form_data.append('lesson_type_id', 1);
        form_data.append('course_id', course_id);
        form_data.append('lesson_blocks', JSON.stringify(blocks));
        form_data.append('operation_type_id', 4);

        await axios.post('lessons/create', form_data)
            .then(response => {
                router.push('/dashboard/lesson/' + response.data.data.lesson_id)
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 422) {
                        setError(err.response.data.data);
                        setButtonLoader(false);
                        if (error.lesson_name || error.lesson_description) {
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
            const { course_id } = router.query;
            getCourse(course_id);
        }
    }, [router.isReady]);

    return (
        <DashboardLayout showLoader={showFullLoader} title={intl.formatMessage({ id: "lesson.create_lesson" })}>
            <RoleProvider roles={[2]} redirect={true}>
                <Breadcrumb>
                    <Link href={'/dashboard/courses/catalogue'}>{intl.formatMessage({ id: "page.courses_catalogue.title" })}</Link>
                    <Link href={'/dashboard/courses/' + course.course_id}>{course.course_name}</Link>
                    {intl.formatMessage({ id: "lesson.create_lesson" })}
                </Breadcrumb>
                <div className="col-span-12">
                    <div id="create_wrap" className="form-group mt-2">
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
                        <div className="custom-grid" ref={animateParent}>
                            {lesson_blocks.map((lesson_block, i) => (
                                <LessonBlock key={i} lesson_block={lesson_block} index={i} edit={true} />
                            ))}
                        </div>
                    }

                    {error.lesson_blocks && lesson_blocks.length == 0 && <p className="text-danger text-sm mb-4">{intl.formatMessage({ id: "lesson.please_add_materials" })}</p>}

                    <div className="btn-wrap mt-4">
                        <LessonBlockTypeModals />
                        <button disabled={button_loader} onClick={e => addLesson(course.course_id)} className="btn btn-outline-primary" type="submit">
                            {button_loader === true ? <ButtonLoader /> : <AiOutlineCheck />}
                            <span>{intl.formatMessage({ id: "done" })}</span>
                        </button>
                    </div>
                </div>
            </RoleProvider>
        </DashboardLayout>
    );
}