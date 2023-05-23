import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import axios from "axios";
import Breadcrumb from "../../components/ui/Breadcrumb";
import { AiOutlineUser, AiOutlinePhone, AiOutlineMail, AiOutlineCheck, AiOutlineCamera, AiOutlineEdit, AiOutlineDelete, AiOutlineKey, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import serialize from 'form-serialize';
import InputMask from "react-input-mask";
import { useSelector } from "react-redux";
import ButtonLoader from "../../components/ui/ButtonLoader";
import { CDropdown, CDropdownToggle, CDropdownMenu } from "@coreui/react";
import Link from "next/link";
import Modal from "../../components/ui/Modal";
import UploadAvatarModal from "../../components/profile/UploadAvatarModal";
import DeleteAvatarModal from "../../components/profile/DeleteAvatarModal";
import UserAvatar from "../../components/ui/UserAvatar";
import { useDispatch } from "react-redux";
import { authenticate } from "../../store/slices/userSlice";
import { FiUserCheck } from "react-icons/fi";
import Cookies from "js-cookie";

export default function Profile() {
    const dispatch = useDispatch();
    const [button_loader, setButtonLoader] = useState(false);
    const [error, setError] = useState([]);
    const intl = useIntl();
    const router = useRouter();
    const current_user = useSelector((state) => state.authUser.user);
    const [edit_user, setEditUser] = useState([]);
    const [edit_user_phone, setEditUserPhone] = useState('');
    const [avatar_modal, setAvatarModal] = useState(false);
    const [delete_avatar_modal, setDeleteAvatarModal] = useState(false);
    const [image_file, setImageFile] = useState(null);

    const [password_button_loader, setPasswordButtonLoader] = useState(false);
    const [password_error, setPasswordError] = useState([]);
    const [showPassword, setShowPassword] = useState(false);

    const editUserSubmit = async (e) => {
        e.preventDefault();
        setButtonLoader(true);
        const form_body = serialize(e.currentTarget, { hash: true, empty: true });

        await axios.post('auth/update', form_body)
            .then(response => {
                router.push('/dashboard');
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 422) {
                        setError(err.response.data);
                        setButtonLoader(false);
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

    const getMe = async () => {
        await axios.get('auth/me')
            .then(response => {
                dispatch(authenticate(response.data.user));
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
    };

    const cancelUpload = () => {
        setImageFile(null);
        setAvatarModal(false);
    }

    const changePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordButtonLoader(true);
        const form_body = serialize(e.currentTarget, { hash: true, empty: true });

        await axios.post('auth/change_password', form_body)
            .then(response => {
                Cookies.set('token', response.data.data.token);
                router.push('/dashboard');
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 422) {
                        setPasswordError(err.response.data.data);
                        setPasswordButtonLoader(false);
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

    useEffect(() => {
        if (router.isReady) {
            if (current_user.user_id) {
                setEditUser(current_user);
                setEditUserPhone(current_user.phone);
            }
        }
    }, [router.isReady, current_user]);

    return (
        <DashboardLayout showLoader={false} title={intl.formatMessage({ id: "page.users.profile_settings" })}>
            <Breadcrumb>
                {intl.formatMessage({ id: "page.users.profile_settings" })}
            </Breadcrumb>
            <div className="col-span-12 lg:col-span-12">
                <div className="title-wrap">
                    <h2>{intl.formatMessage({ id: "page.users.profile_settings" })}</h2>
                </div>
            </div>
            <div className="col-span-12">
                <div className="relative w-32">
                    <UserAvatar user_avatar={current_user.avatar} className={'w-32 h-32 p-2'} />
                    {current_user.avatar
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
            </div>
            <div className="col-span-12 lg:col-span-6">
                <form onSubmit={e => editUserSubmit(e)} encType="multipart/form-data">
                    {/* 
                    {current_user.roles?.length > 1 &&
                        <div className="flex flex-wrap gap-2 mt-6">
                            {current_user.roles?.map(role =>
                                <div key={role.role_type_id} className="badge">
                                    <AiOutlineUser className="mr-0.5 -mt-1"/>
                                    {role.user_role_type_name}
                                </div>
                            )}
                        </div>
                    } */}

                    <div className="form-group-border active label-inactive mt-6">
                        <AiOutlineUser />
                        <input autoComplete="edit_last_name" type="text" defaultValue={edit_user.last_name} name="last_name" placeholder=" " />
                        <label className={(error.last_name && 'label-error')}>{error.last_name ? error.last_name : intl.formatMessage({ id: "page.registration.form.last_name" })}</label>
                    </div>

                    <div className="form-group-border active label-inactive mt-6">
                        <AiOutlineUser />
                        <input autoComplete="edit_first_name" type="text" defaultValue={edit_user.first_name} name="first_name" placeholder=" " />
                        <label className={(error.first_name && 'label-error')}>{error.first_name ? error.first_name : intl.formatMessage({ id: "page.registration.form.first_name" })}</label>
                    </div>

                    <div className="form-group-border active label-inactive mt-6">
                        <AiOutlineMail />
                        <input autoComplete="edit-email" type="text" defaultValue={edit_user.email} name="email" placeholder=" " />
                        <label className={(error.email && 'label-error')}>{error.email ? error.email : intl.formatMessage({ id: "page.registration.form.email" })}</label>
                    </div>

                    <div className="form-group-border active label-inactive mt-6">
                        <AiOutlinePhone />
                        <InputMask autoComplete="edit_phone" mask="+7 (799) 999-9999" onInput={e => setEditUserPhone(e.target.value)} value={edit_user_phone} name="phone" />
                        <label className={(error.phone && 'label-error')}>{error.phone ? error.phone : intl.formatMessage({ id: "page.registration.form.phone" })}</label>
                    </div>

                    <div className="form-group-border active label-inactive mt-6">
                        <AiOutlineUser />
                        <textarea autoComplete="edit_about_me" type="text" defaultValue={edit_user.about_me} name="about_me" placeholder=" "></textarea>
                        <label className={(error.about_me && 'label-error')}>{error.about_me ? error.about_me : intl.formatMessage({ id: "page.users.about_me" })}</label>
                    </div>

                    <div className="btn-wrap mt-4">
                        <button disabled={button_loader} className="btn btn-outline-primary" type="submit">
                            {button_loader === true ? <ButtonLoader /> : <AiOutlineCheck />}
                            <span>{intl.formatMessage({ id: "save_changes" })}</span>
                        </button>
                    </div>
                </form>
            </div>

            <div className="col-span-12 lg:col-span-6">
                <form onSubmit={e => changePasswordSubmit(e)}>

                    <div className="form-group-border active label-inactive mt-6">
                        <AiOutlineKey />
                        <input autoComplete="new-current-password" name="current_password" type={showPassword ? 'text' : 'password'} placeholder=" " />
                        <label className={(password_error.current_password && 'label-error')}>{password_error.current_password ? password_error.current_password : intl.formatMessage({ id: "page.registration.form.current_password" })}</label>
                        <div onClick={() => setShowPassword(!showPassword)}>{showPassword ? <AiOutlineEye className="show-password" /> : <AiOutlineEyeInvisible className="show-password" />}</div>
                    </div>

                    <div className="form-group-border active label-inactive mt-6">
                        <AiOutlineKey />
                        <input autoComplete="new-password" name="password" type={showPassword ? 'text' : 'password'} placeholder=" " />
                        <label className={(password_error.password && 'label-error')}>{password_error.password ? password_error.password : intl.formatMessage({ id: "page.registration.form.new_password" })}</label>
                    </div>

                    <div className="form-group-border active label-inactive mt-6">
                        <AiOutlineKey />
                        <input autoComplete="new-confirm-password" name="password_confirmation" type={showPassword ? 'text' : 'password'} placeholder=" " />
                        <label className={(password_error.password_confirmation && 'label-error')}>{password_error.password_confirmation ? password_error.password_confirmation : intl.formatMessage({ id: "page.registration.form.confirm_new_password" })}</label>
                    </div>

                    <button disabled={password_button_loader} className="btn btn-outline-primary mt-6" type="submit">
                        {password_button_loader === true ? <ButtonLoader /> : <FiUserCheck />}
                        <span>{intl.formatMessage({ id: "page.password.change_password" })}</span>
                    </button>
                </form>
            </div>

            <Modal show={avatar_modal} onClose={cancelUpload} modal_title={intl.formatMessage({ id: "page.users.upload_profile_photo" })} modal_size="modal-xl">
                <UploadAvatarModal closeModal={cancelUpload} image_file={image_file} setImageFile={setImageFile} getMe={getMe} />
            </Modal>

            <Modal show={delete_avatar_modal} onClose={() => setDeleteAvatarModal(false)} modal_title={intl.formatMessage({ id: "page.users.delete_profile_photo" })} modal_size="modal-xl">
                <DeleteAvatarModal closeModal={() => setDeleteAvatarModal(false)} getMe={getMe} />
            </Modal>

        </DashboardLayout>
    );
}