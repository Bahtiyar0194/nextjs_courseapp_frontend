import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Modal from "../../../components/ui/Modal";
import { AiOutlineCalendar, AiOutlineCrown, AiOutlineHourglass, AiOutlineMail, AiOutlinePhone, AiOutlineSearch, AiOutlineTeam, AiOutlineUndo, AiOutlineUser, AiOutlineUserAdd, AiOutlineUsergroupAdd } from "react-icons/ai";
import axios from "axios";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import RoleProvider from "../../../services/RoleProvider";
import UserModal from "../../../components/users-groups/UserModal";
import InviteUserModal from "../../../components/users-groups/InviteUserModal";
import EditUserModal from "../../../components/users-groups/EditUserModal";
import CreateGroupModal from "../../../components/users-groups/CreateGroupModal";
import UpdateGroupModal from "../../../components/users-groups/UpdateGroupModal";
import Loader from "../../../components/ui/Loader";
import Pagination from "../../../components/ui/Pagination";
import InputMask from "react-input-mask";
import serialize from 'form-serialize';
import Alert from "../../../components/ui/Alert";
import debounceHandler from "../../../utils/debounceHandler";
import StickyBox from "react-sticky-box";
import UserAvatar from "../../../components/ui/UserAvatar";
import { authenticate } from "../../../store/slices/userSlice";
import { useSelector, useDispatch } from "react-redux";
import TableToXLSXButton from "../../../components/ui/TableToXLSXButton";

