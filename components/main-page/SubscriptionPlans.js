import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import { AiOutlineHdd, AiOutlineRead, AiOutlineUser } from "react-icons/ai";

const SubscriptionPlans = () => {
    const [subscription_plans, SetSubscriptionPlans] = useState([]);
    const router = useRouter();
    const intl = useIntl();

    const getSubscriptionPlans = async () => {
        await axios.get('school/get_subscription_plans')
            .then(response => {
                SetSubscriptionPlans(response.data);
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
        getSubscriptionPlans();
    }, []);

    return (
        subscription_plans.map((item, index) => (
            <div key={index} className="col-span-12 lg:col-span-4">
                <div className={"bg-inactive border border-" + item.color_scheme + " rounded-2xl p-6 relative"}>

                    <h3 className={"mb-2 text-" + item.color_scheme}>{item.subscription_plan_name}</h3>

                    <div className="flex items-center mt-8 mb-4 gap-1">
                        <AiOutlineRead className="text-xl" />
                        <p className="max-md:text-sm mb-0">{intl.formatMessage({ id: "subscription_plan.max_courses_count" })}: <b>{item.max_courses_count}</b></p>
                    </div>

                    <div className="flex items-center mb-4 gap-1">
                        <AiOutlineUser className="text-xl" />
                        <p className="max-md:text-sm mb-0">{intl.formatMessage({ id: "subscription_plan.max_users_count" })}: <b>{item.max_users_count}</b></p>
                    </div>

                    <div className="flex items-center mb-8 gap-1">
                        <AiOutlineHdd className="text-xl" />
                        <p className="max-md:text-sm mb-0">{intl.formatMessage({ id: "subscription_plan.disk_space" })}: <b>{item.disk_space / 1024} гб</b></p>
                    </div>

                    {item.price == 0
                        ?
                        <p className="mb-0 text-2xl font-medium">{intl.formatMessage({ id: "free" })}</p>
                        :
                        <p className="mb-0 text-2xl font-medium">{item.price.toLocaleString()} &#8376;</p>
                    }
                </div>
            </div>
        ))
    );
};

export default SubscriptionPlans;