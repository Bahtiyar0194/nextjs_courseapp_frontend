import { AiOutlineCalendar, AiOutlineEdit, AiOutlineSearch, AiOutlineUndo } from "react-icons/ai";
import { useState } from "react";
import { useIntl } from "react-intl";

import Loader from "../../../ui/Loader";
import Pagination from "../../../ui/Pagination";
import Alert from "../../../ui/Alert";
import debounceHandler from "../../../../utils/debounceHandler";
import StickyBox from "react-sticky-box";
import { useRouter } from "next/router";

const TypicalTasksList = ({ typical_tasks, getTypicalTasks, typical_tasks_loader }) => {
    const intl = useIntl();
    const router = useRouter();

    const [search_typical_tasks_filter, setSearchTypicalTasksFilter] = useState(false);

    const showHideTypicalTasksSearchFilter = () => {
        if (search_typical_tasks_filter === true) {
            setSearchTypicalTasksFilter(false);
            resetTypicalTasksSearchFilter();
        }
        else {
            setSearchTypicalTasksFilter(true);
        }
    }

    const resetTypicalTasksSearchFilter = () => {
        const search_form = document.querySelector('#typical_tasks_search_form');
        search_form.reset();
        getTypicalTasks();
    }

    return (
        <div className="custom-grid">

            <div className="col-span-12">
                <div className="btn-wrap">
                    <button onClick={() => showHideTypicalTasksSearchFilter()} className="btn btn-light"><AiOutlineSearch /> <span>{search_typical_tasks_filter === true ? intl.formatMessage({ id: "hide_search_filter" }) : intl.formatMessage({ id: "show_search_filter" })}</span></button>
                </div>
            </div>

            {search_typical_tasks_filter === true
                &&
                <div className="col-span-12 lg:col-span-3">
                    <StickyBox offsetTop={6} offsetBottom={6}>
                        <div className="card p-4">
                            <h5>{intl.formatMessage({ id: "task.search_filter" })}</h5>
                            <form id="typical_tasks_search_form">
                                <div className="custom-grid">
                                    <div className="col-span-12">
                                        <div className="form-group-border active">
                                            <AiOutlineEdit />
                                            <input autoComplete="search-task-name" type="text" defaultValue={''} name="task_name" placeholder=" " onChange={debounceHandler(getTypicalTasks, 1000)} />
                                            <label>{intl.formatMessage({ id: "task.task_name" })}</label>
                                        </div>
                                    </div>

                                    <div className="col-span-12">
                                        <div className="form-group-border active">
                                            <AiOutlineCalendar />
                                            <input type="date" defaultValue={''} name="created_at_from" onChange={debounceHandler(getTypicalTasks, 1000)} placeholder=" " />
                                            <label>{intl.formatMessage({ id: "created_at_from" })}</label>
                                        </div>
                                    </div>

                                    <div className="col-span-12">
                                        <div className="form-group-border active">
                                            <AiOutlineCalendar />
                                            <input type="date" defaultValue={''} name="created_at_to" onChange={debounceHandler(getTypicalTasks, 1000)} placeholder=" " />
                                            <label>{intl.formatMessage({ id: "created_at_to" })}</label>
                                        </div>
                                    </div>

                                    <div className="col-span-12">
                                        <div className="btn-wrap">
                                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={debounceHandler(resetTypicalTasksSearchFilter, 500)}> <AiOutlineUndo /> <span>{intl.formatMessage({ id: "reset_search_filter" })}</span></button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </StickyBox>
                </div>
            }

            <div className={"col-span-12 " + (search_typical_tasks_filter === true ? 'lg:col-span-9' : '')}>
                {typical_tasks.data?.length > 0 ?
                    <>
                        <div className="table table-sm selectable">
                            {typical_tasks_loader && <Loader className="overlay" />}
                            <table>
                                <thead>
                                    <tr>
                                        <th>{intl.formatMessage({ id: "task.task_name" })}</th>
                                        <th>{intl.formatMessage({ id: "lesson_name" })}</th>
                                        <th>{intl.formatMessage({ id: "created_at" })}</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {typical_tasks.data?.map(task => (
                                        <tr key={task.task_id} onClick={() => router.push('/dashboard/' + task.task_type_slug + '/' + task.task_id)}>
                                            <td>{task.task_name}</td>
                                            <td>{task.lesson_name}</td>
                                            <td>{new Date(task.created_at).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="btn-wrap mt-6">
                            <Pagination items={typical_tasks} setItems={getTypicalTasks} select_id={"typical-tasks-per-page-select"} />
                        </div>
                    </>
                    :
                    <Alert className="alert light">
                        {typical_tasks_loader && <Loader className="overlay" />}
                        <p className="mb-0">{intl.formatMessage({ id: "nothing_was_found_for_your_query" })}</p>
                    </Alert>
                }
            </div>
        </div>
    );
}

export default TypicalTasksList;