import { useIntl } from "react-intl";
import RatingStars from "./RatingStars";
import UserAvatar from "./UserAvatar";
const ReviewsList = ({ items, rating, reviewers_count }) => {
    const intl = useIntl();
    return (
        <div className="card p-4 lg:p-6">
            <h3>{intl.formatMessage({ id: "reviews_and_ratings" })} {items?.length > 0 ? <span className="text-inactive">({items?.length})</span> : null}</h3>
            <div className="flex flex-wrap gap-4 lg:gap-6 items-center mb-6">
                <RatingStars className={'text-2xl'} rating={rating} />
                <p className="text-inactive mb-0 pt-1">{intl.formatMessage({ id: "average_rating" })} <span className="text-active">{rating.toFixed(1)}</span></p>
                <p className="text-inactive mb-0 pt-1">{intl.formatMessage({ id: "number_of_ratings" })} <span className="text-active">{reviewers_count}</span></p>
            </div>
            {items?.length > 0 
            ? 
            items?.map(item => (
                <div className="review-item" key={item.id}>
                    <div className="flex gap-2 mb-2">
                        <UserAvatar user_avatar={item.avatar} className={'w-12 h-12'} padding={1} />
                        <div>
                            <p className="font-medium mb-0">{item.last_name} {item.first_name}</p>
                            <RatingStars className={'text-base'} rating={item.rating} />
                        </div>
                    </div>

                    {item.review != null ? <p className="italic">{item.review}</p> : <p className="text-inactive">{intl.formatMessage({ id: "without_review" })}</p>}
                    <p className="text-inactive text-xs mb-0">{new Date(item.created_at).toLocaleString()}</p>
                </div>
            ))
            :
            <p className="text-inactive mb-0">{intl.formatMessage({ id: "there_are_no_reviews_and_ratings_yet" })}</p>
            }
        </div>
    );
};

export default ReviewsList;