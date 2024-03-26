import { AiOutlineCalendar, AiOutlineEdit, AiOutlineSearch, AiOutlineUndo, AiOutlineUser } from "react-icons/ai";
import { useState } from "react";
import { useIntl } from "react-intl";

import Loader from "../../../ui/Loader";
import Pagination from "../../../ui/Pagination";
import Alert from "../../../ui/Alert";
import debounceHandler from "../../../../utils/debounceHandler";
import StickyBox from "react-sticky-box";
import { useRouter } from "next/router";
import RoleProvider from "../../../../services/RoleProvider";
import UserAvatar from "../../../ui/UserAvatar";

const CompletedTasksList = ({ completed_tasks, getCompletedTasks, completed_tasks_loader, task_attributes }) => {
    const intl = useIntl();
    const router = useRouter();

    const [search_completed_tasks_filter, setSearchCompletedTasksFilter] = useState(false);

    const showHideCompletedTasksSearchFilter = () => {
        if (search_completed_tasks_filter === true) {
            setSearchCompletedTasksFilter(false);
            resetCompletedTasksSearchFilter();
        }
        else {
            setSearchCompletedTasksFilter(true);
        }
    }

    const resetCompletedTasksSearchFilter = () => {
        const search_form = document.querySelector('#completed_tasks_search_form');
        search_form.reset();
        getCompletedTasks();
    }

    return (
        <div className="custom-grid">

            <div className="col-span-12">
                <div className="btn-wrap">
                    <button onClick={() => showHideCompletedTasksSearchFilter()} className="btn btn-light"><AiOutlineSearch /> <span>{search_completed_tasks_filter === true ? intl.formatMessage({ id: "hide_search_filter" }) : intl.formatMessage({ id: "show_search_filter" })}</span></button>
                </div>
            </div>

            {search_completed_tasks_filter === true
                &&
                <div className="col-span-12 lg:col-span-3">
                    <StickyBox offsetTop={6} offsetBottom={6}>
                        <div className="card p-4">
                            <h5>{intl.formatMessage({ id: "task.search_filter" })}</h5>
                            <form id="completed_tasks_search_form">
                                <div className="custom-grid">
                                    <div className="col-span-12">
                                        <div className="form-group-border active">
                                            <AiOutlineEdit />
                                            <input autoComplete="search-task-name" type="text" defaultValue={''} name="task_name" placeholder=" " onChange={debounceHandler(getCompletedTasks, 1000)} />
                                            <label>{intl.formatMessage({ id: "task.task_name" })}</label>
                                        </div>
                                    </div>

                                    <div className="col-span-12">
                                        <div className="form-group-border select active label-active">
                                            <AiOutlineEdit />
                                            <select name="task_type_id" defaultValue={''} onChange={() => getCompletedTasks()}>
                                                <option selected value="">{intl.formatMessage({ id: "not_specified" })}</option>
                                                {
                                                    task_attributes.types_of_tasks?.map(type => (
                                                        <option key={type.task_type_id} value={type.task_type_id}>{type.task_type_name}</option>
                                                    ))
                                                }
                                            </select>
                                            <label>{intl.formatMessage({ id: "task.task_type" })}</label>
                                        </div>
                                    </div>

                                    <RoleProvider roles={[2, 3]}>
                                        <div className="col-span-12">
                                            <div className="form-group-border active">
                                                <AiOutlineUser />
                                                <input autoComplete="search-executor" type="text" defaultValue={''} name="executor" placeholder=" " onChange={debounceHandler(getCompletedTasks, 1000)} />
                                                <label>{intl.formatMessage({ id: "executor" })}</label>
                                            </div>
                                        </div>
                                    </RoleProvider>

                                    <RoleProvider roles={[2]}>
                                        <div className="col-span-12">
                                            <div className="form-group-border active">
                                                <AiOutlineUser />
                                                <input autoComplete="search-mentor" type="text" defaultValue={''} name="mentor" placeholder=" " onChange={debounceHandler(getCompletedTasks, 1000)} />
                                                <label>{intl.formatMessage({ id: "mentor" })}</label>
                                            </div>
                                        </div>
                                    </RoleProvider>

                                    <div className="col-span-12">
                                        <div className="form-group-border active">
                                            <AiOutlineCalendar />
                                            <input type="date" defaultValue={''} name="created_at_from" onChange={debounceHandler(getCompletedTasks, 1000)} placeholder=" " />
                                            <label>{intl.formatMessage({ id: "completion_at_from" })}</label>
                                        </div>
                                    </div>

                                    <div className="col-span-12">
                                        <div className="form-group-border active">
                                            <AiOutlineCalendar />
                                            <input type="date" defaultValue={''} name="created_at_to" onChange={debounceHandler(getCompletedTasks, 1000)} placeholder=" " />
                                            <label>{intl.formatMessage({ id: "completion_at_to" })}</label>
                                        </div>
                                    </div>

                                    <div className="col-span-12">
                                        <div className="btn-wrap">
                                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={debounceHandler(resetCompletedTasksSearchFilter, 500)}> <AiOutlineUndo /> <span>{intl.formatMessage({ id: "reset_search_filter" })}</span></button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </StickyBox>
                </div>
            }

            <div className={"col-span-12 " + (search_completed_tasks_filter === true ? 'lg:col-span-9' : '')}>
                {completed_tasks.data?.length > 0 ?
                    <>
                        <div className="table table-sm selectable">
                            {completed_tasks_loader && <Loader className="overlay" />}
                            <table>
                                <thead>
                                    <tr>
                                        <th>{intl.formatMessage({ id: "task.task_name" })}</th>
                                        <th>{intl.formatMessage({ id: "task.task_type" })}</th>
                                        <RoleProvider roles={[2, 3]}>
                                            <th>{intl.formatMessage({ id: "executor" })}</th>
                                        </RoleProvider>
                                        <RoleProvider roles={[2, 4]}>
                                            <th>{intl.formatMessage({ id: "mentor" })}</th>
                                        </RoleProvider>
                                        <th>{intl.formatMessage({ id: "completion_at" })}</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {completed_tasks.data?.map(task => (
                                        <tr key={task.task_id} onClick={() => router.push({
                                            pathname: '/dashboard/' + ((task.task_type_id === 1 || task.task_type_id === 4) ? 'test' : task.task_type_slug) + '/' + task.task_id,
                                            query: { executor_id: task.executor_id }
                                        })}>
                                            <td>{task.task_name}</td>
                                            <td>{task.task_type_name}</td>
                                            <RoleProvider roles={[2, 3]}>
                                                <td>
                                                    <div className="flex gap-x-2 items-center">
                                                        <UserAvatar user_avatar={task.executor_avatar} className={'w-8 h-8'} padding={0.5} />
                                                        {task.executor_last_name} {task.executor_first_name}
                                                    </div>
                                                </td>
                                            </RoleProvider>
                                            <RoleProvider roles={[2, 4]}>
                                                <td>
                                                    <div className="flex gap-x-2 items-center">
                                                        <UserAvatar user_avatar={task.inspector_avatar} className={'w-8 h-8'} padding={0.5} />
                                                        {task.inspector_last_name} {task.inspector_first_name}
                                                    </div>
                                                </td>
                                            </RoleProvider>
                                            <td>{new Date(task.created_at).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="btn-wrap mt-6">
                            <Pagination items={completed_tasks} setItems={getCompletedTasks} select_id={"completed-tasks-per-page-select"} />
                        </div>
                    </>
                    :
                    <Alert className="alert light">
                        {completed_tasks_loader && <Loader className="overlay" />}
                        <p className="mb-0">{intl.formatMessage({ id: "nothing_was_found_for_your_query" })}</p>
                    </Alert>
                }
            </div>
        </div>
    );
}

export default CompletedTasksList;