import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useRouter } from "next/router";
import InputMask from "react-input-mask";
import Modal from "../../../components/ui/Modal";
import Loader from "../../../components/ui/Loader";
import { AiOutlineUser, AiOutlinePhone, AiOutlineMail, AiOutlineEdit } from "react-icons/ai";
import axios from "axios";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import serialize from 'form-serialize';
import RoleProvider from "../../../services/RoleProvider";

export default function Users() {
    const [showFullLoader, setShowFullLoader] = useState(true);
    const [loader, setLoader] = useState(false);
    const intl = useIntl();
    const [userModal, setUserModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [edit_user, setEditUser] = useState([]);
    const [edit_user_phone, setEditUserPhone] = useState('');
    const [error, setError] = useState([]);
    const router = useRouter();

    let i = 0;

    const editUserSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        const form_body = serialize(e.currentTarget, { hash: true, empty: true });
        let roles = [];
        let role_inputs = document.querySelectorAll('.role_input');
        for (let role of role_inputs) {
            if (role.checked == true) {
                roles.push(parseInt(role.value));
            }
        }

        form_body.roles_count = roles.length;
        form_body.roles = roles;

        await axios.post('users/update/' + edit_user.user_id, form_body)
            .then(response => {
                setError([]);
                getUsers();
                setUserModal(false);
                setLoader(false);
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 422) {
                        setError(err.response.data);
                        setLoader(false);
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

    const getEditUser = async (user_id) => {
        setLoader(true);
        setUserModal(true);
        await axios.get('users/get/' + user_id)
            .then(response => {
                setError([]);
                setEditUser(response.data);
                setEditUserPhone(response.data.phone);
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
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {users?.map(user => (
                                    <tr key={user.user_id}>
                                        <td>{i += 1}</td>
                                        <td>{user.last_name}</td>
                                        <td>{user.first_name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>{new Date(user.created_at).toLocaleString()}</td>
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

                <Modal show={userModal} onClose={() => setUserModal(false)} modal_title={intl.formatMessage({ id: "page.users.edit_user_title" })} modal_size="modal-xl">
                    {loader && <Loader className="overlay" />}
                    <div className="modal-body">
                        <form key={edit_user.user_id} onSubmit={editUserSubmit} encType="multipart/form-data">
                            <div className="form-group mt-6">
                                <AiOutlineUser />
                                <input type="text" defaultValue={edit_user.first_name} name="first_name" placeholder=" " />
                                <label className={(error.first_name && 'label-error')}>{error.first_name ? error.first_name : intl.formatMessage({ id: "page.registration.form.first_name" })}</label>
                            </div>
                            <div className="form-group mt-4">
                                <AiOutlineUser />
                                <input type="text" defaultValue={edit_user.last_name} name="last_name" placeholder=" " />
                                <label className={(error.last_name && 'label-error')}>{error.last_name ? error.last_name : intl.formatMessage({ id: "page.registration.form.last_name" })}</label>
                            </div>

                            <div className="form-group mt-4">
                                <AiOutlineMail />
                                <input autoComplete="new-email" type="text" defaultValue={edit_user.email} name="email" placeholder=" " />
                                <label className={(error.email && 'label-error')}>{error.email ? error.email : intl.formatMessage({ id: "page.registration.form.email" })}</label>
                            </div>

                            <div className="form-group mt-4">
                                <AiOutlinePhone />
                                <InputMask mask="+7 (799) 999-9999" onInput={e => setEditUserPhone(e.target.value)} value={edit_user_phone} name="phone" />
                                <label className={(error.phone && 'label-error')}>{error.phone ? error.phone : intl.formatMessage({ id: "page.registration.form.phone" })}</label>
                            </div>

                            <RoleProvider roles={[2]}>
                                <div className="-mt-2">
                                    <label className={"label-focus " + (error.roles_count && "danger")}>{error.roles_count ? error.roles_count : intl.formatMessage({ id: "page.users.user_roles" })}</label>

                                    <div className="btn-wrap-lg mt-2">
                                        {edit_user.roles?.map(role => (
                                            <label key={role.role_type_id} className="custom-radio-checkbox">
                                                <input className="role_input" type="checkbox" defaultValue={role.role_type_id} defaultChecked={role.selected} />
                                                <span>{role.user_role_type_name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </RoleProvider>

                            <button className="btn btn-primary mt-4" type="submit"><AiOutlineEdit /> <span>{intl.formatMessage({ id: "done" })}</span></button>
                        </form>
                    </div>
                </Modal>
            </RoleProvider>
        </DashboardLayout>
    );
}