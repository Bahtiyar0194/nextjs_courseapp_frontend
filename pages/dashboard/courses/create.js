import dynamic from 'next/dynamic';
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { AiOutlineRead, AiOutlineCheck, AiOutlineFlag, AiOutlinePicture, AiOutlineVideoCamera, AiOutlineRise, AiOutlineUser, AiOutlineDollar, AiOutlinePlusCircle, AiOutlineDelete, } from "react-icons/ai";
import axios from "axios";
import Link from "next/link";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import ButtonLoader from "../../../components/ui/ButtonLoader";
import { scrollIntoView } from "seamless-scroll-polyfill";
import RoleProvider from "../../../services/RoleProvider";
import AddTag from '../../../components/ui/AddTag';
import FileUploadButton from '../../../components/ui/FileUploadButton';
import UserAvatar from '../../../components/ui/UserAvatar';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
})

export default function CreateCourse() {
    const [showFullLoader, setShowFullLoader] = useState(true);
    const router = useRouter();
    const { locale } = router;
    const intl = useIntl();

    const [error, setError] = useState([]);
    const [button_loader, setButtonLoader] = useState(false);

    const [course_attributes, setCourseAttributes] = useState([]);
    const [course_skills, setCourseSkills] = useState([]);
    const [course_suitables, setCourseSuitables] = useState([]);
    const [course_requirements, setCourseRequirements] = useState([]);
    const [course_poster, setCoursePoster] = useState('');
    const [course_trailer, setCourseTrailer] = useState('');
    const [course_free, setCourseFree] = useState(false);
    const [text, setText] = useState('');
    const [mentors, setMentors] = useState([]);

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

    const createCourseSubmit = async (e) => {
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
        form_data.append('course_poster_file', course_poster);
        form_data.append('course_trailer_file', course_trailer);
        if (course_free === false) {
            form_data.append('course_cost', document.querySelector('input[name="course_cost"]').value);
        }
        form_data.append('course_free', course_free);
        form_data.append('course_mentors', JSON.stringify(mentors));
        form_data.append('course_mentors_count', mentors.length);
        form_data.append('course_skills', JSON.stringify(course_skills));
        form_data.append('course_suitables', JSON.stringify(course_suitables));
        form_data.append('course_requirements', JSON.stringify(course_requirements));
        form_data.append('operation_type_id', 3);

        await axios.post('courses/create', form_data)
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

    const addToMentors = (user_id) => {
        let newArr = JSON.parse(JSON.stringify(mentors));
        newArr.push(user_id);
        setMentors(newArr);
    }

    const deleteFromMentors = (user_id) => {
        let newArr = JSON.parse(JSON.stringify(mentors));
        newArr = newArr.filter(item => item !== user_id)
        setMentors(newArr);
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

    useEffect(() => {
        if (router.isReady) {
            getCourseAttributes();
        }
    }, [router.isReady]);

    return (
        <DashboardLayout showLoader={showFullLoader} title={intl.formatMessage({ id: "page.my_courses.form.course_create_title" })}>
            <RoleProvider roles={[2]} redirect={true}>
                <Breadcrumb>
                    <Link href={'/dashboard/courses/catalogue'}>{intl.formatMessage({ id: "page.courses_catalogue.title" })}</Link>
                    {intl.formatMessage({ id: "page.my_courses.form.course_create_title" })}
                </Breadcrumb>
                <div className="col-span-12">
                    <form onSubmit={e => createCourseSubmit(e)} encType="multipart/form-data">
                        <div className='custom-grid'>
                            <div id="create_wrap" className="col-span-12">
                                <div className="form-group-border active label-inactive">
                                    <AiOutlineRead />
                                    <input autoComplete="new-course-name" type="text" defaultValue={''} name="course_name" placeholder=" " />
                                    <label className={(error.course_name && 'label-error')}>{error.course_name ? error.course_name : intl.formatMessage({ id: "page.my_courses.form.course_name" })}</label>
                                </div>
                            </div>
                            <div className="col-span-12">
                                <div className="form-group-border active label-inactive">
                                    <AiOutlineRead />
                                    <textarea autoComplete="new-course-description" type="text" defaultValue={''} name="course_description" placeholder=" "></textarea>
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
                                        <option selected disabled value="">{intl.formatMessage({ id: "page.my_courses.form.select_course_category" })}</option>
                                        {
                                            course_attributes.course_categories?.map(category => (
                                                <option key={category.course_category_id} value={category.course_category_id}>{category.course_category_name}</option>
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
                                        <option selected disabled value="">{intl.formatMessage({ id: "page.my_courses.form.select_course_language" })}</option>
                                        {
                                            course_attributes.course_languages?.map(language => (
                                                <option key={language.lang_id} value={language.lang_id}>{language.lang_name}</option>
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
                                        <option selected disabled value="">{intl.formatMessage({ id: "page.my_courses.form.select_course_level" })}</option>
                                        {
                                            course_attributes.course_levels?.map(level => (
                                                <option key={level.level_type_id} value={level.level_type_id}>{level.level_type_name}</option>
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
                                        <option selected disabled value="">{intl.formatMessage({ id: "page.my_courses.form.select_course_author" })}</option>
                                        {
                                            course_attributes.course_authors?.map(author => (
                                                <option key={author.user_id} value={author.user_id}>{author.last_name} {author.first_name}</option>
                                            ))
                                        }
                                    </select>
                                    <label className={(error.author_id && 'label-error')}>{error.author_id ? error.author_id : intl.formatMessage({ id: "page.my_courses.form.course_author" })}</label>
                                </div>
                            </div>
                            <div className="col-span-12 relative">
                                <div className={"list-wrap inactive p-3"}>
                                    {
                                        course_attributes.course_authors?.length > 0 &&
                                        course_attributes.course_authors?.map(item => (
                                            <div key={item.user_id}>
                                                <div className="flex gap-2 items-center">
                                                    <UserAvatar user_avatar={item.avatar} className={'w-8 h-8 p-0.5'} />
                                                    <span>{item.last_name} {item.first_name}</span>
                                                </div>
                                                <div className="btn-wrap">
                                                    {mentors.includes(item.user_id)
                                                        ?
                                                        <button onClick={e => deleteFromMentors(item.user_id)} className="btn btn-sm btn-outline-danger" type="button"><AiOutlineDelete /> <span>{intl.formatMessage({ id: "delete" })}</span></button>
                                                        :
                                                        <button onClick={e => addToMentors(item.user_id)} className="btn btn-sm btn-outline-primary" type="button"><AiOutlinePlusCircle /> <span>{intl.formatMessage({ id: "choose" })}</span></button>
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                <label className={(error.course_mentors_count && 'label-error')}>{error.course_mentors_count ? error.course_mentors_count : intl.formatMessage({ id: "page.my_courses.form.course_mentors" })}</label>
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
                                <FileUploadButton
                                    item={course_poster}
                                    trigger={setCoursePoster}
                                    id={"course_poster_file"}
                                    accept={"image/*"}
                                    error={error.course_poster_file}
                                    icon={<AiOutlinePicture />}
                                    label={intl.formatMessage({ id: "page.my_courses.form.course_poster" })}
                                />
                            </div>
                            <div className="col-span-12 lg:col-span-6">
                                <FileUploadButton
                                    item={course_trailer}
                                    trigger={setCourseTrailer}
                                    id={"course_trailer_file"}
                                    accept={"video/*"}
                                    error={error.course_trailer_file}
                                    icon={<AiOutlineVideoCamera />}
                                    label={intl.formatMessage({ id: "page.my_courses.form.course_trailer" })}
                                />
                            </div>
                            <div className='col-span-12'>
                                {!course_free &&
                                    <div className="form-group-border active label-inactive mb-6">
                                        <AiOutlineDollar />
                                        <input name="course_cost" type="number" defaultValue={''} placeholder=" " />
                                        <label className={(error.course_cost && 'label-error')}>{error.course_cost ? error.course_cost : intl.formatMessage({ id: "page.my_courses.form.course_cost" })}, &#8376;</label>
                                    </div>
                                }

                                <label className="custom-checkbox">
                                    <input onChange={e => setCourseFree(!course_free)} type="checkbox" />
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