import Link from "next/link";
import { AiOutlineUser, AiOutlineUserAdd } from "react-icons/ai";
import { useIntl } from "react-intl";

const AuthNavigationMenu = ({user}) => {
    const intl = useIntl();

    return (
        user?.user_id
            ?
            <Link className="btn btn-outline-primary" href={'/dashboard'}><AiOutlineUser /><span>{user?.first_name}</span></Link>
            :
            <>
                <Link className="btn long btn-light" href={'/login'}><AiOutlineUser /><span>{intl.formatMessage({ id: "page.login.button" })}</span></Link>
                <Link className="btn long btn-outline-primary" href={'/registration'}><AiOutlineUserAdd /><span>{intl.formatMessage({ id: "page.registration.title" })}</span></Link>
            </>
    )
}

export default AuthNavigationMenu;