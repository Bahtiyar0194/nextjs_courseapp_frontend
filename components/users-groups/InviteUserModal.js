import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import InputMask from "react-input-mask";
import Loader from "../ui/Loader";
import { AiOutlineUser, AiOutlinePhone, AiOutlineMail, AiOutlineEdit } from "react-icons/ai";
import serialize from 'form-serialize';
import RoleProvider from "../../services/RoleProvider";
import SubscriptionProlong from "../ui/SubscriptionProlong";

const InviteUserModal = ({ getUsers, loader, setLoader, error, setError, intl, router, closeModal }) => {
    const [roles, setRoles] = useState([]);
    const [invite_user_phone, setInviteUserPhone] = useState('');
    const school = useSelector((state) => state.school.school_data);

    const inviteUserSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        const form_body = serialize(e.currentTarget, { hash: true, empty: true });
        let roles = [];
        let role_inputs = document.querySelectorAll('.invite_role_input');
        for (let role of role_inputs) {
            if (role.checked == true) {
                roles.push(parseInt(role.value));
            }
        }

        form_body.roles_count = roles.length;
        form_body.roles = roles;
        form_body.operation_type_id = 14;

        await axios.post('users/invite', form_body)
            .then(response => {
                setError([]);
                getUsers();
                closeModal();

                for (let role of role_inputs) {
                    role.checked = false;
                }
                e.target.querySelector('input[name="first_name"]').value = '';
                e.target.querySelector('input[name="last_name"]').value = '';
                e.target.querySelector('input[name="email"]').value = '';
                setInviteUserPhone('');

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

    const getRoles = async (e) => {
        setLoader(true);
        await axios.get('users/get_roles')
            .then(response => {
                setRoles(response.data);
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

    useEffect(() => {
        getRoles();
    }, []);

    return (
        <>
            {loader && <Loader className="overlay" />}
            <div className="modal-body">
                {school.subscription_expired == true ?
                    <SubscriptionProlong />
                    :
                    <form onSubmit={inviteUserSubmit} encType="multipart/form-data">
                        <div className="custom-grid">
                            <div className="col-span-12">
                                <div className="form-group-border active">
                                    <AiOutlineUser />
                                    <input autoComplete="new-first-name" type="text" defaultValue={''} name="first_name" placeholder=" " />
                                    <label className={(error.first_name && 'label-error')}>{error.first_name ? error.first_name : intl.formatMessage({ id: "page.registration.form.first_name" })}</label>
                                </div>
                            </div>
                            <div className="col-span-12">
                                <div className="form-group-border active">
                                    <AiOutlineUser />
                                    <input autoComplete="new-last-name" type="text" defaultValue={''} name="last_name" placeholder=" " />
                                    <label className={(error.last_name && 'label-error')}>{error.last_name ? error.last_name : intl.formatMessage({ id: "page.registration.form.last_name" })}</label>
                                </div>
                            </div>
                            <div className="col-span-12">
                                <div className="form-group-border active">
                                    <AiOutlineMail />
                                    <input autoComplete="new-email" type="text" defaultValue={''} name="email" placeholder=" " />
                                    <label className={(error.email && 'label-error')}>{error.email ? error.email : intl.formatMessage({ id: "page.registration.form.email" })}</label>
                                </div>
                            </div>
                            <div className="col-span-12">
                                <div className="form-group-border active">
                                    <AiOutlinePhone />
                                    <InputMask autoComplete="new-phone" mask="+7 (799) 999-9999" onInput={e => setInviteUserPhone(e.target.value)} value={invite_user_phone} name="phone" placeholder=" " />
                                    <label className={(error.phone && 'label-error')}>{error.phone ? error.phone : intl.formatMessage({ id: "page.registration.form.phone" })}</label>
                                </div>
                            </div>
                        </div>

                        <RoleProvider roles={[2]}>
                            <div className="mt-2">
                                <label className={"label-focus " + (error.roles_count && "danger")}>{error.roles_count ? error.roles_count : intl.formatMessage({ id: "page.users.user_roles" })}</label>

                                <div className="btn-wrap-lg mt-2">
                                    {roles?.map(role => (
                                        <label key={role.role_type_id} className="custom-radio-checkbox">
                                            <input className="invite_role_input" type="checkbox" defaultValue={role.role_type_id} defaultChecked={false} />
                                            <span>{role.user_role_type_name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </RoleProvider>

                        <button className="btn btn-primary mt-4" type="submit"><AiOutlineEdit /> <span>{intl.formatMessage({ id: "done" })}</span></button>
                    </form>
                }
            </div>
        </>
    );
};

export default InviteUserModal;