export default function Users() {
    const [main_tab, setMainTab] = useState('users');
    const dispatch = useDispatch();
    const current_user = useSelector((state) => state.authUser.user);
    const intl = useIntl();
    const [invite_user_modal, setInviteUserModal] = useState(false);
    const [user_modal, setUserModal] = useState(false);
    const [edit_user_modal, setEditUserModal] = useState(false);
    const [user, setUser] = useState([]);
    const [users, setUsers] = useState([]);
    const [user_attributes, setUserAttributes] = useState([]);
    const [loader, setLoader] = useState(false);
    const [users_loader, setUsersLoader] = useState(false);
    const [showFullLoader, setShowFullLoader] = useState(true);
    const [user_phone, setUserPhone] = useState('');
    const [search_user_phone, setSearchUserPhone] = useState('');
    const router = useRouter();
    const [error, setError] = useState([]);
    const [search_user_filter, setSearchUserFilter] = useState(false);

    const [edit_group, setEditGroup] = useState([]);
    const [edit_group_name, setEditGroupName] = useState('');
    const [edit_group_description, setEditGroupDescription] = useState('');
    const [edit_group_members, setEditGroupMembers] = useState([]);
    const [create_group_modal, setCreateGroupModal] = useState(false);
    const [edit_group_modal, setEditGroupModal] = useState(false);
    const [group_attributes, setGroupAttributes] = useState([]);
    const [groups_loader, setGroupsLoader] = useState(false);
    const [groups, setGroups] = useState([]);
    const [search_group_filter, setSearchGroupFilter] = useState(false);

    const getUser = async (user_id) => {
        setLoader(true);
        setUserModal(true);
        await axios.get('users/get/' + user_id)
            .then(response => {
                setError([]);
                setUser(response.data);
                setUserPhone(response.data.phone);
                if (current_user.user_id === user_id) {
                    dispatch(authenticate(response.data));
                }
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

    const getEditUser = async () => {
        setUserModal(false);
        setEditUserModal(true);
    }

    const getUsers = async (url) => {
        setUsersLoader(true);
        const search_form = document.querySelector('#user_search_form');
        const form_body = serialize(search_form, { hash: true, empty: true });

        form_body.per_page = document.querySelector('#users-per-page-select')?.value;

        if (!url) {
            url = 'users/get';
        }

        await axios.post(url, form_body)
            .then(response => {
                setUsers(response.data);
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

    const getUserAttributes = async () => {
        setShowFullLoader(true);
        await axios.get('users/get_user_attributes')
            .then(response => {
                setUserAttributes(response.data);
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

        form_body.per_page = document.querySelector('#groups-per-page-select')?.value;

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

    const getEditGroup = async (group_id) => {
        setLoader(true);
        setEditGroupModal(true);
        await axios.get('groups/get/' + group_id)
            .then(response => {
                setError([]);
                setEditGroup(response.data);
                setEditGroupName(response.data.group_name);
                setEditGroupDescription(response.data.group_description);
                setEditGroupMembers(response.data.group_members);
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
        search_form.reset();
        setSearchUserPhone('');
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
        search_form.reset();
        getGroups();
    }

    useEffect(() => {
        setShowFullLoader(true);
        getUsers();
        getUserAttributes();
        getGroupAttributes();
        getGroups();
    }, []);

    return (
        <DashboardLayout showLoader={showFullLoader} title={intl.formatMessage({ id: "page.users.title" })}>
            <RoleProvider roles={[2, 3]} redirect={true}>
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
                                                                <input autoComplete="search-user" type="text" defaultValue={''} name="user" placeholder=" " onChange={debounceHandler(getUsers, 1000)} />
                                                                <label>{intl.formatMessage({ id: "page.registration.form.last_name" })}, {intl.formatMessage({ id: "page.registration.form.first_name" })}</label>
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
                                                            <div className="form-group-border select active label-active">
                                                                <AiOutlineHourglass />
                                                                <select name="status_type_id" defaultValue={''} onChange={() => getUsers()}>
                                                                    <option selected value="">{intl.formatMessage({ id: "not_specified" })}</option>
                                                                    {
                                                                        user_attributes.user_statuses?.map(status => (
                                                                            <option key={status.status_type_id} value={status.status_type_id}>{status.status_type_name}</option>
                                                                        ))
                                                                    }
                                                                </select>
                                                                <label>{intl.formatMessage({ id: "page.users.user_status" })}</label>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12">
                                                            <div className="form-group-border select active label-active">
                                                                <AiOutlineCrown />
                                                                <select name="role_type_id" defaultValue={''} onChange={() => getUsers()}>
                                                                    <option selected value="">{intl.formatMessage({ id: "not_specified" })}</option>
                                                                    {
                                                                        user_attributes.user_roles?.map(role => (
                                                                            <option key={role.role_type_id} value={role.role_type_id}>{role.user_role_type_name}</option>
                                                                        ))
                                                                    }
                                                                </select>
                                                                <label>{intl.formatMessage({ id: "page.users.user_role" })}</label>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12">
                                                            <div className="form-group-border active">
                                                                <AiOutlineCalendar />
                                                                <input type="date" defaultValue={''} name="created_at_from" onChange={debounceHandler(getUsers, 1000)} placeholder=" " />
                                                                <label>{intl.formatMessage({ id: "registered_at_from" })}</label>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12">
                                                            <div className="form-group-border active">
                                                                <AiOutlineCalendar />
                                                                <input type="date" defaultValue={''} name="created_at_to" onChange={debounceHandler(getUsers, 1000)} placeholder=" " />
                                                                <label>{intl.formatMessage({ id: "registered_at_to" })}</label>
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

                                <div className={"col-span-12 " + (search_user_filter === true ? 'lg:col-span-9' : '')}>
                                    {users.data?.length > 0 ?
                                        <>
                                            <div className="table table-sm selectable">
                                                {users_loader && <Loader className="overlay" />}
                                                <table id={main_tab + "Table"}>
                                                    <thead>
                                                        <tr>
                                                            <th>{intl.formatMessage({ id: "page.registration.form.last_name" })}, {intl.formatMessage({ id: "page.registration.form.first_name" })}</th>
                                                            <th>{intl.formatMessage({ id: "page.registration.form.email" })}</th>
                                                            <th>{intl.formatMessage({ id: "page.registration.form.phone" })}</th>
                                                            <th>{intl.formatMessage({ id: "registered_at" })}</th>
                                                            <th>{intl.formatMessage({ id: "status" })}</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {users.data?.map(user => (
                                                            <tr key={user.user_id} onClick={() => getUser(user.user_id)}>
                                                                <td>
                                                                    <div className="flex gap-x-2 items-center">
                                                                        <UserAvatar user_avatar={user.avatar} className={'w-10 h-10'} padding={0.5} />
                                                                        {user.last_name} {user.first_name}
                                                                    </div>
                                                                </td>
                                                                <td>{user.email}</td>
                                                                <td>{user.phone}</td>
                                                                <td>{new Date(user.created_at).toLocaleString()}</td>
                                                                <td>{user.status_type_name}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="btn-wrap mt-6">
                                                <Pagination items={users} setItems={getUsers} select_id={"users-per-page-select"} />
                                                <TableToXLSXButton btn_size_class={'btn-sm'} file_name={intl.formatMessage({ id: "page.users" }) + ' - ' + new Date().toLocaleString()} table_id={main_tab + "Table"} />
                                            </div>
                                        </>
                                        :
                                        <Alert className="alert light">
                                            {users_loader && <Loader className="overlay" />}
                                            <p className="mb-0">{intl.formatMessage({ id: "nothing_was_found_for_your_query" })}</p>
                                        </Alert>
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
                                                                <label>{intl.formatMessage({ id: "registered_at_from" })}</label>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-12">
                                                            <div className="form-group-border active">
                                                                <AiOutlineCalendar />
                                                                <input type="date" defaultValue={''} name="created_at_to" onChange={debounceHandler(getGroups, 1000)} placeholder=" " />
                                                                <label>{intl.formatMessage({ id: "registered_at_to" })}</label>
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

                                <div className={"col-span-12 " + (search_group_filter === true ? 'lg:col-span-9' : '')}>
                                    {groups.data?.length > 0 ?
                                        <>
                                            <div className="table table-sm selectable">
                                                {groups_loader && <Loader className="overlay" />}
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>{intl.formatMessage({ id: "page.group.form.group_name" })}</th>
                                                            <th>{intl.formatMessage({ id: "page.group.form.group_description" })}</th>
                                                            <th>{intl.formatMessage({ id: "page.group.form.group_mentor" })}</th>
                                                            <th>{intl.formatMessage({ id: "page.group.form.added_users" })}</th>
                                                            <th>{intl.formatMessage({ id: "registered_at" })}</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {groups.data?.map(group => (
                                                            <tr key={group.group_id} onClick={() => getEditGroup(group.group_id)}>
                                                                <td>{group.group_name}</td>
                                                                <td>{group.group_description}</td>
                                                                <td>{group.mentor_last_name} {group.mentor_first_name}</td>
                                                                <td>{group.members_count}</td>
                                                                <td>{new Date(group.created_at).toLocaleString()}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="btn-wrap mt-6">
                                                <Pagination items={groups} setItems={getGroups} select_id={"groups-per-page-select"} />
                                            </div>
                                        </>
                                        :
                                        <Alert className="alert light">
                                            {groups_loader && <Loader className="overlay" />}
                                            <p className="mb-0">{intl.formatMessage({ id: "nothing_was_found_for_your_query" })}</p>
                                        </Alert>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal show={invite_user_modal} onClose={() => setInviteUserModal(false)} modal_title={intl.formatMessage({ id: "page.users.invite_user_title" })} modal_size="modal-xl">
                    <InviteUserModal
                        getUsers={getUsers}
                        loader={loader}
                        setLoader={setLoader}
                        error={error}
                        setError={setError}
                        intl={intl}
                        router={router}
                        closeModal={() => setInviteUserModal(false)} />
                </Modal>

                <Modal show={user_modal} onClose={() => setUserModal(false)} modal_title={intl.formatMessage({ id: "page.users.user_info" })} modal_size="modal-xl">
                    <UserModal
                        user={user}
                        loader={loader}
                        intl={intl}
                        getEditUser={getEditUser}
                    />
                </Modal>

                <Modal show={edit_user_modal} onClose={() => (setEditUserModal(false), setUserModal(true))} modal_title={intl.formatMessage({ id: "page.users.edit_user_title" })} modal_size="modal-xl">
                    <EditUserModal
                        edit_user={user}
                        getUsers={getUsers}
                        getUser={getUser}
                        edit_user_phone={user_phone}
                        setEditUserPhone={setUserPhone}
                        loader={loader}
                        setLoader={setLoader}
                        error={error}
                        setError={setError}
                        intl={intl}
                        router={router}
                        closeModal={() => (setEditUserModal(false), setUserModal(true))} />
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
                </Modal>
            </RoleProvider>
        </DashboardLayout>
    );
}