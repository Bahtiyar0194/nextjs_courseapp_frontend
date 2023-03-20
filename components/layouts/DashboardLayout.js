import Header from "./Header";
import ThemeChanger from "../ui/ThemeChanger";
import Locales from "../ui/Locales";
import Link from "next/link";
import { CDropdown, CDropdownToggle, CDropdownMenu } from "@coreui/react";
import { AiOutlineLogout, AiOutlineUser, AiOutlineDashboard, AiOutlineBarChart, AiOutlinePlaySquare, AiOutlineSetting, AiOutlineTeam, AiOutlineClockCircle, AiOutlineRead } from "react-icons/ai";
import AuthProvider from "../../services/AuthProvider";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";
import Loader from "../ui/Loader";

export default function DashboardLayout(props) {
    const intl = useIntl();
    const router = useRouter();
    const user = useSelector((state) => state.authUser.user);

    const logout = async () => {
        Cookies.remove('token');
        await axios.post('auth/logout')
            .then(response => {
                console.log(response)
            }).catch(err => {
                if (err.response) {
                    router.push('/error/' + err.response.status)
                }
                else {
                    router.push('/error')
                }
            });
        router.push("/");
    }

    return (
        <AuthProvider>
            <Header title={props.title} />
            <div className="db__header">
                <div className="logo">
                    <img src="/img/logo.svg" />
                </div>

                <div className="flex items-center">
                    <div className="flex items-center">
                        <ThemeChanger />
                        <Locales />
                    </div>
                    <div>
                        <CDropdown>
                            <CDropdownToggle href="#" color="no-color" className="pl-0">
                                <div className="rounded-full w-6 h-6 bg-corp flex items-center justify-center text-white">Б</div> <span className="text-active">{user.first_name}</span>
                            </CDropdownToggle>
                            <CDropdownMenu>
                                <Link href={'/dashboard'}><AiOutlineUser />Настройки профиля</Link>
                                <Link href={'#'} onClick={logout}><AiOutlineLogout />{intl.formatMessage({ id: "logout" })}</Link>
                            </CDropdownMenu>
                        </CDropdown>
                    </div>
                </div>
            </div>
            <div className="flex">
                <div className="db__sidebar__menu">
                    <Link href={'/dashboard'}><AiOutlineDashboard /><span>{intl.formatMessage({ id: "page.dashboard.title" })}</span></Link>
                    <Link href={'/dashboard/courses/catalogue'}><AiOutlineRead /><span>{intl.formatMessage({ id: "page.courses_catalogue.title" })}</span></Link>
                    <Link href={'/dashboard/courses/my-courses'}><AiOutlinePlaySquare /><span>{intl.formatMessage({ id: "page.my_courses.title" })}</span></Link>
                    <Link href={'/dashboard/users'}><AiOutlineTeam /><span>{intl.formatMessage({ id: "page.users.title" })}</span></Link>
                </div>
                <div className="db__content">
                    {props.showLoader && <Loader className="full-overlay" />}
                    <div className="custom-grid">
                        {props.children}
                    </div>
                </div>
            </div>
        </AuthProvider>
    );
}