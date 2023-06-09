import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Modal from "../../../components/ui/Modal";
import { AiOutlineCalendar, AiOutlineEdit, AiOutlineMail, AiOutlinePhone, AiOutlineSearch, AiOutlineTeam, AiOutlineUndo, AiOutlineUser, AiOutlineUserAdd, AiOutlineUsergroupAdd } from "react-icons/ai";
import axios from "axios";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import RoleProvider from "../../../services/RoleProvider";
import InviteUserModal from "../../../components/users-groups/InviteUserModal";
import EditUserModal from "../../../components/users-groups/EditUserModal";
import CreateGroupModal from "../../../components/users-groups/CreateGroupModal";
import Loader from "../../../components/ui/Loader";
import Pagination from "../../../components/ui/Pagination";
import InputMask from "react-input-mask";
import serialize from 'form-serialize';
import Alert from "../../../components/ui/Alert";
import debounceHandler from "../../../utils/debounceHandler";
import StickyBox from "react-sticky-box";
import UserAvatar from "../../../components/ui/UserAvatar";

export default function Users() {
    const [main_tab, setMainTab] = useState('users');
    const intl = useIntl();
    const [invite_user_modal, setInviteUserModal] = useState(false);
    const [edit_user_modal, setEditUserModal] = useState(false);
    const [create_group_modal, setCreateGroupModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [loader, setLoader] = useState(false);
    const [users_loader, setUsersLoader] = useState(false);
    const [showFullLoader, setShowFullLoader] = useState(true);
    const [edit_user, setEditUser] = useState([]);
    const [invite_user_phone, setInviteUserPhone] = useState('');
    const [edit_user_phone, setEditUserPhone] = useState('');
    const [search_user_phone, setSearchUserPhone] = useState('');
    const router = useRouter();
    const [error, setError] = useState([]);
    const [search_user_filter, setSearchUserFilter] = useState(false);

    const [group_attributes, setGroupAttributes] = useState([]);
    const [groups_loader, setGroupsLoader] = useState(false);
    const [groups, setGroups] = useState([]);
    const [search_group_filter, setSearchGroupFilter] = useState(false);

    const getEditUser = async (user_id) => {
        setLoader(true);
        setEditUserModal(true);
        await axios.get('users/get/' + user_id)
            .then(response => {
                setError([]);
                setEditUser(response.data);
                setEditUserPhone(response.data.phone);
                setLoader(false);
            }).catch(err => {
                console.log(err)
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

    const getUsers = async (url) => {
        setUsersLoader(true);
        const search_form = document.querySelector('#user_search_form');
        const form_body = serialize(search_form, { hash: true, empty: true });

        form_body.per_page = document.querySelector('#per-page-select')?.value;

        if (!url) {
            url = 'users/get';
        }

        await axios.post(url, form_body)
            .then(response => {
                setUsers(response.data)
                setUsersLoader(false);
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

    const getGroupAttributes = async () => {
        setLoader(true);
        await axios.get('/groups/get_group_attributes')
            .then(response => {
                setGroupAttributes(response.data)
                setLoader(false);
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

    const getGroups = async (url) => {
        setGroupsLoader(true);
        const search_form = document.querySelector('#group_search_form');
        const form_body = serialize(search_form, { hash: true, empty: true });

        form_body.per_page = document.querySelector('#per-page-select')?.value;

        if (!url) {
            url = 'groups/get';
        }

        await axios.post(url, form_body)
            .then(response => {
                setGroups(response.data)
                setGroupsLoader(false);
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

    const showHideUserSearchFilter = () => {
        if (search_user_filter === true) {
            setSearchUserFilter(false);
            resetUserSearchFilter();
        }
        else {
            setSearchUserFilter(true);
        }
    }

    const resetUserSearchFilter = () => {
        const search_form = document.querySelector('#user_search_form');
        search_form.querySelector('input[name="first_name"]').value = '';
        search_form.querySelector('input[name="last_name"]').value = '';
        search_form.querySelector('input[name="email"]').value = '';
        setSearchUserPhone('');
        search_form.querySelector('input[name="created_at_from"]').value = '';
        search_form.querySelector('input[name="created_at_to"]').value = '';
        getUsers();
    }

    const showHideGroupSearchFilter = () => {
        if (search_group_filter === true) {
            setSearchGroupFilter(false);
            resetGroupSearchFilter();
        }
        else {
            setSearchGroupFilter(true);
        }
    }

    const resetGroupSearchFilter = () => {
        const search_form = document.querySelector('#group_search_form');
        search_form.querySelector('input[name="group_name"]').value = '';
        search_form.querySelector('input[name="created_at_from"]').value = '';
        search_form.querySelector('input[name="created_at_to"]').value = '';
        getGroups();
    }

    useEffect(() => {
        setShowFullLoader(true);
        getUsers();
        getGroupAttributes();
        getGroups();
    }, []);

    return (
        <DashboardLayout showLoader={showFullLoader} title={intl.formatMessage({ id: "page.users.title" })}>
            <RoleProvider roles={[2]} redirect={true}>
                <Breadcrumb>
                    {intl.formatMessage({ id: "page.users.title" })}
                </Breadcrumb>

                <div className="col-span-12">
                    <div className="title-wrap">
                        <h2>{intl.formatMessage({ id: "page.users.title" })}</h2>
                        <div className="btn-wrap">
                            <div onClick={e => setMainTab('users')} className={"tab-header-item " + (main_tab === 'users' && 'active')}>
                                <AiOutlineUser /> <span>{intl.formatMessage({ id: "page.users" })}</span>
                            </div>
                            <div onClick={e => setMainTab('groups')} className={"tab-header-item " + (main_tab === 'groups' && 'active')}>
                                <AiOutlineTeam /> <span>{intl.formatMessage({ id: "page.groups.title" })}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-12">
                    <div className="tab-body">

                        <div className={'tab-body-item ' + (main_tab === 'users' && 'active')}>
                            <div className="custom-grid">
                                <div className="col-span-12">
                                    <div className="btn-wrap">
                                        <button onClick={() => setInviteUserModal(true)} className="btn btn-outline-primary"><AiOutlineUserAdd /> <span>{intl.formatMessage({ id: "invite" })}</span></button>
                                        <button onClick={() => showHideUserSearchFilter()} className="btn btn-light"><AiOutlineSearch /> <span>{search_user_filter === true ? intl.formatMessage({ id: "hide_search_filter" }) : intl.formatMessage({ id: "show_search_filter" })}</span></button>
                                    </div>
                                </div>

                                {search_user_filter === true
                                    &&
                                    <div className="col-span-12 lg:col-span-3">
                                        <StickyBox offsetTop={6} offsetBottom={6}>
                                            <div className="card p-4">
                                                <h5>{intl.formatMessage({ id: "page.users.search_filter" })}</h5>
                                                <form id="user_search_form">
                                                    <div className="custom-grid">
                                                        <div className="col-span-12">
                                                            <div className="form-group-border active">
                                                                <AiOutlineUser />
                                                                <input autoComplete="search-last-name" type="text" defaultValue={''} name="last_name" placeholder=" " onChange={debounceHandler(getUsers, 1000)} />
                                                                <label>{intl.formatMessage({ id: "page.registration.form.last_name" })}</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-span-12">
                                                            <div className="form-group-border active">
                                                                <AiOutlineUser />
                                                                <input autoComplete="search-first-name" type="text" defaultValue={''} name="first_name" placeholder=" " onChange={debounceHandler(getUsers, 1000)} />
                                                                <label>{intl.formatMessage({ id: "page.registration.form.first_name" })}</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-span-12">
                                                            <div className="form-group-border active">
                                                                <AiOutlineMail />
                                                                <input autoComplete="search-email" type="text" defaultValue={''} name="email" placeholder=" " onChange={debounceHandler(getUsers, 1000)} />
                                                                <label>{intl.formatMessage({ id: "page.registration.form.email" })}</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-span-12">
                                                            <div className="form-group-border active">
                                                                <AiOutlinePhone />
                                                                <InputMask mask="+7 (799) 999-9999" onInput={e => setSearchUserPhone(e.target.value)} onChange={debounceHandler(getUsers, 1000)} value={search_user_phone} name="phone" placeholder=" " />
                                                                <label>{intl.formatMessage({ id: "page.registration.form.phone" })}</label>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12">
                                                            <div className="form-group-border active">
                                                                <AiOutlineCalendar />
                                                                <input type="date" defaultValue={''} name="created_at_from" onChange={debounceHandler(getUsers, 1000)} placeholder=" " />
                                                                <label>{intl.formatMessage({ id: "created_at_from" })}</label>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12">
                                                            <div className="form-group-border active">
                                                                <AiOutlineCalendar />
                                                                <input type="date" defaultValue={''} name="created_at_to" onChange={debounceHandler(getUsers, 1000)} placeholder=" " />
                                                                <label>{intl.formatMessage({ id: "created_at_to" })}</label>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12">
                                                            <div className="btn-wrap">
                                                                <button type="button" className="btn btn-sm btn-outline-primary" onClick={debounceHandler(resetUserSearchFilter, 500)}> <AiOutlineUndo /> <span>{intl.formatMessage({ id: "reset_search_filter" })}</span></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </StickyBox>
                                    </div>
                                }

                                <div className={"relative col-span-12 " + (search_user_filter === true ? 'lg:col-span-9' : '')}>
                                    {users.data?.length > 0 ?
                                        <>
                                            <div className="relative">
                                                {users_loader && <Loader className="overlay" />}
                                                <div className="table table-sm">
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th></th>
                                                                <th>{intl.formatMessage({ id: "page.registration.form.last_name" })}</th>
                                                                <th>{intl.formatMessage({ id: "page.registration.form.first_name" })}</th>
                                                                <th>{intl.formatMessage({ id: "page.registration.form.email" })}</th>
                                                                <th>{intl.formatMessage({ id: "page.registration.form.phone" })}</th>
                                                                <th>{intl.formatMessage({ id: "created_at" })}</th>
                                                                <th>{intl.formatMessage({ id: "status" })}</th>
                                                                <th></th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {users.data?.map(user => (
                                                                <tr key={user.user_id}>
                                                                    <th>
                                                                        <UserAvatar user_avatar={user.avatar} className={'w-10 h-10 p-0.5 my-2 ml-3'} />
                                                                    </th>
                                                                    <td>{user.last_name}</td>
                                                                    <td>{user.first_name}</td>
                                                                    <td>{user.email}</td>
                                                                    <td>{user.phone}</td>
                                                                    <td>{new Date(user.created_at).toLocaleString()}</td>
                                                                    <td>{user.status_type_name}</td>
                                                                    <td>
                                                                        <div className="btn-wrap">
                                                                            <button onClick={() => getEditUser(user.user_id)} title={intl.formatMessage({ id: "edit" })} className="btn btn-edit"><AiOutlineEdit /></button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <Pagination items={users} setItems={getUsers} />
                                        </>
                                        :
                                        <>
                                            {users_loader && <Loader className="overlay" />}
                                            <Alert className="alert light" text={intl.formatMessage({ id: "nothing_was_found_for_your_query" })} />
                                        </>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className={'tab-body-item ' + (main_tab === 'groups' && 'active')}>
                            <div className="custom-grid">
                                <div className="col-span-12">
                                    <div className="btn-wrap">
                                        <button onClick={() => setCreateGroupModal(true)} className="btn btn-outline-primary"><AiOutlineUsergroupAdd /> <span>{intl.formatMessage({ id: "page.groups.create_group" })}</span></button>
                                        <button onClick={() => showHideGroupSearchFilter()} className="btn btn-light"><AiOutlineSearch /> <span>{search_group_filter === true ? intl.formatMessage({ id: "hide_search_filter" }) : intl.formatMessage({ id: "show_search_filter" })}</span></button>
                                    </div>
                                </div>

                                {search_group_filter === true
                                    &&
                                    <div className="col-span-12 lg:col-span-3">
                                        <StickyBox offsetTop={6} offsetBottom={6}>
                                            <div className="card p-4">
                                                <h5>{intl.formatMessage({ id: "page.group.search_filter" })}</h5>
                                                <form id="group_search_form">
                                                    <div className="custom-grid">
                                                        <div className="col-span-12">
                                                            <div className="form-group-border active">
                                                                <AiOutlineTeam />
                                                                <input autoComplete="search-group-name" type="text" defaultValue={''} name="group_name" placeholder=" " onChange={debounceHandler(getGroups, 1000)} />
                                                                <label>{intl.formatMessage({ id: "page.group.form.group_name" })}</label>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12">
                                                            <div className="form-group-border active">
                                                                <AiOutlineCalendar />
                                                                <input type="date" defaultValue={''} name="created_at_from" onChange={debounceHandler(getGroups, 1000)} placeholder=" " />
                                                                <label>{intl.formatMessage({ id: "created_at_from" })}</label>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12">
                                                            <div className="form-group-border active">
                                                                <AiOutlineCalendar />
                                                                <input type="date" defaultValue={''} name="created_at_to" onChange={debounceHandler(getGroups, 1000)} placeholder=" " />
                                                                <label>{intl.formatMessage({ id: "created_at_to" })}</label>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12">
                                                            <div className="btn-wrap">
                                                                <button type="button" className="btn btn-sm btn-outline-primary" onClick={debounceHandler(resetGroupSearchFilter, 500)}> <AiOutlineUndo /> <span>{intl.formatMessage({ id: "reset_search_filter" })}</span></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </StickyBox>
                                    </div>
                                }

                                <div className={"relative col-span-12 " + (search_group_filter === true ? 'lg:col-span-9' : '')}>
                                    {groups.data?.length > 0 ?
                                        <>
                                            <div className="relative">
                                                {groups_loader && <Loader className="overlay" />}
                                                <div className="table table-sm">
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>{intl.formatMessage({ id: "page.group.form.group_name" })}</th>
                                                                <th>{intl.formatMessage({ id: "page.group.form.group_description" })}</th>
                                                                <th>{intl.formatMessage({ id: "page.group.form.group_mentor" })}</th>
                                                                <th>{intl.formatMessage({ id: "page.group.form.added_users" })}</th>
                                                                <th>{intl.formatMessage({ id: "created_at" })}</th>
                                                                <th></th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {groups.data?.map(group => (
                                                                <tr key={group.group_id}>
                                                                    <td>{group.group_name}</td>
                                                                    <td>{group.group_description}</td>
                                                                    <td>{group.mentor_last_name} {group.mentor_first_name}</td>
                                                                    <td>{group.members_count}</td>
                                                                    <td>{new Date(group.created_at).toLocaleString()}</td>
                                                                    <td>
                                                                        <div className="btn-wrap">
                                                                            <button onClick={() => getEditGroup(group.group_id)} title={intl.formatMessage({ id: "edit" })} className="btn btn-edit"><AiOutlineEdit /></button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <Pagination items={groups} setItems={getGroups} />
                                        </>
                                        :
                                        <>
                                            {users_loader && <Loader className="overlay" />}
                                            <Alert className="alert light" text={intl.formatMessage({ id: "nothing_was_found_for_your_query" })} />
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal show={invite_user_modal} onClose={() => setInviteUserModal(false)} modal_title={intl.formatMessage({ id: "page.users.invite_user_title" })} modal_size="modal-xl">
                    <InviteUserModal
                        getUsers={getUsers}
                        invite_user_phone={invite_user_phone}
                        setInviteUserPhone={setInviteUserPhone}
                        loader={loader}
                        setLoader={setLoader}
                        error={error}
                        setError={setError}
                        intl={intl}
                        router={router}
                        closeModal={() => setInviteUserModal(false)} />
                </Modal>

                <Modal show={edit_user_modal} onClose={() => setEditUserModal(false)} modal_title={intl.formatMessage({ id: "page.users.edit_user_title" })} modal_size="modal-xl">
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
                        error={error}
                        setError={setError}
                        intl={intl}
                        router={router}
                        closeModal={() => setCreateGroupModal(false)} />
                </Modal>
            </RoleProvider>
        </DashboardLayout>
    );
}