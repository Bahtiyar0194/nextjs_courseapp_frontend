import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Modal from "../../../components/ui/Modal";
import Loader from "../../../components/ui/Loader";
import { AiOutlineRead, AiOutlineFlag, AiOutlinePercentage, AiOutlinePlus, AiOutlinePicture, AiOutlineDoubleRight } from "react-icons/ai";
import { IoGridOutline, IoList } from "react-icons/io5";
import axios from "axios";
import Link from "next/link";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import API_URL from "../../../config/api";

export default function MyCourses() {
    const [showFullLoader, setShowFullLoader] = useState(true);
    const [loader, setLoader] = useState(false);
    const [contentViewType, setContentViewType] = useState('grid');
    const intl = useIntl();
    const [courseModal, setCourseModal] = useState(false);
    const [courses, setCourses] = useState([]);
    const roles = useSelector((state) => state.authUser.roles);

    const [course_categories, setCourseCategories] = useState([]);
    const [languages, setLanguages] = useState([]);

    const [course_name, setCourseName] = useState('');
    const [course_description, setCourseDescription] = useState('');
    const [course_category_id, setCourseCategory] = useState('');
    const [course_language_id, setCourseLanguage] = useState('');
    const [course_poster, setCoursePoster] = useState('');
    const [course_cost, setCourseCost] = useState('');
    const [course_free, setCourseFree] = useState(false);

    const [error, setError] = useState([]);
    const router = useRouter();

    let i = 1;

    const createCourseSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);

        const form_data = new FormData();
        form_data.append('course_name', course_name);
        form_data.append('course_description', course_description);
        form_data.append('course_category_id', course_category_id);
        form_data.append('course_language_id', course_language_id);
        form_data.append('course_poster', course_poster);
        form_data.append('course_cost', course_cost);
        form_data.append('course_free', course_free);

        await axios.post('courses/create', form_data)
            .then(response => {
                setCourseName('');
                setCourseDescription('');
                setCourseCategory('');
                setCourseLanguage('');
                setCoursePoster('');
                setCourseCost('');
                setCourseFree(false);

                setLoader(false);
                setCourseModal(false);
                getCourses();
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 422) {
                        setError(err.response.data.data);
                        setLoader(false);
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

    const getCourses = async () => {
        setShowFullLoader(true);
        await axios.get('courses/my-courses')
            .then(response => {
                setCourses(response.data)
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

    const getCourseCategories = async () => {
        setLoader(true);
        await axios.get('courses/get_categories')
            .then(response => {
                setCourseCategories(response.data)
                setLoader(false);
            }).catch(err => {
                if (err.response) {
                    router.push('/error/' + err.response.status)
                }
                else {
                    router.push('/error')
                }
            });
    }

    const getLanguages = async () => {
        setLoader(true);
        await axios.get('languages/get')
            .then(response => {
                setLanguages(response.data)
                setLoader(false);
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
        getCourseCategories();
        getLanguages();
        getCourses();
    }, []);

    return (
        <DashboardLayout showLoader={showFullLoader} title={intl.formatMessage({ id: "page.my_courses.title" })}>
            <Breadcrumb>{intl.formatMessage({ id: "page.my_courses.title" })}</Breadcrumb>

            {courses.length > 0 ?
                <>
                    <div className="col-span-12 lg:col-span-3 flex lg:justify-end">
                        {roles.includes(2) &&
                            <button className="btn btn-primary mr-2" onClick={() => setCourseModal(true)}><AiOutlineRead />
                                <span>{intl.formatMessage({ id: "page.my_courses.form.course_create" })}</span>
                            </button>
                        }
                        {
                            contentViewType === 'grid' ? <button onClick={() => setContentViewType('list')} className="btn btn-outline-primary"><IoList /></button> :
                                contentViewType === 'list' ? <button onClick={() => setContentViewType('grid')} className="btn btn-outline-primary"><IoGridOutline /></button> : ''
                        }
                    </div>

                    <div className="col-span-12">
                        <h2>{intl.formatMessage({ id: "page.my_courses.title" })}</h2>
                    </div>
                    {
                        contentViewType === 'grid' ? courses?.map(course => (
                            <div key={course.course_id} className="col-span-12 md:col-span-6 lg:col-span-3">
                                <div className="card">
                                    <div className="card-bg h-40 p-4" style={{ backgroundImage: `url('${API_URL + '/courses/images/posters/' + course.course_poster_file}')` }}>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="mb-1">
                                            <Link href={'/dashboard/my-courses/' + course.course_id}>{course.course_name}</Link>
                                        </h4>
                                        <div className="text-sm font-medium mb-2">
                                            <span>{intl.formatMessage({ id: "page.my_courses.form.course_category" })}:</span>
                                            <span className="text-corp"> {course.course_category_name}</span>
                                        </div>
                                        <p className="text-sm">{course.course_description.substring(0, 100) + '...'}</p>
                                    </div>
                                </div>
                            </div>
                        )) :
                            contentViewType === 'list' &&
                            <div className="col-span-12">
                                <div className="table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>№</th>
                                                <th>{intl.formatMessage({ id: "page.my_courses.form.course_poster" })}</th>
                                                <th>{intl.formatMessage({ id: "page.my_courses.form.course_name" })}</th>
                                                <th>{intl.formatMessage({ id: "page.my_courses.form.course_category" })}</th>
                                                <th>{intl.formatMessage({ id: "page.my_courses.form.course_cost" })}</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {courses?.map(course => (
                                                <tr>
                                                    <td>{i++}</td>
                                                    <td><img className="h-8" src={API_URL + '/courses/images/posters/' + course.course_poster_file} /></td>
                                                    <td><Link href={'/dashboard/my-courses/' + course.course_id}>{course.course_name}</Link></td>
                                                    <td>{course.course_category_name}</td>
                                                    <td>{course.course_cost}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                    }
                </>
                :
                <div className="col-span-12">
                    <div>
                        <h3>{intl.formatMessage({ id: "page.my_courses.form.dont_have_course" })}</h3>
                        <button onClick={() => setCourseModal(true)} className="btn btn-outline-primary"><AiOutlineRead />
                            <span>{intl.formatMessage({ id: "page.my_courses.form.course_create" })}</span>
                        </button>
                    </div>
                </div>
            }

            <Modal show={courseModal} onClose={() => setCourseModal(false)} modal_title={intl.formatMessage({ id: "page.my_courses.form.course_create" })} modal_size="modal-4xl">
                {loader && <Loader className="overlay" />}
                <div className="modal-body">
                    <form onSubmit={createCourseSubmit} encType="multipart/form-data">
                        <div className="form-group mt-4">
                            <AiOutlineRead />
                            <input onInput={e => setCourseName(e.target.value)} type="text" value={course_name} placeholder=" " />
                            <label className={(error.course_name && 'label-error')}>{error.course_name ? error.course_name : intl.formatMessage({ id: "page.my_courses.form.course_name" })}</label>
                        </div>

                        <div className="form-group mt-4">
                            <AiOutlineRead />
                            <textarea onInput={e => setCourseDescription(e.target.value)} value={course_description} placeholder=" "></textarea>
                            <label className={(error.course_description && 'label-error')}>{error.course_description ? error.course_description : intl.formatMessage({ id: "page.my_courses.form.course_description" })}</label>
                        </div>

                        <div className="form-group">
                            <AiOutlineRead />
                            <select onChange={e => setCourseCategory(e.target.value)}>
                                <option selected disabled>{intl.formatMessage({ id: "page.my_courses.form.select_course_category" })}</option>
                                {
                                    course_categories?.map(category => (
                                        <option key={category.course_category_id} value={category.course_category_id}>{category.course_category_name}</option>
                                    ))
                                }
                            </select>
                            <label className={(error.course_category_id && 'label-error')}>{error.course_category_id ? error.course_category_id : intl.formatMessage({ id: "page.my_courses.form.course_category" })}</label>
                        </div>

                        <div className="form-group">
                            <AiOutlineFlag />
                            <select onChange={e => setCourseLanguage(e.target.value)}>
                                <option selected disabled>{intl.formatMessage({ id: "page.my_courses.form.select_course_language" })}</option>
                                {
                                    languages?.map(language => (
                                        <option key={language.lang_id} value={language.lang_id}>{language.lang_name}</option>
                                    ))
                                }
                            </select>
                            <label className={(error.course_language_id && 'label-error')}>{error.course_language_id ? error.course_language_id : intl.formatMessage({ id: "page.my_courses.form.course_language" })}</label>
                        </div>

                        <div className="form-group-file mb-4">
                            <input id="course_poster" onChange={e => setCoursePoster(e.target.files[0])} type="file" accept="image/*" placeholder=" " />
                            <label htmlFor="course_poster" className={(error.course_poster && 'label-error')}>
                                <AiOutlinePicture />
                                <p className="mb-1">{error.course_poster ? error.course_poster : intl.formatMessage({ id: "page.my_courses.form.course_poster" })}</p>
                                {course_poster ?
                                    <div>
                                        {course_poster.name && <p className="text-xs mb-0">{intl.formatMessage({ id: "file_name" })}: <b>{course_poster.name}</b></p>}
                                        {course_poster.size && <p className="text-xs mb-0">{intl.formatMessage({ id: "file_size" })}: <b>{(course_poster.size / 1048576).toFixed(2)} МБ</b></p>}
                                    </div>
                                    :
                                    <p className="text-xs mb-0">{intl.formatMessage({ id: "choose_file" })}</p>

                                }
                            </label>
                        </div>



                        {!course_free && <div className="form-group">
                            <AiOutlinePercentage />
                            <input onInput={e => setCourseCost(e.target.value)} type="number" value={course_cost} placeholder=" " />
                            <label className={(error.course_cost && 'label-error')}>{error.course_cost ? error.course_cost : intl.formatMessage({ id: "page.my_courses.form.course_cost" })}</label>
                        </div>}


                        <label className="custom-checkbox">
                            <input onChange={e => setCourseFree(!course_free)} type="checkbox" />
                            <span>{intl.formatMessage({ id: "page.my_courses.form.free_course" })}</span>
                        </label>

                        <button className="btn btn-primary mt-4" type="submit"><AiOutlinePlus /> <span>{intl.formatMessage({ id: "page.my_courses.form.add_course" })}</span></button>
                    </form>
                </div>
            </Modal>
        </DashboardLayout>
    );
}