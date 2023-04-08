import { AiOutlineDelete, AiOutlineStop } from "react-icons/ai";
import { useState } from "react";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import axios from "axios";
import Loader from "../ui/Loader";

const SubscribersModal = ({ subscribers, closeModal }) => {
    const intl = useIntl();
    const [loader, setLoader] = useState(false);
    const router = useRouter();
    let i = 0;

    return (
        <>
            {loader && <Loader className="overlay" />}
            <div className="modal-body">
                <div className="table mt-6">
                    <table>
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>{intl.formatMessage({ id: "operator" })}</th>
                                <th>{intl.formatMessage({ id: "recipient" })}</th>
                                <th>{intl.formatMessage({ id: "page.courses.subscribersModal.subscribe_type" })}</th> 
                                <th>{intl.formatMessage({ id: "cost" })}</th>
                                <th>{intl.formatMessage({ id: "created_at" })}</th>
                                {/* <th></th> */}
                            </tr>
                        </thead>

                        <tbody>
                            {subscribers?.map(s => (
                                <tr key={s.id}>
                                    <td>{i += 1}</td>
                                    <td>{s.operator_last_name} {s.operator_first_name}</td>
                                    <td>{s.recipient_last_name} {s.recipient_first_name}</td>
                                    <td>{s.subscribe_type_name}</td>
                                    <td>{s.cost}</td>
                                    <td>{new Date(s.created_at).toLocaleString()}</td>
                                    {/* <td>
                                        <div className="btn-wrap">
                                            <button onClick={() => getEditUser(user.user_id)} title={intl.formatMessage({ id: "edit" })} className="btn btn-edit"><AiOutlineEdit /></button>
                                        </div>
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default SubscribersModal;