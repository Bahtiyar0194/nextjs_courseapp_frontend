import Header from "./Header";
import ThemeChanger from "../ui/ThemeChanger";
import Locales from "../ui/Locales";
import Link from "next/link";
import { CDropdown, CDropdownToggle, CDropdownMenu } from "@coreui/react";
import { AiOutlineLogout, AiOutlineDashboard, AiOutlinePlaySquare, AiOutlineTeam, AiOutlineRead, AiOutlineSetting } from "react-icons/ai";
import AuthProvider from "../../services/AuthProvider";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";
import { authenticate } from "../../store/slices/userSlice";
import { useIntl } from "react-intl";
import Loader from "../ui/Loader";
import RoleProvider from "../../services/RoleProvider";
import { useAutoAnimate } from '@formkit/auto-animate/react';

export default function DashboardLayout(props) {
    const intl = useIntl();
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.authUser.user);
    const [animateParent, enableAnimations] = useAutoAnimate();

    const changeUserMode = async (role_type_id) => {
        await axios.post('auth/change_mode/' + role_type_id)
            .then(response => {
                (async () => {
                    await axios.get('auth/me')
                        .then(response => {
                            dispatch(authenticate(response.data.user));
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
                })();
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

    const logout = async () => {
        Cookies.remove('token');
        await axios.post('auth/logout')
            .then(response => {
                router.push("/");
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
                                <div className="rounded-full w-6 h-6 bg-corp flex items-center justify-center text-white">{user.first_name?.substring(0, 1)}</div> <span className="text-active">{user.first_name}</span>
                            </CDropdownToggle>
                            <CDropdownMenu>
                                {user.roles?.length > 1 &&
                                    <div>
                                        <p className="text-inactive mb-2.5">{intl.formatMessage({ id: "page.users.user_mode" })}</p>
                                        {user.roles?.map(role =>
                                            <div key={role.role_type_id} className="mt-1.5">
                                                <label className="custom-radio">
                                                    <input type="radio" onChange={e => changeUserMode(role.role_type_id)} checked={user.current_role_id == role.role_type_id} name="user_mode" />
                                                    <span>{role.user_role_type_name}</span>
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                }
                                <Link href={'/dashboard'}><AiOutlineSetting />{intl.formatMessage({ id: "page.users.profile_settings" })}</Link>
                                <Link href={'#'} onClick={logout}><AiOutlineLogout />{intl.formatMessage({ id: "logout" })}</Link>
                            </CDropdownMenu>
                        </CDropdown>
                    </div>
                </div>
            </div>
            <div className="flex">
                <div className="db__sidebar__menu" ref={animateParent}>
                    <Link href={'/dashboard'}><AiOutlineDashboard /><span>{intl.formatMessage({ id: "page.dashboard.title" })}</span></Link>
                    <Link href={'/dashboard/courses/catalogue'}><AiOutlineRead /><span>{intl.formatMessage({ id: "page.courses_catalogue.title" })}</span></Link>
                    <Link href={'/dashboard/courses/my-courses'}><AiOutlinePlaySquare /><span>{intl.formatMessage({ id: "page.my_courses.title" })}</span></Link>
                    <RoleProvider roles={[2]}>
                        <Link href={'/dashboard/users'}><AiOutlineTeam /><span>{intl.formatMessage({ id: "page.users.title" })}</span></Link>
                    </RoleProvider>
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