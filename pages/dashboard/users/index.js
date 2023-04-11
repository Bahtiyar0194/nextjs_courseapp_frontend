import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Modal from "../../../components/ui/Modal";
import { AiOutlineEdit, AiOutlineSearch, AiOutlineUserAdd } from "react-icons/ai";
import axios from "axios";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import RoleProvider from "../../../services/RoleProvider";
import InviteUserModal from "../../../components/users/InviteUserModal";
import EditUserModal from "../../../components/users/EditUserModal";
import Loader from "../../../components/ui/Loader";
import Pagination from "../../../components/ui/Pagination";

export default function Users() {
    const intl = useIntl();
    const [invite_user_modal, setInviteUserModal] = useState(false);
    const [edit_user_modal, setEditUserModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [loader, setLoader] = useState(false);
    const [edit_user, setEditUser] = useState([]);
    const [invite_user_phone, setInviteUserPhone] = useState('');
    const [edit_user_phone, setEditUserPhone] = useState('');
    const router = useRouter();
    const [error, setError] = useState([]);

    let i = 0;

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
        setLoader(true);
        if (!url) {
            url = 'users/get';
        }

        await axios.get(url)
            .then(response => {
                setUsers(response.data)
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

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <DashboardLayout showLoader={false} title={intl.formatMessage({ id: "page.users.title" })}>
            <RoleProvider roles={[2]} redirect={true}>
                <Breadcrumb>
                    {intl.formatMessage({ id: "page.users.title" })}
                </Breadcrumb>
                <div className="col-span-12">
                    <div className="title-wrap">
                        <h2>{intl.formatMessage({ id: "page.users.title" })}</h2>
                        <div className="btn-wrap">
                            <button onClick={() => setInviteUserModal(true)} className="btn btn-primary"><AiOutlineUserAdd /> <span>{intl.formatMessage({ id: "invite" })}</span></button>
                            <button className="btn btn-outline-primary"><AiOutlineSearch /> <span>{intl.formatMessage({ id: "search" })}</span></button>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 relative">
                    {loader && <Loader className="overlay" />}
                    <div className="table table-sm">
                        <table>
                            <thead>
                                <tr>
                                    <th>№</th>
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
                                        <td>{users.from++}</td>
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