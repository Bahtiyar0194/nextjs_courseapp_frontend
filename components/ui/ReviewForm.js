import { AiOutlineStar, AiFillStar, AiOutlineComment, AiOutlineCheck } from "react-icons/ai";
import { useIntl } from "react-intl";
import { useState } from "react";
import ButtonLoader from "./ButtonLoader";
import serialize from 'form-serialize';
import axios from "axios";
const ReviewForm = ({ title, description, url }) => {
    const intl = useIntl();
    const [error, setError] = useState([]);
    const [rating, setRating] = useState(0);
    const [button_loader, setButtonLoader] = useState(false);

    const items = [1,2,3,4,5];

    const createReviewSubmit = async (e) => {
        e.preventDefault();
        setButtonLoader(true);
        const form_body = serialize(e.currentTarget, { hash: true, empty: true });

        await axios.post(url, form_body)
            .then(response => {
                //router.push('/dashboard/courses/' + response.data.data.course_id);
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 422) {
                        setError(err.response.data.data);
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

    return (
        <div className="card p-4 lg:p-6">
            <h3>{title}</h3>
            <p className="text-inactive mb-4">{description}</p>

            <form onSubmit={e => createReviewSubmit(e)} encType="multipart/form-data">
                <p className={error.rating ? "text-danger" : "text-inactive"}>{error.rating ? intl.formatMessage({ id: "put_a_rate" }) : intl.formatMessage({ id: "your_rating" })}</p>
                <div className="flex gap-2 -mt-6">
                    {items?.map(item => (
                        <label key={item} title={item} className="rating-radio">
                            <input type="radio" value={rating} onChange={e => setRating(item)} name="rating" />
                            {rating >= item ? <AiFillStar /> : <AiOutlineStar />}
                        </label>
                    ))}
                </div>

                <div className="form-group-border active mt-6">
                    <AiOutlineComment />
                    <textarea autoComplete="new-review" type="text" defaultValue={''} name="review" placeholder=" "></textarea>
                    <label className={(error.review && 'label-error')}>{error.review ? error.review : intl.formatMessage({ id: "leave_a_review" })}</label>
                </div>

                <button disabled={button_loader} className="btn btn-outline-primary mt-4" type="submit">
                    {button_loader === true ? <ButtonLoader /> : <AiOutlineCheck />}
                    <span>{intl.formatMessage({ id: "done" })}</span>
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;