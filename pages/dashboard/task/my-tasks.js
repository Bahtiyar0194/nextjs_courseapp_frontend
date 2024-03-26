import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { AiOutlineCheckCircle, AiOutlineEdit, AiOutlineFileDone, AiOutlineSearch, AiOutlineUser } from "react-icons/ai";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import TypicalTasksList from "../../../components/lesson/lesson_task_modals/task_components/TypicalTasksList";
import TestsList from "../../../components/lesson/lesson_task_modals/task_components/TestsList";
import PersonalTasksList from "../../../components/lesson/lesson_task_modals/task_components/PersonalTasksList";
import VerificationTasksList from "../../../components/lesson/lesson_task_modals/task_components/VerificationTasksList";
import CompletedTasksList from "../../../components/lesson/lesson_task_modals/task_components/CompletedTasksList";
import { useSelector } from "react-redux";

import serialize from 'form-serialize';

export default function MyTasks() {
    const [main_tab, setMainTab] = useState('typical');
    const router = useRouter();
    const [showFullLoader, setShowFullLoader] = useState(false);
    const intl = useIntl();

    const [task_attributes, setTaskAttributes] = useState([]);

    const [typical_tasks, setTypicalTasks] = useState([]);
    const [tests, setTests] = useState([]);
    const [personal_tasks, setPersonalTasks] = useState([]);
    const [verification_tasks, setVerificationTasks] = useState([]);
    const [completed_tasks, setCompletedTasks] = useState([]);

    const [typical_tasks_loader, setTypicalTasksLoader] = useState(false);
    const [tests_loader, setTestsLoader] = useState(false);
    const [personal_tasks_loader, setPersonalTasksLoader] = useState(false);
    const [verification_tasks_loader, setVerificationTasksLoader] = useState(false);
    const [completed_tasks_loader, setCompletedTasksLoader] = useState(false);

    const user = useSelector((state) => state.authUser.user);

    const getTaskAttributes = async () => {
        setShowFullLoader(true);
        await axios.get('tasks/get_attributes')
            .then(response => {
                setTaskAttributes(response.data);
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

    const getTypicalTasks = async (url) => {
        setTypicalTasksLoader(true);
        const search_form = document.querySelector('#typical_tasks_search_form');
        const form_body = serialize(search_form, { hash: true, empty: true });

        form_body.per_page = document.querySelector('#typical-tasks-per-page-select')?.value;

        if (!url) {
            url = 'tasks/get_typical_tasks';
        }

        await axios.post(url, form_body)
            .then(response => {
                setTypicalTasks(response.data)
                setTypicalTasksLoader(false);
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

    const getTests = async (url) => {
        setTestsLoader(true);
        const search_form = document.querySelector('#tests_search_form');
        const form_body = serialize(search_form, { hash: true, empty: true });

        form_body.per_page = document.querySelector('#tests-per-page-select')?.value;

        if (!url) {
            url = 'tasks/get_tests';
        }

        await axios.post(url, form_body)
            .then(response => {
                setTests(response.data)
                setTestsLoader(false);
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

    const getPersonalTasks = async (url) => {
        setPersonalTasksLoader(true);
        const search_form = document.querySelector('#personal_tasks_search_form');
        const form_body = serialize(search_form, { hash: true, empty: true });

        form_body.per_page = document.querySelector('#personal-tasks-per-page-select')?.value;

        if (!url) {
            url = 'tasks/get_personal_tasks';
        }

        await axios.post(url, form_body)
            .then(response => {
                setPersonalTasks(response.data)
                setPersonalTasksLoader(false);
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

    const getVerificationTasks = async (url) => {
        setVerificationTasksLoader(true);
        const search_form = document.querySelector('#verification_tasks_search_form');
        const form_body = serialize(search_form, { hash: true, empty: true });

        form_body.per_page = document.querySelector('#verification-tasks-per-page-select')?.value;

        if (!url) {
            url = 'tasks/get_verification_tasks';
        }

        await axios.post(url, form_body)
            .then(response => {
                setVerificationTasks(response.data)
                setVerificationTasksLoader(false);
                setShowFullLoader(false);
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

    const getCompletedTasks = async (url) => {
        setCompletedTasksLoader(true);
        const search_form = document.querySelector('#completed_tasks_search_form');
        const form_body = serialize(search_form, { hash: true, empty: true });

        form_body.per_page = document.querySelector('#completed-tasks-per-page-select')?.value;

        if (!url) {
            url = 'tasks/get_completed_tasks';
        }

        await axios.post(url, form_body)
            .then(response => {
                setCompletedTasks(response.data)
                setCompletedTasksLoader(false);
                setShowFullLoader(false);
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

    const tabs = [
        {
            name: 'typical',
            title: intl.formatMessage({ id: "page.tasks.typical_tasks" }),
            icon: <AiOutlineEdit />,
            content: <TypicalTasksList typical_tasks={typical_tasks} getTypicalTasks={getTypicalTasks} typical_tasks_loader={typical_tasks_loader} />
        },
        {
            name: 'tests',
            title: intl.formatMessage({ id: "task.tests" }),
            icon: <AiOutlineFileDone />,
            content: <TestsList tests={tests} getTests={getTests} tests_loader={tests_loader} />
        },
        {
            name: 'personal',
            title: intl.formatMessage({ id: "page.tasks.personal_tasks" }),
            icon: <AiOutlineUser />,
            content: <PersonalTasksList personal_tasks={personal_tasks} getPersonalTasks={getPersonalTasks} personal_tasks_loader={personal_tasks_loader} />
        },
        {
            name: 'on_verification',
            title: intl.formatMessage({ id: "page.tasks.on_verification" }),
            icon: <AiOutlineSearch />,
            content: <VerificationTasksList verification_tasks={verification_tasks} getVerificationTasks={getVerificationTasks} verification_tasks_loader={verification_tasks_loader} task_attributes={task_attributes} />
        },
        {
            name: 'completed',
            title: intl.formatMessage({ id: "page.tasks.completed_tasks" }),
            icon: <AiOutlineCheckCircle />,
            content: <CompletedTasksList completed_tasks={completed_tasks} getCompletedTasks={getCompletedTasks} completed_tasks_loader={completed_tasks_loader} task_attributes={task_attributes} />
        }
    ];

    useEffect(() => {
        if (router.isReady) {
            setShowFullLoader(true);
        }
    }, [router.isReady]);

    useEffect(() => {
        if (user.current_role_id) {
            getTaskAttributes();
            getTypicalTasks();
            getTests();
            getPersonalTasks();
            getVerificationTasks();
            getCompletedTasks();
            setShowFullLoader(false);
        }
    }, [user.current_role_id]);

    return (
        <DashboardLayout showLoader={showFullLoader} title={intl.formatMessage({ id: "page.tasks.title" })}>
            <Breadcrumb>
                {intl.formatMessage({ id: "page.tasks.title" })}
            </Breadcrumb>

            <div className="col-span-12">
                <div className="title-wrap">
                    <h2>{intl.formatMessage({ id: "page.tasks.title" })}</h2>
                    <div className="btn-wrap">
                        {tabs.map((tab, i) => (
                            <div key={i} onClick={e => setMainTab(tab.name)} className={"tab-header-item" + (main_tab === tab.name ? ' active' : '')}>
                                {tab.icon} <span>{tab.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="col-span-12">
                <div className="tab-body">
                    {tabs.map((tab, i) => (
                        <div key={i} className={'tab-body-item' + (main_tab === tab.name ? ' active' : '')}>
                            {tab.content}
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}