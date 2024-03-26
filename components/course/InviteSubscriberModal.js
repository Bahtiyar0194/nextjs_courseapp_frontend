import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Loader from "../ui/Loader";
import { AiOutlineMail, AiOutlineUser, AiOutlineDollar, AiOutlineCheckCircle } from "react-icons/ai";
import SubscriptionProlong from "../ui/SubscriptionProlong";
import serialize from 'form-serialize';

const InviteSubscriberModal = ({ course, loader, setLoader, getInvites, intl, router, closeModal }) => {
    const [error, setError] = useState([]);
    const [course_free, setCourseFree] = useState(false);
    const school = useSelector((state) => state.school.school_data);

    const inviteSubscriberSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        const form_body = serialize(e.currentTarget, { hash: true, empty: true });
        form_body.operation_type_id = 20;
        form_body.course_free = course_free;

        await axios.post('courses/invite_subscriber/' + course.course_id, form_body)
            .then(response => {
                setError([]);
                getInvites();
                closeModal();
                e.target.querySelector('input[name="email"]').value = '';
                e.target.querySelector('select[name="mentor_id"]').value = '';
                if (course_free === false) {
                    e.target.querySelector('input[name="course_cost"]').value = '';
                }
                setCourseFree(false);
                setLoader(false);
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 422) {
                        setError(err.response.data.data);
                        setLoader(false);
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

    return (
        <>
            {loader && <Loader className="overlay" />}
            <div className="modal-body">
                {school.subscription_expired == true ?
                    <SubscriptionProlong />
                    :
                    <form onSubmit={inviteSubscriberSubmit} encType="multipart/form-data">
                        <div className="custom-grid">
                            <div className="col-span-12">
                                <div className="form-group-border active">
                                    <AiOutlineMail />
                                    <input autoComplete="new-email" type="text" defaultValue={''} name="email" placeholder=" " />
                                    <label className={(error.email && 'label-error')}>{error.email ? error.email : intl.formatMessage({ id: "page.my_courses.subscriber_email" })}</label>
                                </div>
                            </div>
                            <div className="col-span-12">
                                <div className="form-group-border active">
                                    <AiOutlineUser />
                                    <select name="mentor_id" defaultValue={''} >
                                        <option selected disabled value="">{intl.formatMessage({ id: "page.group.form.choose_a_mentor" })}</option>
                                        {
                                            course.mentors?.map(mentor => (
                                                <option key={mentor.user_id} value={mentor.user_id}>{mentor.last_name} {mentor.first_name}</option>
                                            ))
                                        }
                                    </select>
                                    <label className={(error.mentor_id && 'label-error')}>{error.mentor_id ? error.mentor_id : intl.formatMessage({ id: "mentor" })}</label>
                                </div>
                            </div>

                            {!course_free &&
                                <div className="col-span-12">
                                    <div className="form-group-border active">
                                        <AiOutlineDollar />
                                        <input name="course_cost" type="number" defaultValue={''} placeholder=" " />
                                        <label className={(error.course_cost && 'label-error')}>{error.course_cost ? error.course_cost : intl.formatMessage({ id: "page.my_courses.form.course_cost" })}, &#8376;</label>
                                    </div>
                                </div>
                            }
                            <div className="col-span-12">
                                <label className="custom-checkbox">
                                    <input onChange={e => setCourseFree(!course_free)} type="checkbox" />
                                    <span>{intl.formatMessage({ id: "page.my_courses.form.free_course" })}</span>
                                </label>
                            </div>

                        </div>

                        <button className="btn btn-primary mt-4" type="submit"><AiOutlineCheckCircle /> <span>{intl.formatMessage({ id: "done" })}</span></button>
                    </form>
                }
            </div>
        </>
    );
};

export default InviteSubscriberModal;