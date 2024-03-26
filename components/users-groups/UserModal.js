import { AiOutlineEdit, AiOutlineUser } from "react-icons/ai";
import Loader from "../ui/Loader";
import UserAvatar from "../ui/UserAvatar";

const UserModal = ({ user, loader, intl, getEditUser }) => {

    return (
        <>
            {loader && <Loader className="overlay" />}
            <div className="modal-body">
                <div className="flex flex-wrap gap-x-6 gap-y-4 whitespace-nowrap">
                    <UserAvatar user_avatar={user.avatar} className={'w-24 h-24'} padding={1} />
                    <div className="flex flex-col gap-y-4">
                        <h4 className="mb-0">{user.last_name} {user.first_name}</h4>
                        <span><span className="text-inactive">{intl.formatMessage({ id: "page.registration.form.email" })}</span> : {user.email}</span>
                        <span><span className="text-inactive">{intl.formatMessage({ id: "page.registration.form.phone" })}</span> : {user.phone}</span>

                        {user.roles?.length > 1 &&
                            <div>
                                <p className="text-inactive mb-2">{intl.formatMessage({ id: "page.users.user_roles" })}:</p>
                                <div className="flex flex-wrap gap-2">
                                    {user.available_roles?.map(role =>
                                        <div key={role.role_type_id} className="badge badge-light">
                                            <AiOutlineUser className="mr-0.5 -mt-1" />
                                            {role.user_role_type_name}{role.selected}
                                        </div>
                                    )}
                                </div>
                            </div>
                        }

                        <button onClick={getEditUser} className="btn btn-outline-primary"><AiOutlineEdit/> <span>{intl.formatMessage({ id: "edit" })}</span></button>
                    </div>
                </div>

            </div>
        </>
    );
};

export default UserModal;