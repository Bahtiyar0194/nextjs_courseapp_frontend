import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Modal from "../../../components/ui/Modal";
import Loader from "../../../components/ui/Loader";
import { AiOutlineRead, AiOutlineFlag, AiOutlinePercentage, AiOutlinePlus, AiOutlinePicture, AiOutlineDoubleRight } from "react-icons/ai";
import { IoGridOutline, IoList } from "react-icons/io5";
import axios from "axios";
import Link from "next/link";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import API_URL from "../../../config/api";

export default function Users() {
    const [showFullLoader, setShowFullLoader] = useState(true);
    const [loader, setLoader] = useState(false);
    const intl = useIntl();
    const [userModal, setUserModal] = useState(false);
    const [users, setUsers] = useState([]);
    const roles = useSelector((state) => state.authUser.roles);


    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [error, setError] = useState([]);
    const router = useRouter();

    let i = 0;

    const getUsers = async () => {
        setShowFullLoader(true);
        await axios.get('users/get')
            .then(response => {
                setUsers(response.data)
                setShowFullLoader(false);
            }).catch(err => {
                if (err.response) {
                    router.push('/error/' + err.response.status)
                }
                else {
                    router.push('/error')
                }
            });
    }

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <DashboardLayout showLoader={showFullLoader} title={intl.formatMessage({ id: "page.users.title" })}>
            <Breadcrumb>
                {intl.formatMessage({ id: "page.users.title" })}
            </Breadcrumb>

            <div className="col-span-12">
                <div className="flex max-lg:flex-col lg:justify-between lg:items-center">
                    <h2 className="mb-0 max-lg:mb-4">{intl.formatMessage({ id: "page.users.title" })}</h2>
                    <div className="flex">


                    </div>
                </div>
            </div>
 

                    <div className="col-span-12">
                        <div className="table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>№</th>
                                        <th>{intl.formatMessage({ id: "page.registration.form.last_name" })}</th>
                                        <th>{intl.formatMessage({ id: "page.registration.form.first_name" })}</th>
                                        <th>{intl.formatMessage({ id: "page.registration.form.email" })}</th>
                                        <th>{intl.formatMessage({ id: "page.registration.form.phone" })}</th>
                                        <th>{intl.formatMessage({ id: "created_at" })}</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {users?.map(user => (
                                        <tr>
                                            <td>{i + 1}</td>
                                            <td>{user.last_name}</td>
                                            <td>{user.first_name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phone}</td>
                                            <td>{new Date(user.created_at).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
        </DashboardLayout>
    );
}