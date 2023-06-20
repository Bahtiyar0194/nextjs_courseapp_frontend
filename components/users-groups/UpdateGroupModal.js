import { useState } from "react";
import axios from "axios";
import Loader from "../ui/Loader";
import { AiOutlineUsergroupAdd, AiOutlineTeam, AiOutlineDelete, AiOutlinePlusCircle, AiOutlineUser } from "react-icons/ai";
import serialize from 'form-serialize';
import UserAvatar from "../ui/UserAvatar";
import { scrollIntoView } from "seamless-scroll-polyfill";

const UpdateGroupModal = ({ loader, setLoader, group_attributes, edit_group, setEditGroup, edit_group_name, setEditGroupName, edit_group_description, setEditGroupDescription, edit_group_members, setEditGroupMembers, getGroups, error, setError, intl, router, closeModal }) => {
    const updateGroupSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        const form_body = serialize(e.currentTarget, { hash: true, empty: true });
        form_body.members_count = edit_group_members.length;
        form_body.members = JSON.stringify(edit_group_members);
        form_body.operation_type_id = 18;

        await axios.post('groups/update/' + edit_group.group_id, form_body)
            .then(response => {
                setError([]);
                closeModal();
                setEditGroup([]);
                setEditGroupMembers([]);
                getGroups();
                setLoader(false);
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 422) {
                        setError(err.response.data.data);
                        let card = document.querySelector('#edit_group_modal_top');
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
        let newArr = JSON.parse(JSON.stringify(edit_group_members));
        newArr.push(user_id);
        setEditGroupMembers(newArr);
    }

    const deleteFromGroup = (user_id) => {
        let newArr = JSON.parse(JSON.stringify(edit_group_members));
        newArr = newArr.filter(item => item !== user_id)
        setEditGroupMembers(newArr);
    }

    return (
        <>
            {loader && <Loader className="overlay" />}
            <div className="modal-body">
                <form onSubmit={updateGroupSubmit} encType="multipart/form-data">
                    <div className="custom-grid mt-6">
                        <div className="col-span-12">
                            <div id="edit_group_modal_top" className="form-group-border active">
                                <AiOutlineTeam />
                                <input type="text" value={edit_group_name} onChange={e => setEditGroupName(e.currentTarget.value)} name="group_name" placeholder=" " />
                                <label className={(error.group_name && 'label-error')}>{error.group_name ? error.group_name : intl.formatMessage({ id: "page.group.form.group_name" })}</label>
                            </div>
                        </div>
                        <div className="col-span-12">
                            <div className="form-group-border active">
                                <AiOutlineTeam />
                                <textarea type="text" value={edit_group_description} onChange={e => setEditGroupDescription(e.currentTarget.value)} name="group_description" placeholder=" "></textarea>
                                <label>{intl.formatMessage({ id: "page.group.form.group_description" })}</label>
                            </div>
                        </div>
                        <div className="col-span-12">
                            <div className="form-group-border select active">
                                <AiOutlineUser />
                                <select name="mentor_id" defaultValue={''} >
                                    <option selected disabled value="">{intl.formatMessage({ id: "page.group.form.choose_a_mentor" })}</option>
                                    {
                                        group_attributes.group_mentors?.map(mentor => (
                                            <option selected={edit_group.mentor_id === mentor.user_id} key={mentor.user_id} value={mentor.user_id}>{mentor.last_name} {mentor.first_name}</option>
                                        ))
                                    }
                                </select>
                                <label className={(error.mentor_id && 'label-error')}>{error.mentor_id ? error.mentor_id : intl.formatMessage({ id: "page.group.form.group_mentor" })}</label>
                            </div>
                        </div>
                        <div className="col-span-12">
                            <div className="relative">
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
                                                    {edit_group_members.includes(item.user_id)
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
                        </div>
                    </div>

                    {
                        edit_group_members.length > 0 && <p className="mt-4 text-corp">{intl.formatMessage({ id: "page.group.form.added_users" })}: <span className="text-active">{edit_group_members.length}</span></p>
                    }
                    <button className="btn btn-primary mt-4" type="submit"><AiOutlineUsergroupAdd /> <span>{intl.formatMessage({ id: "save_changes" })}</span></button>
                </form>
            </div>
        </>
    );
};

export default UpdateGroupModal;