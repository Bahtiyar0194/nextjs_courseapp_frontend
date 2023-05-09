import API_URL from "../../config/api";
import ButtonLoader from "../ui/ButtonLoader";
import { useIntl } from "react-intl";
import { useState } from "react";
import { AiOutlineCheckCircle, AiOutlineTeam, AiOutlineRead } from "react-icons/ai";
import RoleProvider from "../../services/RoleProvider";
const CourseCard = ({ course, lessons, getCourse, getLessons, setSubscribersModal }) => {
    const intl = useIntl();
    const [button_loader, setButtonLoader] = useState(false);

    const getFreeCourse = async (course_id) => {
        setButtonLoader(true);
        await axios.post('courses/free_subscribe/' + course_id)
            .then(response => {
                setTimeout(() => {
                    getCourse(course_id);
                    getLessons(course_id);
                }, 500);
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

    return (
        <div className="card">
            <img className="w-full" src={API_URL + '/courses/images/posters/' + course.course_poster_file} />
            <div className="p-4">
                <h4>Этот курс включает</h4>
                <p>{intl.formatMessage({ id: "lesson_materials" })}: <span className="font-medium text-corp">{lessons.materials_count}</span></p>
                <p>{intl.formatMessage({ id: "lesson_sections" })}: <span className="font-medium text-corp">{lessons.sections_count}</span></p>

                <div className="btn-wrap">
                    {course.subscribed == false
                        ?
                        <>
                            <p className="text-sm">{intl.formatMessage({ id: "page.my_courses.form.course_cost" })}: <span className="font-medium text-corp">{course.course_cost > 0 ? course.course_cost.toLocaleString() : intl.formatMessage({ id: "page.my_courses.form.free_course" })}</span></p>
                            {
                                course.course_cost > 0
                                    ?
                                    <button onClick={() => setBuyCourseModal(true)} className="btn btn-sm btn-outline-primary mt-4"><AiOutlineRead /> {intl.formatMessage({ id: "page.my_courses.buy_a_course" })}</button>
                                    :
                                    <button onClick={() => getFreeCourse(course.course_id)} className="btn btn-sm btn-outline-primary mt-4">{button_loader === true ? <ButtonLoader /> : <AiOutlineRead />} <span>{intl.formatMessage({ id: "page.my_courses.get_the_course_for_free" })}</span></button>
                            }
                        </>
                        :
                        <button className="btn btn-sm btn-outline-primary disabled"><AiOutlineCheckCircle /> <span>{intl.formatMessage({ id: "page.my_courses.you_are_subscribed_to_this_course" })}</span></button>
                    }

                    <RoleProvider roles={[2]}>
                        <button onClick={() => setSubscribersModal(true)} className="btn btn-sm btn-light"><AiOutlineTeam /> <span>{intl.formatMessage({ id: "page.my_courses.subscribers" })}: {course.subscribers?.length}</span></button>
                    </RoleProvider>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;