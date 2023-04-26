import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Modal from "../../../components/ui/Modal";
import { AiOutlineCalendar, AiOutlineEdit, AiOutlineMail, AiOutlinePhone, AiOutlineSearch, AiOutlineUndo, AiOutlineUser, AiOutlineUserAdd } from "react-icons/ai";
import axios from "axios";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import RoleProvider from "../../../services/RoleProvider";
import InviteUserModal from "../../../components/users/InviteUserModal";
import EditUserModal from "../../../components/users/EditUserModal";
import Loader from "../../../components/ui/Loader";
import Pagination from "../../../components/ui/Pagination";
import InputMask from "react-input-mask";
import serialize from 'form-serialize';
import Alert from "../../../components/ui/Alert";
import debounceHandler from "../../../utils/debounceHandler";
import StickyBox from "react-sticky-box";

export default function Users() {
    const intl = useIntl();
    const [invite_user_modal, setInviteUserModal] = useState(false);
    const [edit_user_modal, setEditUserModal] = useState(false);
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

    useEffect(() => {
        setShowFullLoader(true);
        getUsers();
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
                            <button onClick={() => setInviteUserModal(true)} className="btn btn-outline-primary"><AiOutlineUserAdd /> <span>{intl.formatMessage({ id: "invite" })}</span></button>
                            <button onClick={() => showHideUserSearchFilter()} className="btn btn-light"><AiOutlineSearch /> <span>{search_user_filter === true ? intl.formatMessage({ id: "hide_search_filter" }) : intl.formatMessage({ id: "show_search_filter" })}</span></button>
                        </div>
                    </div>
                </div>

                {search_user_filter === true && <div className="col-span-12 lg:col-span-3">
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
                </div>}


                <div className={"col-span-12 " + (search_user_filter === true ? 'lg:col-span-9' : '')}>
                    {users.data?.length > 0 ?
                        <>
                            <div className="relative">
                                {users_loader && <Loader className="overlay" />}
                                <div className="table table-sm">
                                    <table>
                                        <thead>
                                            <tr>
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
                        <Alert className="alert light" text={intl.formatMessage({ id: "nothing_was_found_for_your_query" })} />
                    }
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
            </RoleProvider>
        </DashboardLayout>
    );
}