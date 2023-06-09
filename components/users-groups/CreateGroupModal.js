import { useState } from "react";
import axios from "axios";
import Loader from "../ui/Loader";
import { AiOutlineUsergroupAdd, AiOutlineTeam, AiOutlineDelete, AiOutlinePlusCircle, AiOutlineUser } from "react-icons/ai";
import serialize from 'form-serialize';
import UserAvatar from "../ui/UserAvatar";
import { scrollIntoView } from "seamless-scroll-polyfill";

const CreateGroupModal = ({ loader, setLoader, group_attributes, error, setError, intl, router, closeModal }) => {
    const [new_group_members, setNewGroupMembers] = useState([]);

    const createGroupSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        const form_body = serialize(e.currentTarget, { hash: true, empty: true });
        form_body.members_count = new_group_members.length;
        form_body.members = JSON.stringify(new_group_members);
        form_body.operation_type_id = 17;

        await axios.post('groups/create', form_body)
            .then(response => {
                setError([]);
                closeModal();
                e.target.querySelector('input[name="group_name"]').value = '';
                e.target.querySelector('textarea[name="group_description"]').value = '';
                e.target.querySelector('select[name="mentor_id"]').value = '';
                setNewGroupMembers([]);
                setLoader(false);
            }).catch(err => {
                console.log(err)
                if (err.response) {
                    if (err.response.status == 422) {
                        setError(err.response.data.data);
                        let card = document.querySelector('#create_group_modal_top');
                        setTimeout(() => {
                            scrollIntoView(card, { behavior: "smooth", block: "center", inline: "center" });
                        }, 200);
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

    const addToGroup = (user_id) => {
        let newArr = JSON.parse(JSON.stringify(new_group_members));
        newArr.push(user_id);
        setNewGroupMembers(newArr);
    }

    const deleteFromGroup = (user_id) => {
        let newArr = JSON.parse(JSON.stringify(new_group_members));
        newArr = newArr.filter(item => item !== user_id)
        setNewGroupMembers(newArr);
    }

    return (
        <>
            {loader && <Loader className="overlay" />}
            <div className="modal-body">
                <form onSubmit={createGroupSubmit} encType="multipart/form-data">
                    <div id="create_group_modal_top" className="form-group-border active mt-6">
                        <AiOutlineTeam />
                        <input autoComplete="new-group-name" type="text" defaultValue={''} name="group_name" placeholder=" " />
                        <label className={(error.group_name && 'label-error')}>{error.group_name ? error.group_name : intl.formatMessage({ id: "page.group.form.group_name" })}</label>
                    </div>

                    <div className="form-group-border active mt-6">
                        <AiOutlineTeam />
                        <textarea autoComplete="new-group_description" type="text" defaultValue={''} name="group_description" placeholder=" "></textarea>
                        <label>{intl.formatMessage({ id: "page.group.form.group_description" })}</label>
                    </div>

                    <div className="form-group-border active mt-6">
                        <AiOutlineUser />
                        <select name="mentor_id" defaultValue={''} >
                            <option selected disabled value="">{intl.formatMessage({ id: "page.group.form.choose_a_mentor" })}</option>
                            {
                                group_attributes.group_mentors?.map(mentor => (
                                    <option key={mentor.user_id} value={mentor.user_id}>{mentor.last_name} {mentor.first_name}</option>
                                ))
                            }
                        </select>
                        <label className={(error.mentor_id && 'label-error')}>{error.mentor_id ? error.mentor_id : intl.formatMessage({ id: "page.group.form.group_mentor" })}</label>
                    </div>

                    <div className="relative mt-6">
                        <div className={"list-wrap p-3"}>
                            {
                                group_attributes.group_members?.length > 0 &&
                                group_attributes.group_members?.map(item => (
                                    <div key={item.user_id}>
                                        <div className="flex gap-2 items-center">
                                            <UserAvatar user_avatar={item.avatar} className={'w-8 h-8 p-0.5'} />
                                            <span>{item.last_name} {item.first_name}</span>
                                        </div>
                                        <div className="btn-wrap">
                                            {new_group_members.includes(item.user_id)
                                                ?
                                                <button onClick={e => deleteFromGroup(item.user_id)} className="btn btn-sm btn-outline-danger border-none" type="button"><AiOutlineDelete /> <span>{intl.formatMessage({ id: "page.group.form.delete_from_group" })}</span></button>
                                                :
                                                <button onClick={e => addToGroup(item.user_id)} className="btn btn-sm btn-outline-primary border-none" type="button"><AiOutlinePlusCircle /> <span>{intl.formatMessage({ id: "page.group.form.add_to_group" })}</span></button>
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <label className={(error.members_count && 'label-error')}>{error.members_count ? error.members_count : intl.formatMessage({ id: "page.users.list_of_users" })}</label>
                    </div>
                    {
                        new_group_members.length > 0 && <p className="mt-4 text-corp">{intl.formatMessage({ id: "page.group.form.added_users" })}: <span className="text-active">{new_group_members.length}</span></p>
                    }
                    <button className="btn btn-primary mt-4" type="submit"><AiOutlineUsergroupAdd /> <span>{intl.formatMessage({ id: "done" })}</span></button>
                </form>
            </div>
        </>
    );
};

export default CreateGroupModal;