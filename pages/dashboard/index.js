import DashboardLayout from "../../components/layouts/DashboardLayout";
import RoleProvider from "../../services/RoleProvider";
import { useSelector } from "react-redux";
import CountUp from 'react-countup';
import { useIntl } from "react-intl";
import Breadcrumb from "../../components/ui/Breadcrumb";
import { AiOutlineCloud } from "react-icons/ai";
import Link from "next/link";
import SubscriptionProlong from "../../components/ui/SubscriptionProlong";
import ProgressBar from "../../components/ui/ProgressBar";

export default function Dashboard() {
    const intl = useIntl();
    const user = useSelector((state) => state.authUser.user);
    const school = useSelector((state) => state.school.school_data);
    const dashboard_data = useSelector((state) => state.dashboard.dashboard_data);
    const disk_data = useSelector((state) => state.disk.disk_data);

    return (
        <DashboardLayout showLoader={(user?.first_name && disk_data?.used_space_percent >= 0) ? false : true} title={intl.formatMessage({ id: "page.dashboard.title" })}>
            <Breadcrumb />
            <div className="col-span-12">
                <h2>{user.first_name}, {intl.formatMessage({ id: "page.home.welcome" })}!</h2>
            </div>

            {school.subscription_expired == true &&
                <RoleProvider roles={[2]}>
                    <div className="col-span-12">
                        <SubscriptionProlong />
                    </div>
                </RoleProvider>
            }

            {dashboard_data.courses &&
                <div className="col-span-12 md:col-span-3">
                    <div className="card p-4">
                        <h4>{intl.formatMessage({ id: "page.courses" })}</h4>

                        <div className="flex flex-wrap gap-x-8 gap-y-4 whitespace-nowrap">
                            <div>
                                <p className="text-inactive text-sm">{intl.formatMessage({ id: "page.courses.count" })}:</p>
                                <span className="text-4xl text-corp font-medium"><CountUp end={dashboard_data.courses.courses_count} /></span>
                            </div>

                            <div>
                                <p className="text-inactive text-sm">{intl.formatMessage({ id: "page.my_courses.title" })}:</p>
                                <span className="text-4xl text-corp font-medium"><CountUp end={dashboard_data.courses.my_courses_count} /></span>
                            </div>

                            <div>
                                <p className="text-inactive text-sm">{intl.formatMessage({ id: "page.my_courses.completed_courses.title" })}:</p>
                                <span className="text-4xl text-corp font-medium"><CountUp end={dashboard_data.courses.my_completed_courses_count} /></span>
                            </div>

                            <div>
                                <p className="text-inactive text-sm">{intl.formatMessage({ id: "page.my_courses.completed_courses.certificates" })}:</p>
                                <span className="text-4xl text-corp font-medium"><CountUp end={0} /></span>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {dashboard_data.lessons &&
                <div className="col-span-12 md:col-span-3">
                    <div className="card p-4">
                        <h4>{intl.formatMessage({ id: "lessons.title" })}</h4>

                        <div className="flex flex-wrap gap-x-8 gap-y-4 whitespace-nowrap">
                            <div>
                                <p className="text-inactive text-sm">{intl.formatMessage({ id: "lessons.count" })}:</p>
                                <span className="text-4xl text-corp font-medium"><CountUp end={dashboard_data.lessons.lessons_count} /></span>
                            </div>

                            <div>
                                <p className="text-inactive text-sm">{intl.formatMessage({ id: "lessons.ready_to_view" })}:</p>
                                <span className="text-4xl text-corp font-medium"><CountUp end={dashboard_data.lessons.lessons_count - dashboard_data.lessons.viewed_lessons_count} /></span>
                            </div>

                            <div>
                                <p className="text-inactive text-sm">{intl.formatMessage({ id: "lessons.viewed_lessons" })}:</p>
                                <span className="text-4xl text-corp font-medium"><CountUp end={dashboard_data.lessons.viewed_lessons_count} /></span>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {dashboard_data.tasks &&
                <div className="col-span-12 md:col-span-6">
                    <div className="card p-4">
                        <h4>{intl.formatMessage({ id: "page.tasks.title" })}</h4>

                        <div className="flex flex-wrap gap-x-8 gap-y-4 whitespace-nowrap">
                            <div>
                                <p className="text-inactive text-sm">{intl.formatMessage({ id: "page.tasks.all_tasks" })}:</p>
                                <span className="text-4xl text-corp font-medium"><CountUp end={dashboard_data.tasks.all_tasks_count} /></span>
                            </div>

                            <div>
                                <p className="text-inactive text-sm">{intl.formatMessage({ id: "page.tasks.typical_tasks" })}:</p>
                                <span className="text-4xl text-corp font-medium"><CountUp end={dashboard_data.tasks.lesson_tasks_count} /></span>
                            </div>

                            <div>
                                <p className="text-inactive text-sm">{intl.formatMessage({ id: "task.tests" })}:</p>
                                <span className="text-4xl text-corp font-medium"><CountUp end={dashboard_data.tasks.test_tasks_count} /></span>
                            </div>

                            <div>
                                <p className="text-inactive text-sm">{intl.formatMessage({ id: "page.tasks.personal_tasks" })}:</p>
                                <span className="text-4xl text-corp font-medium"><CountUp end={dashboard_data.tasks.personal_tasks_count} /></span>
                            </div>

                            <div>
                                <p className="text-inactive text-sm">{intl.formatMessage({ id: "page.tasks.on_verification" })}:</p>
                                <span className="text-4xl text-corp font-medium"><CountUp end={dashboard_data.tasks.verification_tasks_count} /></span>
                            </div>

                            <div>
                                <p className="text-inactive text-sm">{intl.formatMessage({ id: "page.tasks.completed_tasks" })}:</p>
                                <span className="text-4xl text-corp font-medium"><CountUp end={dashboard_data.tasks.completed_tasks_count} /></span>
                            </div>
                        </div>
                    </div>
                </div>
            }

            <RoleProvider roles={[2]}>
                {
                    disk_data &&
                    <div className="col-span-12 md:col-span-4">
                        <Link href={'/dashboard/disk'}>
                            <div className="card p-4">
                                <h4>{intl.formatMessage({ id: "subscription_plan.disk_space" })}</h4>
                                <div>
                                    <p className="text-inactive text-sm">{intl.formatMessage({ id: "page.disk.space" })}:</p>
                                    <div className="flex items-center text-corp font-medium">
                                        <AiOutlineCloud className="text-2xl mr-2" /><span className="text-4xl text-corp font-medium"><CountUp end={disk_data.disk_space_gb?.toFixed()} /> {intl.formatMessage({ id: "gigabyte" })}</span>
                                    </div>
                                </div>
                                <div className="w-full">

                                    <ProgressBar bg_class={'success'} className={"danger"} percentage={disk_data.used_space_percent} show_percentage={false} />

                                    <div className="flex justify-between">
                                        <p className="text-success m-0">{intl.formatMessage({ id: "free_space" })}: <span className="text-active">{disk_data.free_space_gb?.toFixed(2)} {intl.formatMessage({ id: "gigabyte" })}</span></p>
                                        <p className="text-inactive m-0"><CountUp end={disk_data.free_space_percent?.toFixed()} />%</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-danger m-0">{intl.formatMessage({ id: "used_space" })}: <span className="text-active">{disk_data.used_space_gb?.toFixed(2)} {intl.formatMessage({ id: "gigabyte" })}</span></p>
                                        <p className="text-inactive m-0"><CountUp end={disk_data.used_space_percent?.toFixed()} />%</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                }
            </RoleProvider>

            <RoleProvider roles={[2]}>
                {dashboard_data.users &&
                    <div className="col-span-12 md:col-span-4">
                        <Link href={'/dashboard/users-groups'}>
                            <div className="card p-4">
                                <h4>{intl.formatMessage({ id: "page.users" })}</h4>

                                <div className="flex flex-wrap gap-x-8 gap-y-4 whitespace-nowrap">
                                    <div>
                                        <p className="text-inactive text-sm">{intl.formatMessage({ id: "page.users.count" })}:</p>
                                        <span className="text-4xl text-corp font-medium"><CountUp end={dashboard_data.users.users_count} /></span>
                                    </div>

                                    <div>
                                        <p className="text-inactive text-sm">{intl.formatMessage({ id: "page.users.admins_count" })}:</p>
                                        <span className="text-4xl text-corp font-medium"><CountUp end={dashboard_data.users.admins.length} /></span>
                                    </div>

                                    <div>
                                        <p className="text-inactive text-sm">{intl.formatMessage({ id: "page.users.learners_count" })}:</p>
                                        <span className="text-4xl text-corp font-medium"><CountUp end={dashboard_data.users.learners.length} /></span>
                                    </div>

                                    <div>
                                        <p className="text-inactive text-sm">{intl.formatMessage({ id: "page.users.instructors_count" })}:</p>
                                        <span className="text-4xl text-corp font-medium"><CountUp end={dashboard_data.users.instructors.length} /></span>
                                    </div>

                                    <div>
                                        <p className="text-inactive text-sm">{intl.formatMessage({ id: "page.users.invites_count" })}:</p>
                                        <span className="text-4xl text-corp font-medium"><CountUp end={dashboard_data.users.invites.length} /></span>
                                    </div>

                                    <div className="col-span-6 lg:col-span-3">
                                        <p className="text-inactive text-sm">{intl.formatMessage({ id: "page.groups.count" })}:</p>
                                        <span className="text-4xl text-corp font-medium"><CountUp end={dashboard_data.users.groups} /></span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                }
            </RoleProvider>
        </DashboardLayout>
    );
}