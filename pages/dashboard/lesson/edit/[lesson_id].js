import DashboardLayout from "../../../../components/layouts/DashboardLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setLessonBlocks, setLessonBlocksCount } from "../../../../store/slices/lessonBlocksSlice";
import { AiOutlineRead, AiOutlineCheck } from "react-icons/ai";
import axios from "axios";
import Link from "next/link";
import Breadcrumb from "../../../../components/ui/Breadcrumb";
import ButtonLoader from "../../../../components/ui/ButtonLoader";
import LessonBlockTypeModals from "../../../../components/lesson/LessonBlockTypeModals";
import LessonBlock from "../../../../components/lesson/LessonBlock";

export default function EditLesson() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [showFullLoader, setShowFullLoader] = useState(true);
    const intl = useIntl();

    const [lesson, setLesson] = useState([]);
    const lesson_blocks = useSelector((state) => state.lessonBlocks.lesson_blocks);
    const roles = useSelector((state) => state.authUser.roles);

    const [error, setError] = useState([]);
    const [button_loader, setButtonLoader] = useState(false);

    const [lesson_name, setLessonName] = useState('');
    const [lesson_description, setLessonDescription] = useState('');

    const getLesson = async (lesson_id) => {
        setShowFullLoader(true);
        await axios.get('lessons/' + lesson_id)
            .then(response => {
                setLesson(response.data.lesson);
                dispatch(setLessonBlocks(response.data.lesson_blocks));
                dispatch(setLessonBlocksCount(response.data.lesson_blocks.length));
                setLessonName(response.data.lesson.lesson_name);
                setLessonDescription(response.data.lesson.lesson_description);
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

    const editLesson = async (lesson_id) => {
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
        form_data.append('lesson_blocks', JSON.stringify(blocks));
        form_data.append('operation_type_id', 10);

        await axios.post('lessons/update/' + lesson_id, form_data)
            .then(response => {
                router.push('/dashboard/lesson/' + lesson_id)
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 422) {
                        setError(err.response.data.data);
                        setButtonLoader(false);
                        if (error.lesson_name || error.lesson_description) {
                            let card = document.querySelector('#edit_wrap');
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
            const { lesson_id } = router.query;
            getLesson(lesson_id);
        }
    }, [router.isReady]);

    return (
        <DashboardLayout showLoader={showFullLoader} title={intl.formatMessage({ id: "lesson.edit_lesson" })}>
            {roles.includes(2) ?
                <>
                    <Breadcrumb>
                        <Link href={'/dashboard/courses'}>{intl.formatMessage({ id: "page.my_courses.title" })}</Link>
                        <Link href={'/dashboard/courses/' + lesson.course_id}>{lesson.course_name}</Link>
                        <Link href={'/dashboard/lesson/' + lesson.lesson_id}>{lesson.lesson_name}</Link>
                        {intl.formatMessage({ id: "lesson.edit_lesson" })}
                    </Breadcrumb>

                    <div id="edit_wrap" className="col-span-12 relative">
                        <div className="form-group mt-2">
                            <AiOutlineRead />
                            <input onInput={e => setLessonName(e.target.value)} type="text" value={lesson_name} placeholder=" " />
                            <label className={(error.lesson_name && 'label-error')}>{error.lesson_name ? error.lesson_name : intl.formatMessage({ id: "lesson_name" })}</label>
                        </div>

                        <div className="form-group mt-2">
                            <AiOutlineRead />
                            <textarea cols="20" onInput={e => setLessonDescription(e.target.value)} value={lesson_description} placeholder=" "></textarea>
                            <label className={(error.lesson_description && 'label-error')}>{error.lesson_description ? error.lesson_description : intl.formatMessage({ id: "lesson_description" })}</label>
                        </div>

                        {lesson_blocks.length > 0 &&
                            lesson_blocks.map((lesson_block, i) => (
                                <LessonBlock key={i} lesson_block={lesson_block} index={i} edit={true} />
                            ))
                        }

                        {error.lesson_blocks && lesson_blocks.length == 0 && <p className="text-danger text-sm mb-4">{intl.formatMessage({ id: "lesson.please_add_materials" })}</p>}

                        <div className="btn-wrap">
                            <LessonBlockTypeModals />
                            <button onClick={e => editLesson(lesson.lesson_id)} className="btn btn-outline-primary" type="submit">
                                {button_loader === true ? <ButtonLoader /> : <AiOutlineCheck />}
                                <span>{intl.formatMessage({ id: "save_changes" })}</span>
                            </button>
                        </div>
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