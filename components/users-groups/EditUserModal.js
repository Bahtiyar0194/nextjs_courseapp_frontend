import axios from "axios";
import { useState } from "react";
import InputMask from "react-input-mask";
import Loader from "../ui/Loader";
import { AiOutlineUser, AiOutlinePhone, AiOutlineMail, AiOutlineEdit, AiOutlineCamera, AiOutlineDelete } from "react-icons/ai";
import serialize from 'form-serialize';
import RoleProvider from "../../services/RoleProvider";
import UserAvatar from "../ui/UserAvatar";
import { CDropdown, CDropdownToggle, CDropdownMenu } from "@coreui/react";
import Link from "next/link";

import Modal from "../ui/Modal";
import UploadAvatarModal from "../profile/UploadAvatarModal";
import DeleteAvatarModal from "../profile/DeleteAvatarModal";

import { useDispatch, useSelector } from "react-redux";
import { authenticate } from "../../store/slices/userSlice";

const EditUserModal = ({ edit_user, getUsers, getUser, setEditUserPhone, edit_user_phone, loader, setLoader, error, setError, intl, router, closeModal }) => {
    const dispatch = useDispatch();
    const [avatar_modal, setAvatarModal] = useState(false);
    const [delete_avatar_modal, setDeleteAvatarModal] = useState(false);
    const [image_file, setImageFile] = useState(null);

    const current_user = useSelector((state) => state.authUser.user);

    const cancelUpload = () => {
        setImageFile(null);
        setAvatarModal(false);
    }

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
        form_body.operation_type_id = 15;

        await axios.post('users/update/' + edit_user.user_id, form_body)
            .then(response => {
                setError([]);
                getUser(edit_user.user_id);

                if(current_user.user_id === edit_user.user_id){
                    dispatch(authenticate(response.data));
                }
                getUsers();
                closeModal();
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
                <div className="relative w-32 mb-4">
                    <UserAvatar user_avatar={edit_user.avatar} className={'w-32 h-32'} padding={2} />
                    {edit_user.avatar
                        ?
                        <CDropdown className="absolute bottom-0 right-0">
                            <CDropdownToggle color="light" href="#">
                                <AiOutlineEdit />
                            </CDropdownToggle>
                            <CDropdownMenu>
                                <Link href={'#'} onClick={e => setAvatarModal(true)}><AiOutlineCamera /> <span className="whitespace-nowrap">{intl.formatMessage({ id: "page.users.change_photo" })}</span></Link>
                                <Link href={'#'} onClick={e => setDeleteAvatarModal(true)}><AiOutlineDelete /> <span className="whitespace-nowrap">{intl.formatMessage({ id: "page.users.delete_photo" })}</span></Link>
                            </CDropdownMenu>
                        </CDropdown>
                        :
                        <button title={intl.formatMessage({ id: "page.users.upload_photo" })} type="button" onClick={e => setAvatarModal(true)} className="btn btn-light absolute bottom-0 right-0"><AiOutlineCamera /></button>
                    }
                </div>
                <form key={edit_user.user_id} onSubmit={editUserSubmit} encType="multipart/form-data">
                    <div className="custom-grid">
                        <div className="col-span-12">
                            <div className="form-group-border active">
                                <AiOutlineUser />
                                <input type="text" defaultValue={edit_user.first_name} name="first_name" placeholder=" " />
                                <label className={(error.first_name && 'label-error')}>{error.first_name ? error.first_name : intl.formatMessage({ id: "page.registration.form.first_name" })}</label>
                            </div>
                        </div>
                        <div className="col-span-12">
                            <div className="form-group-border active">
                                <AiOutlineUser />
                                <input type="text" defaultValue={edit_user.last_name} name="last_name" placeholder=" " />
                                <label className={(error.last_name && 'label-error')}>{error.last_name ? error.last_name : intl.formatMessage({ id: "page.registration.form.last_name" })}</label>
                            </div>
                        </div>
                        <div className="col-span-12">
                            <div className="form-group-border active">
                                <AiOutlineMail />
                                <input autoComplete="new-email" type="text" defaultValue={edit_user.email} name="email" placeholder=" " />
                                <label className={(error.email && 'label-error')}>{error.email ? error.email : intl.formatMessage({ id: "page.registration.form.email" })}</label>
                            </div>
                        </div>
                        <div className="col-span-12">
                            <div className="form-group-border active">
                                <AiOutlinePhone />
                                <InputMask mask="+7 (799) 999-9999" onInput={e => setEditUserPhone(e.target.value)} value={edit_user_phone} name="phone" />
                                <label className={(error.phone && 'label-error')}>{error.phone ? error.phone : intl.formatMessage({ id: "page.registration.form.phone" })}</label>
                            </div>
                        </div>
                    </div>

                    <RoleProvider roles={[2]}>
                        <div className="mt-2">
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

            <Modal show={avatar_modal} onClose={cancelUpload} modal_title={intl.formatMessage({ id: "page.users.upload_profile_photo" })} modal_size="modal-xl">
                <UploadAvatarModal closeModal={cancelUpload} image_file={image_file} setImageFile={setImageFile} userId={edit_user.user_id} getMe={getUser} getUsers={getUsers} />
            </Modal>

            <Modal show={delete_avatar_modal} onClose={() => setDeleteAvatarModal(false)} modal_title={intl.formatMessage({ id: "page.users.delete_profile_photo" })} modal_size="modal-xl">
                <DeleteAvatarModal closeModal={() => setDeleteAvatarModal(false)} userId={edit_user.user_id} getMe={getUser} getUsers={getUsers} />
            </Modal>
        </>
    );
};

export default EditUserModal;