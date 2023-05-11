import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { useIntl } from "react-intl";
const RatingStars = ({ className, rating, reviewers_count }) => {
    const intl = useIntl();
    return (
        <div title={reviewers_count > 0 ? intl.formatMessage({ id: "average_rating" }) + rating.toFixed(1) + ' ' + intl.formatMessage({ id: "number_of_ratings" }) + reviewers_count : ""} className={"flex items-center gap-0.5 mt-1 text-yellow-500 " + className}>
            {rating >= 1 ? <AiFillStar /> : <AiOutlineStar />}
            {rating >= 2 ? <AiFillStar /> : <AiOutlineStar />}
            {rating >= 3 ? <AiFillStar /> : <AiOutlineStar />}
            {rating >= 4 ? <AiFillStar /> : <AiOutlineStar />}
            {rating >= 5 ? <AiFillStar /> : <AiOutlineStar />}
            {rating > 0 && reviewers_count > 0 && <span className="text-inactive text-base ml-1 cursor-default"> | {rating.toFixed(1)} / {reviewers_count}</span>}
        </div>
    );
};

export default RatingStars;