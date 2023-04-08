import axios from "axios";
import InputMask from "react-input-mask";
import Loader from "../ui/Loader";
import { AiOutlineUser, AiOutlinePhone, AiOutlineMail, AiOutlineEdit } from "react-icons/ai";
import serialize from 'form-serialize';
import RoleProvider from "../../services/RoleProvider";

const EditUserModal = ({ edit_user, getUsers, setEditUserPhone, edit_user_phone, loader, setLoader, error, setError, intl, router, closeModal }) => {
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
                closeModal();
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

    return (
        <>
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
        </>
    );
};

export default EditUserModal;