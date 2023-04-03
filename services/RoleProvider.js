import Link from "next/link";
import { AiOutlineLock } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";

export default function RoleProvider({ children, roles, redirect }) {
    const user = useSelector((state) => state.authUser.user);
    const intl = useIntl();
    let role_found = false;

    if (roles.length > 0) {
        for (let index = 0; index < roles.length; index++) {
            if (roles[index] == user.current_role_id) {
                role_found = true;
                break;
            }
        }

        if (role_found === false) {
            if (redirect === true) {
                return (
                    <div className="col-span-12">
                        <div className="content-center">
                        <AiOutlineLock className="text-6xl mb-2 text-corp"></AiOutlineLock>
                            <div className="text-center">
                                <h4 className="mb-2">{intl.formatMessage({ id: "page.error.page_is_not_available" })}</h4>
                                <Link href={'/dashboard'}>{intl.formatMessage({ id: "page.dashboard.go_to_dashboard" })}</Link>
                            </div>
                        </div>
                    </div>
                )
            }
        }
        else {
            return (children);
        }
    }
}