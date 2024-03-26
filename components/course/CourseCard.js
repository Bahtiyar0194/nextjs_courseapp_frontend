import API_URL from "../../config/api";
import { useIntl } from "react-intl";
import { AiOutlineCheckCircle, AiOutlineRead } from "react-icons/ai";
import { Player, BigPlayButton, LoadingSpinner } from 'video-react';
import "../../node_modules/video-react/dist/video-react.css";
import { useRouter } from "next/router";
const CourseCard = ({ course, lessons, openModal }) => {
    const intl = useIntl();
    const router = useRouter();

    return (
        <div className="card">
            {course.course_trailer_file
                ?
                <Player className={router.locale} poster={API_URL + '/courses/images/posters/' + course.course_poster_file} playsInline src={API_URL + '/courses/videos/trailers/' + course.course_trailer_file}>
                    <BigPlayButton position="center" />
                    <LoadingSpinner />
                </Player>
                :
                <img className="w-full rounded-lg" src={API_URL + '/courses/images/posters/' + course.course_poster_file} />
            }
            <div className="p-4">
                <h4 className="max-md:hidden">{course.course_name}</h4>
                <div className="flex flex-wrap gap-4">
                    {course.course_trailer_file && <img className="h-20 mb-4 border-inactive rounded-lg" src={API_URL + '/courses/images/posters/' + course.course_poster_file} />}
                    <div className="mb-4">
                        {course.course_cost > 0
                            ?
                            <h5 className="text-corp mb-0 -mt-1.5">{course.course_cost.toLocaleString(2)} &#8376;</h5>
                            :
                            <h5 className="text-success mb-0 -mt-1.5">{intl.formatMessage({ id: "free" })}</h5>
                        }
                        <p className="mb-0 text-sm">{intl.formatMessage({ id: "lesson_materials" })}: <span className="font-medium text-corp">{lessons.materials_count}</span></p>
                        <p className="mb-0 text-sm">{intl.formatMessage({ id: "lesson_sections" })}: <span className="font-medium text-corp">{lessons.sections_count}</span></p>
                    </div>
                </div>

                <div className="btn-wrap">
                    {course.subscribed == false && <button onClick={() => openModal()} className="btn btn-outline-primary"><AiOutlineRead /> <span>{intl.formatMessage({ id: "page.my_courses.subcribe_to_the_course" })}</span></button>}
                    {course.subscribed == true && <button onClick={() => openModal()} className="btn btn-sm btn-outline-primary"><AiOutlineCheckCircle /> <span>{intl.formatMessage({ id: "page.my_courses.you_are_subscribed_to_this_course" })}</span></button>}
                    {course.requested == true && <button onClick={() => openModal()} className="btn btn-sm btn-outline-primary"><AiOutlineCheckCircle /> <span>{intl.formatMessage({ id: "page.my_courses.subscription_requested" })}</span></button>}
                </div>
            </div>
        </div>
    );
};

export default CourseCard;