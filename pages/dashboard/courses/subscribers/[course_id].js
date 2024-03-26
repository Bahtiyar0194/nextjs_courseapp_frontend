import DashboardLayout from "../../../../components/layouts/DashboardLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Modal from "../../../../components/ui/Modal";
import { AiOutlineCalendar, AiOutlineCheckCircle, AiOutlineEdit, AiOutlineMail, AiOutlineMessage, AiOutlineSearch, AiOutlineUndo, AiOutlineUser, AiOutlineUserAdd, AiOutlineUsergroupAdd } from "react-icons/ai";
import axios from "axios";
import Breadcrumb from "../../../../components/ui/Breadcrumb";
import RoleProvider from "../../../../services/RoleProvider";
import Loader from "../../../../components/ui/Loader";
import Pagination from "../../../../components/ui/Pagination";
import serialize from 'form-serialize';
import Alert from "../../../../components/ui/Alert";
import debounceHandler from "../../../../utils/debounceHandler";
import StickyBox from "react-sticky-box";
import UserAvatar from "../../../../components/ui/UserAvatar";
import Link from "next/link";
import InviteSubscriberModal from "../../../../components/course/InviteSubscriberModal";
import AcceptRequestModal from "../../../../components/course/AcceptRequestModal";

export default function Subscribers() {
    const [course, setCourse] = useState([]);
    const [main_tab, setMainTab] = useState('subscribers');
    const intl = useIntl();
    const [invite_subscriber_modal, setInviteSubscriberModal] = useState(false);
    const [subscribers, setSubscribers] = useState([]);
    const [invites, setInvites] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loader, setLoader] = useState(false);
    const [subscribers_loader, setSubscribersLoader] = useState(false);
    const [invites_loader, setInvitesLoader] = useState(false);
    const [requests_loader, setRequestsLoader] = useState(false);
    const [showFullLoader, setShowFullLoader] = useState(true);
    const router = useRouter();
    const [search_subscriber_filter, setSearchSubscriberFilter] = useState(false);
    const [search_invite_filter, setSearchInviteFilter] = useState(false);
    const [search_request_filter, setSearchRequestFilter] = useState(false);

    const [accept_request_id, setAcceptRequestId] = useState('');
    const [accept_request_modal, setAcceptRequestModal] = useState(false);

    const getCourse = async (course_id) => {
        await axios.get('courses/my-courses/' + course_id)
            .then(response => {
                setCourse(response.data);
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

    const getSubscribers = async (url) => {
        setSubscribersLoader(true);
        const search_form = document.querySelector('#subscriber_search_form');
        const form_body = serialize(search_form, { hash: true, empty: true });

        form_body.per_page = document.querySelector('#subscriber-per-page-select')?.value;

        if (!url) {
            url = 'courses/get_subscribers/' + router.query.course_id;
        }

        await axios.post(url, form_body)
            .then(response => {
                setSubscribers(response.data)
                setSubscribersLoader(false);
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

    const getInvites = async (url) => {
        setInvitesLoader(true);
        const search_form = document.querySelector('#invite_search_form');
        const form_body = serialize(search_form, { hash: true, empty: true });

        form_body.per_page = document.querySelector('#invites-per-page-select')?.value;

        if (!url) {
            url = 'courses/get_invites/' + router.query.course_id;
        }

        await axios.post(url, form_body)
            .then(response => {
                setInvites(response.data)
                setInvitesLoader(false);
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

    const getRequests = async (url) => {
        setRequestsLoader(true);
        const search_form = document.querySelector('#request_search_form');
        const form_body = serialize(search_form, { hash: true, empty: true });

        form_body.per_page = document.querySelector('#requests-per-page-select')?.value;

        if (!url) {
            url = 'courses/get_requests/' + router.query.course_id;
        }

        await axios.post(url, form_body)
            .then(response => {
                setRequests(response.data)
                setRequestsLoader(false);
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

    const showHideSubscriberSearchFilter = () => {
        if (search_subscriber_filter === true) {
            setSearchSubscriberFilter(false);
            resetSubscriberSearchFilter();
        }
        else {
            setSearchSubscriberFilter(true);
        }
    }

    const resetSubscriberSearchFilter = () => {
        const search_form = document.querySelector('#subscriber_search_form');
        search_form.reset();
        getSubscribers();
    }

    const showHideInviteSearchFilter = () => {
        if (search_invite_filter === true) {
            setSearchInviteFilter(false);
            resetInviteSearchFilter();
        }
        else {
            setSearchInviteFilter(true);
        }
    }

    const resetInviteSearchFilter = () => {
        const search_form = document.querySelector('#invite_search_form');
        search_form.reset();
        getInvites();
    }

    const showHideRequestSearchFilter = () => {
        if (search_request_filter === true) {
            setSearchRequestFilter(false);
            resetRequestSearchFilter();
        }
        else {
            setSearchRequestFilter(true);
        }
    }

    const resetRequestSearchFilter = () => {
        const search_form = document.querySelector('#request_search_form');
        search_form.reset();
        getRequests();
    }

    const acceptRequest = (request_id) => {
        setAcceptRequestId(request_id);
        setAcceptRequestModal(true);
    }

    useEffect(() => {
        if (router.isReady) {
            const { course_id } = router.query;
            setShowFullLoader(true);
            getCourse(course_id);
            getSubscribers();
            getInvites();
            getRequests();
        }
    }, [router.isReady]);

    return (
        <DashboardLayout showLoader={showFullLoader} title={intl.formatMessage({ id: "page.my_courses.subscribers_title" })}>
            <RoleProvider roles={[2, 3]} redirect={true}>
                <Breadcrumb>
                    {course.subscribed == true
                        ?
                        <Link href={'/dashboard/courses/my-courses'}>{intl.formatMessage({ id: "page.my_courses.title" })}</Link>
                        :
                        <Link href={'/dashboard/courses/catalogue'}>{intl.formatMessage({ id: "page.courses_catalogue.title" })}</Link>
                    }
                    <Link href={'/dashboard/courses/' + course.course_id}>{course.course_name}</Link>
                    {intl.formatMessage({ id: "page.my_courses.subscribers_title" })}
                </Breadcrumb>

                <div className="col-span-12">
                    <div className="title-wrap">
                        <h2>{intl.formatMessage({ id: "page.my_courses.subscribers_title" })}</h2>
                        <div className="btn-wrap">
                            <div onClick={e => setMainTab('subscribers')} className={"tab-header-item " + (main_tab === 'subscribers' && 'active')}>
                                <AiOutlineUser /> <span>{intl.formatMessage({ id: "page.my_courses.subscribers" })}</span>
                                {course.subscribers?.length > 0 &&
                                    <>
                                        : <span className="count-badge">{course.subscribers.length}</span>
                                    </>
                                }
                            </div>
                            <div onClick={e => setMainTab('invites')} className={"tab-header-item " + (main_tab === 'invites' && 'active')}>
                                <AiOutlineMail /> <span>{intl.formatMessage({ id: "page.my_courses.invitations" })}</span>
                            </div>
                            <div onClick={e => setMainTab('requests')} className={"tab-header-item " + (main_tab === 'requests' && 'active')}>
                                <AiOutlineMessage /> <span>{intl.formatMessage({ id: "page.my_courses.requests" })}</span>
                                {course?.in_the_request > 0 &&
                                    <>
                                        : <span className="count-badge">{course.in_the_request}</span>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-12">
                    <div className="tab-body">

                        <div className={'tab-body-item ' + (main_tab === 'subscribers' && 'active')}>
                            <div className="custom-grid">
                                <div className="col-span-12">
                                    <div className="btn-wrap">
                                        <button onClick={() => showHideSubscriberSearchFilter()} className="btn btn-light"><AiOutlineSearch /> <span>{search_subscriber_filter === true ? intl.formatMessage({ id: "hide_search_filter" }) : intl.formatMessage({ id: "show_search_filter" })}</span></button>
                                    </div>
                                </div>

                                {search_subscriber_filter === true
                                    &&
                                    <div className="col-span-12 lg:col-span-3">
                                        <StickyBox offsetTop={6} offsetBottom={6}>
                                            <div className="card p-4">
                                                <h5>{intl.formatMessage({ id: "page.my_courses.search_subscribers_filter" })}</h5>
                                                <form id="subscriber_search_form">
                                                    <div className="custom-grid">

                                                        <div className="col-span-12">
                                                            <div className="form-group-border active">
                                                                <AiOutlineUser />
                                                                <input autoComplete="search-subscriber" type="text" defaultValue={''} name="subscriber" placeholder=" " onChange={debounceHandler(getSubscribers, 1000)} />
                                                                <label>{intl.formatMessage({ id: "page.my_courses.subscriber" })} ({intl.formatMessage({ id: "page.registration.form.last_name" })}, {intl.formatMessage({ id: "page.registration.form.first_name" })})</label>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12">
                                                            <div className="form-group-border active">
                                                                <AiOutlineMail />
                                                                <input autoComplete="search-subscriber-email" type="text" defaultValue={''} name="email" placeholder=" " onChange={debounceHandler(getSubscribers, 1000)} />
                                                                <label>{intl.formatMessage({ id: "page.registration.form.email" })}</label>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12">
                                                            <div className="form-group-border select active">
                                                                <AiOutlineUser />
                                                                <select name="subscribe_type_id" defaultValue={''} onChange={debounceHandler(getSubscribers, 1000)}>
                                                                    <option selected value="">{intl.formatMessage({ id: "not_specified" })}</option>
                                                                    {
                                                                        course?.subscribe_types?.map(subscribe_type => (
                                                                            <option key={subscribe_type.subscribe_type_id} value={subscribe_type.subscribe_type_id}>{subscribe_type.subscribe_type_name}</option>
                                                                        ))
                                                                    }
                                                                </select>
                                                                <label>{intl.formatMessage({ id: "page.courses.subscribersModal.subscribe_type" })}</label>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12">
                                                            <div className="form-group-border active">
                                                                <AiOutlineUser />
                                                                <input autoComplete="search-mentor" type="text" defaultValue={''} name="mentor" placeholder=" " onChange={debounceHandler(getSubscribers, 1000)} />
                                                                <label>{intl.formatMessage({ id: "mentor" })} ({intl.formatMessage({ id: "page.registration.form.last_name" })}, {intl.formatMessage({ id: "page.registration.form.first_name" })})</label>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12">
                                                            <div className="form-group-border active">
                                                                <AiOutlineUser />
                                                                <input autoComplete="search-operator" type="text" defaultValue={''} name="operator" placeholder=" " onChange={debounceHandler(getSubscribers, 1000)} />
                                                                <label>{intl.formatMessage({ id: "operator" })} ({intl.formatMessage({ id: "page.registration.form.last_name" })}, {intl.formatMessage({ id: "page.registration.form.first_name" })})</label>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12">
                                                            <div className="form-group-border active">
                                                                <AiOutlineCalendar />
                                                                <input type="date" defaultValue={''} name="created_at_from" onChange={debounceHandler(getSubscribers, 1000)} placeholder=" " />
                                                                <label>{intl.formatMessage({ id: "subscribed_at_from" })}</label>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12">
                                                            <div className="form-group-border active">
                                                                <AiOutlineCalendar />
                                                                <input type="date" defaultValue={''} name="created_at_to" onChange={debounceHandler(getSubscribers, 1000)} placeholder=" " />
                                                                <label>{intl.formatMessage({ id: "subscribed_at_to" })}</label>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12">
                                                            <div className="btn-wrap">
                                                                <button type="button" className="btn btn-sm btn-outline-primary" onClick={debounceHandler(resetSubscriberSearchFilter, 500)}> <AiOutlineUndo /> <span>{intl.formatMessage({ id: "reset_search_filter" })}</span></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </StickyBox>
                                    </div>
                                }

                                <div className={"relative col-span-12 " + (search_subscriber_filter === true ? 'lg:col-span-9' : '')}>
                                    {subscribers.data?.length > 0 ?
                                        <>
                                            <div className="relative">
                                                {subscribers_loader && <Loader className="overlay" />}
                                                <div className="table table-sm table-responsive">
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>{intl.formatMessage({ id: "page.my_courses.subscriber" })}</th>
                                                                <th>{intl.formatMessage({ id: "page.registration.form.email" })}</th>
                                                                <th>{intl.formatMessage({ id: "mentor" })}</th>
                                                                <th>{intl.formatMessage({ id: "operator" })}</th>
                                                                <th>{intl.formatMessage({ id: "page.courses.subscribersModal.subscribe_type" })}</th>
                                                                <th>{intl.formatMessage({ id: "cost" })}</th>
                                                                <th>{intl.formatMessage({ id: "subscribed_at" })}</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {subscribers.data?.map(s => (
                                                                <tr key={s.user_id}>
                                                                    <td>
                                                                        <div className="flex gap-x-2 items-center">
                                                                            <UserAvatar user_avatar={s.recipient_avatar} className={'w-10 h-10'} padding={0.5} />
                                                                            {s.recipient_last_name} {s.recipient_first_name}
                                                                        </div>
                                                                    </td>
                                                                    <td>{s.email}</td>
                                                                    <td>
                                                                        <div className="flex gap-x-2 items-center">
                                                                            <UserAvatar user_avatar={s.mentor_avatar} className={'w-10 h-10'} padding={0.5} />
                                                                            {s.mentor_last_name} {s.mentor_first_name}
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="flex gap-x-2 items-center">
                                                                            <UserAvatar user_avatar={s.operator_avatar} className={'w-10 h-10'} padding={0.5} />
                                                                            {s.operator_last_name} {s.operator_first_name}
                                                                        </div>
                                                                    </td>
                                                                    <td>{s.subscribe_type_name}</td>
                                                                    <td>{s.cost.toLocaleString()}</td>
                                                                    <td>{new Date(s.created_at).toLocaleString()}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="btn-wrap mt-6">
                                                <Pagination items={subscribers} setItems={getSubscribers} select_id={"subscriber-per-page-select"} />
                                            </div>
                                        </>
                                        :
                                        <Alert className="alert light">
                                            {subscribers_loader && <Loader className="overlay" />}
                                            <p className="mb-0">{intl.formatMessage({ id: "nothing_was_found_for_your_query" })}</p>
                                        </Alert>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className={'tab-body-item ' + (main_tab === 'invites' && 'active')}>
                            <div className="custom-grid">
                                <div className="col-span-12">
                                    <div className="btn-wrap">
                                        <button onClick={() => setInviteSubscriberModal(true)} className="btn btn-outline-primary"><AiOutlineUserAdd /> <span>{intl.formatMessage({ id: "invite" })}</span></button>
                                        <button onClick={() => showHideInviteSearchFilter()} className="btn btn-light"><AiOutlineSearch /> <span>{search_invite_filter === true ? intl.formatMessage({ id: "hide_search_filter" }) : intl.formatMessage({ id: "show_search_filter" })}</span></button>
                                    </div>
                                </div>

                                {search_invite_filter === true
                                    &&
                                    <div className="col-span-12 lg:col-span-3">
                                        <StickyBox offsetTop={6} offsetBottom={6}>
                                            <div className="card p-4">
                                                <h5>{intl.formatMessage({ id: "page.my_courses.search_invites_filter" })}</h5>
                                                <form id="invite_search_form">
                                                    <div className="custom-grid">

                                                        <div className="col-span-12">
                                                            <div className="form-group-border active">
                                                                <AiOutlineMail />
                                                                <input autoComplete="search-email" type="text" defaultValue={''} name="email" placeholder=" " onChange={debounceHandler(getInvites, 1000)} />
                                                                <label>{intl.formatMessage({ id: "page.registration.form.email" })}</label>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12">
                                                            <div className="form-group-border active">
                                                                <AiOutlineCalendar />
                                                                <input type="date" defaultValue={''} name="created_at_from" onChange={debounceHandler(getInvites, 1000)} placeholder=" " />
                                                                <label>{intl.formatMessage({ id: "invited_at_from" })}</label>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12">
                                                            <div className="form-group-border active">
                                                                <AiOutlineCalendar />
                                                                <input type="date" defaultValue={''} name="created_at_to" onChange={debounceHandler(getInvites, 1000)} placeholder=" " />
                                                                <label>{intl.formatMessage({ id: "invited_at_to" })}</label>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12">
                                                            <div className="btn-wrap">
                                                                <button type="button" className="btn btn-sm btn-outline-primary" onClick={debounceHandler(resetInviteSearchFilter, 500)}> <AiOutlineUndo /> <span>{intl.formatMessage({ id: "reset_search_filter" })}</span></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </StickyBox>
                                    </div>
                                }

                                <div className={"relative col-span-12 " + (search_invite_filter === true ? 'lg:col-span-9' : '')}>
                                    {invites.data?.length > 0 ?
                                        <>
                                            <div className="relative">
                                                {invites_loader && <Loader className="overlay" />}
                                                <div className="table table-sm">
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>{intl.formatMessage({ id: "page.registration.form.email" })}</th>
                                                                <th>{intl.formatMessage({ id: "mentor" })}</th>
                                                                <th>{intl.formatMessage({ id: "operator" })}</th>
                                                                <th>{intl.formatMessage({ id: "cost" })}</th>
                                                                <th>{intl.formatMessage({ id: "status" })}</th>
                                                                <th>{intl.formatMessage({ id: "invited_at" })}</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {invites.data?.map(s => (
                                                                <tr key={s.invite_id}>
                                                                    <td>{s.subscriber_email}</td>
                                                                    <td>{s.mentor_last_name} {s.mentor_first_name}</td>
                                                                    <td>{s.operator_last_name} {s.operator_first_name}</td>
                                                                    <td>{s.course_cost.toLocaleString()}</td>
                                                                    <td>{s.status_type_name}</td>
                                                                    <td>{new Date(s.created_at).toLocaleString()}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="btn-wrap mt-6">
                                                <Pagination items={invites} setItems={getInvites} select_id={"invites-per-page-select"} />
                                            </div>
                                        </>
                                        :
                                        <Alert className="alert light">
                                            {invites_loader && <Loader className="overlay" />}
                                            <p className="mb-0">{intl.formatMessage({ id: "nothing_was_found_for_your_query" })}</p>
                                        </Alert>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className={'tab-body-item ' + (main_tab === 'requests' && 'active')}>
                            <div className="custom-grid">
                                <div className="col-span-12">
                                    <div className="btn-wrap">
                                        <button onClick={() => showHideRequestSearchFilter()} className="btn btn-light"><AiOutlineSearch /> <span>{search_request_filter === true ? intl.formatMessage({ id: "hide_search_filter" }) : intl.formatMessage({ id: "show_search_filter" })}</span></button>
                                    </div>
                                </div>

                                {search_request_filter === true
                                    &&
                                    <div className="col-span-12 lg:col-span-3">
                                        <StickyBox offsetTop={6} offsetBottom={6}>
                                            <div className="card p-4">
                                                <h5>{intl.formatMessage({ id: "page.my_courses.search_requests_filter" })}</h5>
                                                <form id="request_search_form">
                                                    <div className="custom-grid">

                                                        <div className="col-span-12">
                                                            <div className="form-group-border active">
                                                                <AiOutlineUser />
                                                                <input autoComplete="search-initiator" type="text" defaultValue={''} name="initiator" placeholder=" " onChange={debounceHandler(getRequests, 1000)} />
                                                                <label>{intl.formatMessage({ id: "applicant" })} ({intl.formatMessage({ id: "page.registration.form.last_name" })}, {intl.formatMessage({ id: "page.registration.form.first_name" })})</label>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12">
                                                            <div className="form-group-border active">
                                                                <AiOutlineMail />
                                                                <input autoComplete="search-email" type="text" defaultValue={''} name="email" placeholder=" " onChange={debounceHandler(getRequests, 1000)} />
                                                                <label>{intl.formatMessage({ id: "page.registration.form.email" })}</label>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12">
                                                            <div className="form-group-border active">
                                                                <AiOutlineCalendar />
                                                                <input type="date" defaultValue={''} name="created_at_from" onChange={debounceHandler(getRequests, 1000)} placeholder=" " />
                                                                <label>{intl.formatMessage({ id: "request_at_from" })}</label>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12">
                                                            <div className="form-group-border active">
                                                                <AiOutlineCalendar />
                                                                <input type="date" defaultValue={''} name="created_at_to" onChange={debounceHandler(getRequests, 1000)} placeholder=" " />
                                                                <label>{intl.formatMessage({ id: "request_at_to" })}</label>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12">
                                                            <div className="btn-wrap">
                                                                <button type="button" className="btn btn-sm btn-outline-primary" onClick={debounceHandler(resetRequestSearchFilter, 500)}> <AiOutlineUndo /> <span>{intl.formatMessage({ id: "reset_search_filter" })}</span></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </StickyBox>
                                    </div>
                                }

                                <div className={"relative col-span-12 " + (search_request_filter === true ? 'lg:col-span-9' : '')}>
                                    {requests.data?.length > 0 ?
                                        <>
                                            <div className="relative">
                                                {requests_loader && <Loader className="overlay" />}
                                                <div className="table table-sm">
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>{intl.formatMessage({ id: "applicant" })}</th>
                                                                <th>{intl.formatMessage({ id: "page.registration.form.email" })}</th>
                                                                <th>{intl.formatMessage({ id: "page.registration.form.phone" })}</th>
                                                                <th>{intl.formatMessage({ id: "status" })}</th>
                                                                <th>{intl.formatMessage({ id: "request_at" })}</th>
                                                                <th></th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {requests.data?.map(r => (
                                                                <tr key={r.request_id}>
                                                                    <td>
                                                                        <div className="flex gap-x-2 items-center">
                                                                            <UserAvatar user_avatar={r.initiator_avatar} className={'w-10 h-10'} padding={0.5} />
                                                                            {r.initiator_last_name} {r.initiator_first_name}
                                                                        </div>
                                                                    </td>
                                                                    <td>{r.initiator_email}</td>
                                                                    <td>{r.initiator_phone}</td>
                                                                    <td>{r.status_type_name}</td>
                                                                    <td>{new Date(r.created_at).toLocaleString()}</td>
                                                                    <td>
                                                                        {r.status_type_id == 12 && <button onClick={e => acceptRequest(r.request_id)} className="btn btn-outline-primary"><AiOutlineCheckCircle /> <span>{intl.formatMessage({ id: "accept" })}</span></button>}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="btn-wrap mt-6">
                                                <Pagination items={requests} setItems={getRequests} select_id={"requests-per-page-select"} />
                                            </div>
                                        </>
                                        :
                                        <Alert className="alert light">
                                            {requests_loader && <Loader className="overlay" />}
                                            <p className="mb-0">{intl.formatMessage({ id: "nothing_was_found_for_your_query" })}</p>
                                        </Alert>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal show={invite_subscriber_modal} onClose={() => setInviteSubscriberModal(false)} modal_title={intl.formatMessage({ id: "page.subscribers.invite_user_title" })} modal_size="modal-xl">
                    <InviteSubscriberModal
                        course={course}
                        loader={loader}
                        setLoader={setLoader}
                        getInvites={getInvites}
                        intl={intl}
                        router={router}
                        closeModal={() => setInviteSubscriberModal(false)} />
                </Modal>

                <Modal show={accept_request_modal} onClose={() => setAcceptRequestModal(false)} modal_title={intl.formatMessage({ id: "page.requests.accept_request_title" })} modal_size="modal-xl">
                    <AcceptRequestModal
                        request_id={accept_request_id}
                        course={course}
                        getSubscribers={getSubscribers}
                        getRequests={getRequests}
                        getCourse={getCourse}
                        loader={loader}
                        setLoader={setLoader}
                        intl={intl}
                        router={router}
                        closeModal={() => setAcceptRequestModal(false)} />
                </Modal>

                {/* <Modal show={edit_user_modal} onClose={() => setEditUserModal(false)} modal_title={intl.formatMessage({ id: "page.subscribers.edit_user_title" })} modal_size="modal-xl">
                    <EditUserModal
                        edit_user={edit_user}
                        getUsers={getUsers}
                        edit_user_phone={edit_user_phone}
                        setEditUserPhone={setEditUserPhone}
                        loader={loader}
                        setLoader={setLoader}
                        error={error}
                        setError={setError}
                        intl={intl}
                        router={router}
                        closeModal={() => setEditUserModal(false)} />
                </Modal>

                <Modal show={create_group_modal} onClose={() => setCreateGroupModal(false)} modal_title={intl.formatMessage({ id: "page.groups.create_group_title" })} modal_size="modal-xl">
                    <CreateGroupModal
                        loader={loader}
                        setLoader={setLoader}
                        group_attributes={group_attributes}
                        getGroups={getGroups}
                        error={error}
                        setError={setError}
                        intl={intl}
                        router={router}
                        closeModal={() => setCreateGroupModal(false)} />
                </Modal>

                <Modal show={edit_group_modal} onClose={() => setEditGroupModal(false)} modal_title={intl.formatMessage({ id: "page.groups.edit_group_title" })} modal_size="modal-xl">
                    <UpdateGroupModal
                        loader={loader}
                        setLoader={setLoader}
                        group_attributes={group_attributes}
                        edit_group_members={edit_group_members}
                        setEditGroupMembers={setEditGroupMembers}
                        edit_group={edit_group}
                        edit_group_name={edit_group_name}
                        setEditGroupName={setEditGroupName}
                        edit_group_description={edit_group_description}
                        setEditGroupDescription={setEditGroupDescription}
                        setEditGroup={setEditGroup}
                        getGroups={getGroups}
                        error={error}
                        setError={setError}
                        intl={intl}
                        router={router}
                        closeModal={() => setEditGroupModal(false)} />
                </Modal> */}
            </RoleProvider>
        </DashboardLayout>
    );
}