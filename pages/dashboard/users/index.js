import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Modal from "../../../components/ui/Modal";
import { AiOutlineEdit } from "react-icons/ai";
import axios from "axios";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import RoleProvider from "../../../services/RoleProvider";
import EditUserModal from "../../../components/users/EditUserModal";

export default function Users() {
    const [showFullLoader, setShowFullLoader] = useState(true);
    const intl = useIntl();
    const [edit_user_modal, setEditUserModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [loader, setLoader] = useState(false);
    const [edit_user, setEditUser] = useState([]);
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

    const getUsers = async () => {
        setShowFullLoader(true);
        await axios.get('users/get')
            .then(response => {
                setUsers(response.data)
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

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <DashboardLayout showLoader={showFullLoader} title={intl.formatMessage({ id: "page.users.title" })}>
            <RoleProvider roles={[2]} redirect={true}>
                <Breadcrumb>
                    {intl.formatMessage({ id: "page.users.title" })}
                </Breadcrumb>
                <div className="col-span-12">
                    <h2 className>{intl.formatMessage({ id: "page.users.title" })}</h2>
                </div>


                <div className="col-span-12">
                    <div className="table">
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
                                        <td>{i += 1}</td>
                                        <td>{user.last_name}</td>
                                        <td>{user.first_name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>{new Date(user.created_at).toLocaleString()}</td>
                                        <td>{user.user_status_name}</td>
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