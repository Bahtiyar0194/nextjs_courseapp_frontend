import Header from "./Header";
import ThemeChanger from "../ui/ThemeChanger";
import Locales from "../ui/Locales";
import Link from "next/link";
import { CDropdown, CDropdownToggle, CDropdownMenu } from "@coreui/react";
import { AiOutlineLogout, AiOutlineDashboard, AiOutlinePlaySquare, AiOutlineTeam, AiOutlineRead, AiOutlineSetting, AiOutlineFile, AiOutlineUser, AiOutlineCheckSquare } from "react-icons/ai";
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
import DefaultLogo from "../ui/Logo";
import DiskSpace from "../ui/DiskSpace";
import UserAvatar from "../ui/UserAvatar";

export default function DashboardLayout(props) {
    const intl = useIntl();
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.authUser.user);
    const disk_data = useSelector((state) => state.disk.disk_data);
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
                router.push("/login");
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 401) {
                        router.push("/login");
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
        <AuthProvider>
            <Header title={props.title} />
            <div className="db__header">
                <DefaultLogo show_logo_alt={true} />

                <div className="btn-wrap items-center">
                    <Locales />
                    <ThemeChanger />
                    <CDropdown>
                        <CDropdownToggle href="#" color="transparent no-px" className="pl-0">
                            <div className="flex items-center gap-x-1 sm:gap-x-1.5">
                                <UserAvatar user_avatar={user.avatar} className={'w-10 h-10 p-0.5'} />
                                <div>
                                    <svg className="sm:hidden" width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                                    <p className="hidden sm:block text-active font-medium mb-0">{user.first_name}</p>
                                    <p className="hidden sm:block text-inactive text-xs mb-0">{user.current_role_name}</p>
                                </div>
                            </div>
                        </CDropdownToggle>
                        <CDropdownMenu>
                            <div>
                                <div className="flex items-center gap-x-3">
                                    <UserAvatar user_avatar={user.avatar} className={'w-16 h-16 p-1'} />
                                    <div>
                                        <p className="text-active font-medium text-base mb-0">{user.last_name} {user.first_name}</p>
                                        <p className="text-inactive text-xs mb-0">{user.email}</p>
                                    </div>
                                </div>

                                <RoleProvider roles={[2]}>
                                    <DiskSpace intl={intl} disk_data={disk_data} />
                                </RoleProvider>
                            </div>

                            {user.roles?.length > 1 &&
                                <div>
                                    <p className="mb-2.5">{intl.formatMessage({ id: "page.users.user_mode" })}:</p>
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
                            <Link href={'/dashboard/profile'}><AiOutlineUser />{intl.formatMessage({ id: "page.users.profile_settings" })}</Link>
                            <RoleProvider roles={[2]}>
                                <Link href={'/dashboard/site-settings'}><AiOutlineSetting />{intl.formatMessage({ id: "page.site_settings.title" })}</Link>
                            </RoleProvider>
                            <Link href={'#'} onClick={logout}><AiOutlineLogout />{intl.formatMessage({ id: "logout" })}</Link>
                        </CDropdownMenu>
                    </CDropdown>
                </div>
            </div>
            <div className="flex">
                <div className="db__sidebar__menu" ref={animateParent}>
                    <Link href={'/dashboard'}><AiOutlineDashboard /><span>{intl.formatMessage({ id: "page.dashboard.title" })}</span></Link>
                    <Link href={'/dashboard/courses/catalogue'}><AiOutlineRead /><span>{intl.formatMessage({ id: "page.courses_catalogue.title" })}</span></Link>
                    <Link href={'/dashboard/courses/my-courses'}><AiOutlinePlaySquare /><span>{intl.formatMessage({ id: "page.my_courses.title" })}</span></Link>
                    <RoleProvider roles={[2]}>
                        <Link href={'/dashboard/disk'}><AiOutlineFile /><span>{intl.formatMessage({ id: "subscription_plan.disk_space" })}</span></Link>
                        <Link href={'/dashboard/users-groups'}><AiOutlineTeam /><span>{intl.formatMessage({ id: "page.users.title" })}</span></Link>
                    </RoleProvider>
                    <RoleProvider roles={[2,3]}> 
                        <Link href={'/dashboard/tasks'}><AiOutlineCheckSquare /><span>{intl.formatMessage({ id: "page.tasks.title" })}</span></Link>
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