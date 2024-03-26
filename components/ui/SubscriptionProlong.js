import Alert from "./Alert";
import Link from "next/link";
import { useIntl } from "react-intl";

const SubscriptionProlong = (props) => {
    const intl = useIntl();
    
    return (
        <Alert className="alert primary">
            <div className="flex flex-col items-center">
                <p>{intl.formatMessage({ id: "subscription_plan.expired" })}</p>
                <Link className="btn btn-primary" href={'/dashboard/subscription/prolong'}>
                    <span>{intl.formatMessage({ id: "subscription_plan.prolong" })}</span>
                </Link>
            </div>
        </Alert>
    );
};

export default SubscriptionProlong;