import AuthLayout from "../components/layouts/AuthLayout";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import Loader from "../components/ui/Loader";
import { AiOutlineMail, AiOutlineKey, AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { FiUserCheck } from "react-icons/fi";
import Link from "next/link";

export default function Login() {
    const intl = useIntl();
    const title = intl.formatMessage({ id: "page.login.title" });
    const [loader, setLoader] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [school_domain, setSchoolDomain] = useState('');
    const [error, setError] = useState([]);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const [school, setSchool] = useState([]);

    const getSchool = async () => {
        setLoader(true)
        await axios.get('school/get')
            .then(response => {
                setSchool(response.data);
                setSchoolDomain(response.data.school_domain);
                setLoader(false)
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
        getSchool();
    }, []);

    const loginSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        const form_data = new FormData();
        form_data.append('school_domain', school_domain);
        form_data.append('email', email);
        form_data.append('password', password);

        await axios.post('auth/login', form_data)
            .then(response => {
                let token = response.data.data.token
                Cookies.set('token', token);
                router.push('/dashboard');
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 422 || err.response.status == 401) {
                        setError(err.response.data.data);
                        setLoader(false);
                    }
                    else {
                        router.push('/error/' + err.response.status)
                    }
                }
                else {
                    router.push('/error/')
                }
            });
    }

    return (
        <AuthLayout title={title} school_name={school.school_name}>
            {loader && <Loader className="overlay" />}
            <form onSubmit={loginSubmit}>
                {error.auth_failed && <p className="text-danger mb-4">{error.auth_failed}</p>}
                <div className="form-group">
                    <AiOutlineMail />
                    <input autoComplete="new-email" onInput={e => setEmail(e.target.value)} type="text" value={email} placeholder=" " />
                    <label className={(error.email && 'label-error')}>{error.email ? error.email : intl.formatMessage({ id: "page.registration.form.email" })}</label>
                </div>
                <div className="form-group">
                    <AiOutlineKey />
                    <input autoComplete="new-password" onInput={e => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} value={password} placeholder=" " />
                    <label className={(error.password && 'label-error')}>{error.password ? error.password : intl.formatMessage({ id: "page.registration.form.password" })}</label>
                    <div onClick={() => setShowPassword(!showPassword)}>{showPassword ? <AiOutlineEye className="show-password" /> : <AiOutlineEyeInvisible className="show-password" />}</div>
                </div>
                <p className="text-sm">{intl.formatMessage({ id: "page.login.form.forgot_password" })} <Link href={'/forgot-password'}>{intl.formatMessage({ id: "page.login.form.password_recovery" })}</Link></p>
                <p className="text-sm">{intl.formatMessage({ id: "page.login.form.dont_have_an_account" })} <Link href={'/registration'}>{intl.formatMessage({ id: "page.registration.title" })}</Link></p>

                <button className="btn btn-primary mt-4" type="submit"><FiUserCheck /> <span>{intl.formatMessage({ id: "page.login.button" })}</span></button>
            </form>
        </AuthLayout >
    )
}