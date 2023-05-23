import dynamic from 'next/dynamic';
import DashboardLayout from '../../../../components/layouts/DashboardLayout';
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { AiOutlineRead, AiOutlineCheck, AiOutlineFlag, AiOutlinePicture, AiOutlineVideoCamera, AiOutlineRise, AiOutlineUser, AiOutlineDollar, } from "react-icons/ai";
import axios from "axios";
import Link from "next/link";
import Breadcrumb from '../../../../components/ui/Breadcrumb';
import ButtonLoader from '../../../../components/ui/ButtonLoader';
import { scrollIntoView } from "seamless-scroll-polyfill";
import RoleProvider from '../../../../services/RoleProvider';
import AddTag from '../../../../components/ui/AddTag';
import FileUploadButton from '../../../../components/ui/FileUploadButton';
import API_URL from '../../../../config/api';
import { Player, BigPlayButton, LoadingSpinner } from 'video-react';
import "../../../../node_modules/video-react/dist/video-react.css";

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
})

export default function EditCourse() {
    const [showFullLoader, setShowFullLoader] = useState(true);
    const router = useRouter();
    const { locale } = router;
    const intl = useIntl();
    const [course, setCourse] = useState([]);

    const [error, setError] = useState([]);
    const [button_loader, setButtonLoader] = useState(false);

    const [course_attributes, setCourseAttributes] = useState([]);
    const [course_skills, setCourseSkills] = useState([]);
    const [course_suitables, setCourseSuitables] = useState([]);
    const [course_requirements, setCourseRequirements] = useState([]);

    const [old_course_poster, setOldCoursePoster] = useState(false);
    const [new_course_poster, setNewCoursePoster] = useState('');

    const [old_course_trailer, setOldCourseTrailer] = useState(false);
    const [new_course_trailer, setNewCourseTrailer] = useState('');


    const [course_free, setCourseFree] = useState(false);
    const [text, setText] = useState('');

    const modules = {
        toolbar: [
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
            ]
        ],
        clipboard: {
            matchVisual: false,
        },
    }
    /*
     * Quill editor formats
     * See https://quilljs.com/docs/formats/
     */
    const formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent'
    ];

    const editCourseSubmit = async (e) => {
        e.preventDefault();
        setButtonLoader(true);

        const form_data = new FormData();
        form_data.append('course_name', document.querySelector('input[name="course_name"]').value);
        form_data.append('course_description', document.querySelector('textarea[name="course_description"]').value);
        form_data.append('course_content', text);
        form_data.append('course_category_id', document.querySelector('select[name="course_category_id"]').value);
        form_data.append('course_lang_id', document.querySelector('select[name="course_lang_id"]').value);
        form_data.append('level_type_id', document.querySelector('select[name="level_type_id"]').value);
        form_data.append('author_id', document.querySelector('select[name="author_id"]').value);

        form_data.append('old_course_poster', old_course_poster);
        form_data.append('new_course_poster_file', new_course_poster);

        form_data.append('old_course_trailer', old_course_trailer);
        form_data.append('new_course_trailer_file', new_course_trailer);

        if (course_free === false) {
            form_data.append('course_cost', document.querySelector('input[name="course_cost"]').value);
        }

        form_data.append('course_free', course_free);
        form_data.append('course_skills', JSON.stringify(course_skills));
        form_data.append('course_suitables', JSON.stringify(course_suitables));
        form_data.append('course_requirements', JSON.stringify(course_requirements));
        form_data.append('operation_type_id', 16);

        await axios.post('courses/update/' + course.course_id, form_data)
            .then(response => {
                router.push('/dashboard/courses/' + response.data.data.course_id);
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 422) {
                        setError(err.response.data.data);
                        let card = document.querySelector('#create_wrap');
                        setTimeout(() => {
                            scrollIntoView(card, { behavior: "smooth", block: "center", inline: "center" });
                        }, 200);
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

    const getCourseAttributes = async () => {
        setShowFullLoader(true);
        await axios.get('courses/get_course_attributes')
            .then(response => {
                setCourseAttributes(response.data);
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

    const getCourse = async (course_id) => {
        await axios.get('courses/my-courses/' + course_id)
            .then(response => {
                setCourse(response.data);
                setText(response.data.course_content);
                setCourseSkills(response.data.skills);
                setCourseSuitables(response.data.suitables);
                setCourseRequirements(response.data.requirements);

                if (response.data.course_poster_file) {
                    setOldCoursePoster(true);
                }

                if (response.data.course_trailer_file) {
                    setOldCourseTrailer(true);
                }

                if (response.data.course_cost == 0) {
                    setCourseFree(true);
                }
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
            const { course_id } = router.query;
            getCourseAttributes();
            getCourse(course_id);
        }
    }, [router.isReady]);

    return (
        <DashboardLayout showLoader={showFullLoader} title={intl.formatMessage({ id: "page.my_courses.form.course_edit_title" })}>
            <RoleProvider roles={[2]} redirect={true}>
                <Breadcrumb>
                    <Link href={'/dashboard/courses/catalogue'}>{intl.formatMessage({ id: "page.courses_catalogue.title" })}</Link>
                    <Link href={'/dashboard/courses/' + course.course_id}>{course.course_name}</Link>
                    {intl.formatMessage({ id: "page.my_courses.form.course_edit_title" })}
                </Breadcrumb>
                <div className="col-span-12">
                    <form onSubmit={e => editCourseSubmit(e)} encType="multipart/form-data">
                        <div className='custom-grid'>
                            <div id="create_wrap" className="col-span-12">
                                <div className="form-group-border active label-inactive">
                                    <AiOutlineRead />
                                    <input autoComplete="new-course-name" type="text" defaultValue={course?.course_name} name="course_name" placeholder=" " />
                                    <label className={(error.course_name && 'label-error')}>{error.course_name ? error.course_name : intl.formatMessage({ id: "page.my_courses.form.course_name" })}</label>
                                </div>
                            </div>
                            <div className="col-span-12">
                                <div className="form-group-border active label-inactive">
                                    <AiOutlineRead />
                                    <textarea autoComplete="new-course-description" type="text" defaultValue={course?.course_description} name="course_description" placeholder=" "></textarea>
                                    <label className={(error.course_description && 'label-error')}>{error.course_description ? error.course_description : intl.formatMessage({ id: "page.my_courses.form.course_description" })}</label>
                                </div>
                            </div>
                            <div className="col-span-12">
                                <div className="relative">
                                    <QuillNoSSRWrapper className={'inactive ' + locale} value={text} onChange={setText} placeholder={intl.formatMessage({ id: "textModal.write_here" })} modules={modules} formats={formats} theme="snow" />
                                    <label className={(error.course_content && 'label-error')}>{error.course_content ? error.course_content : intl.formatMessage({ id: "page.my_courses.form.course_content" })}</label>
                                </div>
                            </div>
                            <div className="col-span-12 lg:col-span-3">
                                <div className="form-group-border active label-inactive">
                                    <AiOutlineRead />
                                    <select name="course_category_id" defaultValue={''} >
                                        <option disabled value="">{intl.formatMessage({ id: "page.my_courses.form.select_course_category" })}</option>
                                        {
                                            course_attributes.course_categories?.map(category => (
                                                <option selected={category.course_category_id === course.course_category_id} key={category.course_category_id} value={category.course_category_id}>{category.course_category_name}</option>
                                            ))
                                        }
                                    </select>
                                    <label className={(error.course_category_id && 'label-error')}>{error.course_category_id ? error.course_category_id : intl.formatMessage({ id: "page.my_courses.form.course_category" })}</label>
                                </div>
                            </div>
                            <div className="col-span-12 lg:col-span-3">
                                <div className="form-group-border active label-inactive">
                                    <AiOutlineFlag />
                                    <select name="course_lang_id" defaultValue={''} >
                                        <option disabled value="">{intl.formatMessage({ id: "page.my_courses.form.select_course_language" })}</option>
                                        {
                                            course_attributes.course_languages?.map(language => (
                                                <option selected={language.lang_id == course.course_lang_id} key={language.lang_id} value={language.lang_id}>{language.lang_name}</option>
                                            ))
                                        }
                                    </select>
                                    <label className={(error.course_lang_id && 'label-error')}>{error.course_lang_id ? error.course_lang_id : intl.formatMessage({ id: "page.my_courses.form.course_language" })}</label>
                                </div>
                            </div>
                            <div className="col-span-12 lg:col-span-3">
                                <div className="form-group-border active label-inactive">
                                    <AiOutlineRise />
                                    <select name="level_type_id" defaultValue={''} >
                                        <option disabled value="">{intl.formatMessage({ id: "page.my_courses.form.select_course_level" })}</option>
                                        {
                                            course_attributes.course_levels?.map(level => (
                                                <option selected={level.level_type_id === course.level_type_id} key={level.level_type_id} value={level.level_type_id}>{level.level_type_name}</option>
                                            ))
                                        }
                                    </select>
                                    <label className={(error.level_type_id && 'label-error')}>{error.level_type_id ? error.level_type_id : intl.formatMessage({ id: "page.my_courses.form.course_level" })}</label>
                                </div>
                            </div>
                            <div className="col-span-12 lg:col-span-3">
                                <div className="form-group-border active label-inactive">
                                    <AiOutlineUser />
                                    <select name="author_id" defaultValue={''} >
                                        <option disabled value="">{intl.formatMessage({ id: "page.my_courses.form.select_course_author" })}</option>
                                        {
                                            course_attributes.course_authors?.map(author => (
                                                <option selected={author.user_id === course.author_id} key={author.user_id} value={author.user_id}>{author.last_name} {author.first_name}</option>
                                            ))
                                        }
                                    </select>
                                    <label className={(error.author_id && 'label-error')}>{error.author_id ? error.author_id : intl.formatMessage({ id: "page.my_courses.form.course_author" })}</label>
                                </div>
                            </div>
                            <div className="col-span-12 lg:col-span-4 relative">
                                <AddTag items={course_skills} setItems={setCourseSkills} className={"inactive p-4"} tagClass={"tag-outline-primary"} tagInputId={"add-skill-input"} label={"page.my_courses.form.what_skills_will_this_course_provide"} />
                            </div>
                            <div className="col-span-12 lg:col-span-4 relative">
                                <AddTag items={course_suitables} setItems={setCourseSuitables} className={"inactive p-4"} tagClass={"tag-outline-primary"} tagInputId={"add-suitable-input"} label={"page.my_courses.form.who_is_suitable_for_this_course"} />
                            </div>
                            <div className="col-span-12 lg:col-span-4 relative">
                                <AddTag items={course_requirements} setItems={setCourseRequirements} className={"inactive p-4"} tagClass={"tag-outline-primary"} tagInputId={"add-requirement-input"} label={"page.my_courses.form.what_are_the_requirements_of_this_course"} />
                            </div>
                            <div className="col-span-12 lg:col-span-6">
                                {old_course_poster === false
                                    ?
                                    <FileUploadButton
                                        item={new_course_poster}
                                        trigger={setNewCoursePoster}
                                        id={"new_course_poster_file"}
                                        accept={"image/*"}
                                        error={error.new_course_poster_file}
                                        icon={<AiOutlinePicture />}
                                        label={intl.formatMessage({ id: "page.my_courses.form.course_poster" })}
                                    />
                                    :
                                    <div className='card card-inactive p-4'>
                                        <div className='custom-grid'>
                                            <div className='col-span-12 lg:col-span-5'>
                                                <img className="w-full border-active rounded-lg" src={API_URL + '/courses/images/posters/' + course.course_poster_file} />
                                            </div>
                                            <div className='col-span-12 lg:col-span-7'>
                                                <h4>{intl.formatMessage({ id: "page.my_courses.form.current_course_poster" })}</h4>
                                                <button onClick={e => setOldCoursePoster(false)} type='button' className='btn btn-sm btn-light'><AiOutlinePicture /> <span>{intl.formatMessage({ id: "page.my_courses.form.change_course_poster" })}</span></button>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="col-span-12 lg:col-span-6">
                                {old_course_trailer === false
                                    ?
                                    <FileUploadButton
                                        item={new_course_trailer}
                                        trigger={setNewCourseTrailer}
                                        id={"new_course_trailer_file"}
                                        accept={"video/*"}
                                        error={error.new_course_trailer_file}
                                        icon={<AiOutlineVideoCamera />}
                                        label={intl.formatMessage({ id: "page.my_courses.form.course_trailer" })}
                                    />
                                    :
                                    <div className='card card-inactive p-4'>
                                        <div className='custom-grid'>
                                            <div className='col-span-12 lg:col-span-6'>
                                                <Player className={router.locale} poster={API_URL + '/courses/images/posters/' + course.course_poster_file} playsInline src={API_URL + '/courses/videos/trailers/' + course.course_trailer_file}>
                                                    <BigPlayButton position="center" />
                                                    <LoadingSpinner />
                                                </Player>
                                            </div>
                                            <div className='col-span-12 lg:col-span-6'>
                                                <h4>{intl.formatMessage({ id: "page.my_courses.form.current_course_trailer" })}</h4>
                                                <button onClick={e => setOldCourseTrailer(false)} type='button' className='btn btn-sm btn-light'><AiOutlinePicture /> <span>{intl.formatMessage({ id: "page.my_courses.form.change_course_trailer" })}</span></button>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className='col-span-12'>
                                {!course_free &&
                                    <div className="form-group-border active label-inactive mb-6">
                                        <AiOutlineDollar />
                                        <input name="course_cost" type="number" defaultValue={course.course_cost} placeholder=" " />
                                        <label className={(error.course_cost && 'label-error')}>{error.course_cost ? error.course_cost : intl.formatMessage({ id: "page.my_courses.form.course_cost" })}, &#8376;</label>
                                    </div>
                                }

                                <label className="custom-checkbox">
                                    <input checked={course_free} onChange={e => setCourseFree(!course_free)} type="checkbox" />
                                    <span>{intl.formatMessage({ id: "page.my_courses.form.free_course" })}</span>
                                </label>

                                <div className="btn-wrap mt-6">
                                    <button disabled={button_loader} className="btn btn-outline-primary" type="submit">
                                        {button_loader === true ? <ButtonLoader /> : <AiOutlineCheck />}
                                        <span>{intl.formatMessage({ id: "done" })}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </RoleProvider>
        </DashboardLayout>
    );
}