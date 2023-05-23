import AuthLayout from "../components/layouts/AuthLayout";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import Loader from "../components/ui/Loader";
import { useSelector } from "react-redux";
import { AiOutlineMail, AiOutlineKey, AiOutlineEyeInvisible, AiOutlineEye, AiOutlineGlobal } from "react-icons/ai";
import { FiUserCheck } from "react-icons/fi";
import Link from "next/link";
import MAIN_DOMAIN from "../config/main_domain";

export default function Login() {
    const intl = useIntl();
    const title = intl.formatMessage({ id: "page.login.title" });
    const [loader, setLoader] = useState(false);
    const [showFullLoader, setShowFullLoader] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState([]);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [school_domain, setSchoolDomain] = useState('');

    const school = useSelector((state) => state.school.school_data);

    useEffect(() => {
        if (router.isReady) {
            const { t } = router?.query;
            if(school){
                setShowFullLoader(false);
            }
            if (t) {
                Cookies.set('token', t);
                router.push('/dashboard');
            }
        }
    }, [router.isReady, school]);

    const loginSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        const form_data = new FormData();
        if(!school.school_domain){
            form_data.append('school_domain', school_domain);
        }
        else{
            form_data.append('school_domain', school.school_domain);
        }

        form_data.append('email', email);
        form_data.append('password', password);

        await axios.post('auth/login', form_data)
            .then(response => {
                let token = response.data.data.token;

                if (!school.school_domain) {
                    window.location.replace('http://' + school_domain + '.' + MAIN_DOMAIN + '/login?t=' + token);
                }
                else {
                    Cookies.set('token', token);
                    router.push('/dashboard');
                }
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 422 || err.response.status == 401) {
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

    return (
        <AuthLayout showLoader={showFullLoader} title={title} school_name={school.school_name}>
            {loader && <Loader className="overlay" />}
            <form onSubmit={loginSubmit}>
                {error.auth_failed && <p className="text-danger mb-4">{error.auth_failed}</p>}

                {!school.school_domain &&
                    <div className="flex justify-between items-center">
                        <div className="form-group">
                            <AiOutlineGlobal />
                            <input onInput={e => setSchoolDomain(e.target.value)} type="text" value={school_domain} placeholder=" " />
                            <label className={(error.school_domain && 'label-error')}>{error.school_domain ? error.school_domain : intl.formatMessage({ id: "page.registration.form.school_domain" })}</label>
                            <span className="text-xs text-inactive">{intl.formatMessage({ id: "example" })}: <i>school.{MAIN_DOMAIN}</i></span>
                        </div>
                        <span className="-mt-11 pl-2 text-inactive">.{MAIN_DOMAIN}</span>
                    </div>
                }
                <div className="form-group">
                    <AiOutlineMail />
                    <input autoComplete="login-email" onInput={e => setEmail(e.target.value)} type="text" value={email} placeholder=" " />
                    <label className={(error.email && 'label-error')}>{error.email ? error.email : intl.formatMessage({ id: "page.registration.form.email" })}</label>
                </div>
                <div className="form-group">
                    <AiOutlineKey />
                    <input autoComplete="login-password" onInput={e => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} value={password} placeholder=" " />
                    <label className={(error.password && 'label-error')}>{error.password ? error.password : intl.formatMessage({ id: "page.registration.form.password" })}</label>
                    <div onClick={() => setShowPassword(!showPassword)}>{showPassword ? <AiOutlineEye className="show-password" /> : <AiOutlineEyeInvisible className="show-password" />}</div>
                </div>
                <p className="text-sm">{intl.formatMessage({ id: "page.login.form.forgot_password" })} <Link className="text-corp" href={'/password/forgot'}>{intl.formatMessage({ id: "page.login.form.password_recovery" })}</Link></p>
                <p className="text-sm">{intl.formatMessage({ id: "page.login.form.dont_have_an_account" })} <Link className="text-corp" href={'/registration'}>{intl.formatMessage({ id: "page.registration.title" })}</Link></p>

                <button className="btn btn-primary mt-4" type="submit"><FiUserCheck /> <span>{intl.formatMessage({ id: "page.login.button" })}</span></button>
            </form>
        </AuthLayout >
    )
}