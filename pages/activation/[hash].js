import AuthLayout from "../../components/layouts/AuthLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Loader from "../../components/ui/Loader";
import { FiUserCheck } from "react-icons/fi";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineKey } from "react-icons/ai";
import Alert from "../../components/ui/Alert";
import serialize from 'form-serialize';
import Cookies from "js-cookie";

export default function Lesson() {
    const router = useRouter();
    const intl = useIntl();
    const title = intl.formatMessage({ id: "page.account_activation.title" });
    const [email_hash, setEmailHash] = useState('');
    const [loader, setLoader] = useState(false);
    const [school, setSchool] = useState([]);
    const [user, setUser] = useState([]);
    const [error, setError] = useState([]);
    const [showPassword, setShowPassword] = useState(false);

    const getSchool = async (hash) => {
        setLoader(true);
        await axios.get('school/get')
            .then(response => {
                setSchool(response.data);
                getActivationUser(hash);
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
    }

    const getActivationUser = async (hash) => {
        await axios.get('auth/get_activation_user/' + hash)
            .then(response => {
                setUser(response.data);
                setLoader(false);
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
    }

    const activateSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);

        const form_body = serialize(e.currentTarget, { hash: true, empty: true });

        await axios.post('auth/activate_user/' + email_hash, form_body)
            .then(response => {
                Cookies.set('token', response.data.data.token);
                router.push('/dashboard');
                setLoader(false);
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 422) {
                        setError(err.response.data.data);
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

    useEffect(() => {
        if (router.isReady) {
            setEmailHash(router.query.hash);
            getSchool(router.query.hash);
        }
    }, [router.isReady]);

    return (
        <AuthLayout title={title} school_name={school.school_name}>
            {loader && <Loader className="overlay" />}
            <form onSubmit={activateSubmit}>
                {user.user_id && <Alert className="-mt-2 mb-4 outline-primary" text={intl.formatMessage({ id: "page.home.welcome" }) + ', ' + user.last_name + ' ' + user.first_name + '! ' + intl.formatMessage({ id: "page.account_activation.description" })} />}
                <div className="form-group">
                    <AiOutlineKey />
                    <input autoComplete="new-password" name="password" type={showPassword ? 'text' : 'password'} placeholder=" " />
                    <label className={(error.password && 'label-error')}>{error.password ? error.password : intl.formatMessage({ id: "page.registration.form.password" })}</label>
                    <div onClick={() => setShowPassword(!showPassword)}>{showPassword ? <AiOutlineEye className="show-password" /> : <AiOutlineEyeInvisible className="show-password" />}</div>
                </div>

                <div className="form-group">
                    <AiOutlineKey />
                    <input autoComplete="new-confirm-password" name="password_confirmation" type={showPassword ? 'text' : 'password'} placeholder=" " />
                    <label className={(error.password_confirmation && 'label-error')}>{error.password_confirmation ? error.password_confirmation : intl.formatMessage({ id: "page.registration.form.confirm_password" })}</label>
                </div>

                <button className="btn btn-primary mt-4" type="submit"><FiUserCheck /> <span>{intl.formatMessage({ id: "page.account_activation.button" })}</span></button>
            </form>
        </AuthLayout >
    );
}