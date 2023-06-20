import { useState } from "react";
import axios from "axios";
import Loader from "../ui/Loader";
import { AiOutlineUser, AiOutlineCheckCircle } from "react-icons/ai";
import serialize from 'form-serialize';

const AcceptRequestModal = ({ request_id, course, getSubscribers, getRequests, getCourse, loader, setLoader, intl, router, closeModal }) => {
    const [error, setError] = useState([]);

    const acceptRequestSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        const form_body = serialize(e.currentTarget, { hash: true, empty: true });
        form_body.operation_type_id = 21;

        await axios.post('courses/accept_request/' + request_id, form_body)
            .then(response => {
                setError([]);
                getCourse(course.course_id);
                getSubscribers();
                getRequests();
                closeModal();
                e.target.querySelector('select[name="mentor_id"]').value = '';
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
                <form onSubmit={acceptRequestSubmit} encType="multipart/form-data">
                    <div className="custom-grid mt-6">
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
                    </div>

                    <button className="btn btn-primary mt-4" type="submit"><AiOutlineCheckCircle /> <span>{intl.formatMessage({ id: "done" })}</span></button>
                </form>
            </div>
        </>
    );
};

export default AcceptRequestModal;