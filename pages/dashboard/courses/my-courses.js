import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { AiOutlineRight } from "react-icons/ai";
import { IoGridOutline, IoList } from "react-icons/io5";
import axios from "axios";
import Link from "next/link";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import API_URL from "../../../config/api";

export default function MyCourses() {
    const [showFullLoader, setShowFullLoader] = useState(true);
    const [contentViewType, setContentViewType] = useState('grid');
    const intl = useIntl();
    const [courses, setCourses] = useState([]);

    const router = useRouter();

    let i = 1;

    const getMyCourses = async () => {
        setShowFullLoader(true);
        await axios.get('courses/my-courses')
            .then(response => {
                setCourses(response.data)
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
        getMyCourses();
    }, []);

    return (
        <DashboardLayout showLoader={showFullLoader} title={intl.formatMessage({ id: "page.my_courses.title" })}>
            <Breadcrumb>
                {intl.formatMessage({ id: "page.my_courses.title" })}
            </Breadcrumb>
            {courses.length > 0 ?
                <>
                    <div className="col-span-12">
                        <div className="title-wrap">
                            <h2>{intl.formatMessage({ id: "page.my_courses.title" })}</h2>
                            <div className="btn-wrap">
                                {
                                    contentViewType === 'grid' ? <button onClick={() => setContentViewType('list')} className="btn btn-outline-primary"><IoList /></button> :
                                        contentViewType === 'list' ? <button onClick={() => setContentViewType('grid')} className="btn btn-outline-primary"><IoGridOutline /></button> : ''
                                }
                            </div>
                        </div>
                    </div>
                    {
                        contentViewType === 'grid' ? courses?.map(course => (
                            <div key={course.course_id} className="col-span-12 sm:col-span-6 lg:col-span-4">
                                <Link href={'/dashboard/courses/' + course.course_id}>
                                    <div className="card">
                                        <img className="w-full" src={API_URL + '/courses/images/posters/' + course.course_poster_file} />
                                        <div className="p-4">
                                            <h4 className="mb-2 text-active">
                                                {course.course_name}
                                            </h4>
                                            <p className="text-sm text-inactive">{course.course_description.substring(0, 200) + '...'}</p>
                                            <span className="badge badge-outline-primary"> {course.course_category_name}</span>
                                            <span className="badge badge-light"> {course.lang_name}</span>
                                        </div>
                                    </div>
                                </Link>
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
                                                <tr key={course.course_id}>
                                                    <td>{i++}</td>
                                                    <td><img className="h-8" src={API_URL + '/courses/images/posters/' + course.course_poster_file} /></td>
                                                    <td><Link href={'/dashboard/courses/' + course.course_id}>{course.course_name}</Link></td>
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
                        <h3>{intl.formatMessage({ id: "page.my_courses.form.dont_have_purchased_courses" })}</h3>
                        <Link href={'/dashboard/courses/catalogue'} className="btn btn-outline-primary"><AiOutlineRight />
                            <span>{intl.formatMessage({ id: "page.courses_catalogue.go_to_catalogue" })}</span>
                        </Link>
                    </div>
                </div>
            }
        </DashboardLayout>
    );
}