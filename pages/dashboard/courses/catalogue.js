import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { AiOutlineRead } from "react-icons/ai";
import axios from "axios";
import Link from "next/link";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import API_URL from "../../../config/api";
import RoleProvider from "../../../services/RoleProvider";
import ContentViewTypeButtons from "../../../components/ui/ContentViewTypeButtons";

export default function CourseCatalogue() {
    const [showFullLoader, setShowFullLoader] = useState(true);
    const [contentViewType, setContentViewType] = useState('grid');
    const intl = useIntl();
    const [courses, setCourses] = useState([]);
    const router = useRouter();
    let i = 1;

    const getCourses = async () => {
        setShowFullLoader(true);
        await axios.get('courses/get-courses')
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
        getCourses();
    }, []);

    return (
        <DashboardLayout showLoader={showFullLoader} title={intl.formatMessage({ id: "page.courses_catalogue.title" })}>
            <Breadcrumb>
                {intl.formatMessage({ id: "page.courses_catalogue.title" })}
            </Breadcrumb>

            {courses.length > 0
                ?
                <>
                    <div className="col-span-12">
                        <div className="title-wrap">
                            <h2>{intl.formatMessage({ id: "page.courses_catalogue.title" })}</h2>
                            <div className="btn-wrap">
                                <RoleProvider roles={[2]}>
                                    <Link className="btn btn-outline-primary mr-2" href={'/dashboard/courses/create'}><AiOutlineRead />
                                        <span>{intl.formatMessage({ id: "page.my_courses.form.course_create" })}</span>
                                    </Link>
                                </RoleProvider>
                                <ContentViewTypeButtons contentViewType={contentViewType} setContentViewType={setContentViewType} />
                            </div>
                        </div>
                    </div>
                    {
                        contentViewType === 'grid' ? courses?.map(course => (
                            <div key={course.course_id} className="col-span-12 sm:col-span-6 lg:col-span-3">
                                <Link href={'/dashboard/courses/' + course.course_id}>
                                    <div className="card">
                                        <img className="w-full" src={API_URL + '/courses/images/posters/' + course.course_poster_file} />
                                        <div className="p-4">
                                            <h4 className="mb-2 text-active">
                                                {course.course_name}
                                            </h4>
                                            <p className="text-sm text-inactive">{course.course_description.substring(0, 100) + '...'}</p>
                                            <div className="badge-wrap">
                                                <div className="badge badge-outline-primary"> {course.course_category_name}</div>
                                                <div className="badge badge-light"> {course.lang_name}</div>
                                            </div>
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
                        <h3>{intl.formatMessage({ id: "page.my_courses.form.dont_have_created_courses" })}</h3>
                        <Link className="btn btn-outline-primary mr-2" href={'/dashboard/courses/create'}><AiOutlineRead />
                            <span>{intl.formatMessage({ id: "page.my_courses.form.course_create" })}</span>
                        </Link>
                    </div>
                </div>
            }
        </DashboardLayout>
    );
}