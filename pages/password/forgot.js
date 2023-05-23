import AuthLayout from "../../components/layouts/AuthLayout";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import Loader from "../../components/ui/Loader";
import { AiOutlineMail, AiOutlineGlobal, AiOutlineCheck } from "react-icons/ai";
import MAIN_DOMAIN from "../../config/main_domain";
import Alert from "../../components/ui/Alert";

export default function ForgotPassword() {
    const intl = useIntl();
    const title = intl.formatMessage({ id: "page.password.forgot.title" });
    const [loader, setLoader] = useState(false);
    const [email, setEmail] = useState('');
    const [school_domain, setSchoolDomain] = useState('');
    const [error, setError] = useState([]);
    const router = useRouter();

    const school = useSelector((state) => state.school.school_data);

    const forgotSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        const form_data = new FormData();
        form_data.append('school_domain', school_domain);
        form_data.append('email', email);

        await axios.post('auth/forgot_password', form_data)
            .then(response => {
                if (!school.school_domain) {
                    window.location.replace('http://' + school_domain + '.' + MAIN_DOMAIN + '/password/recovery');
                }
                else {
                    router.push('/password/recovery');
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

    useEffect(() => {
        if (router.isReady) {
            if (school.school_id) {
                setSchoolDomain(school.school_domain);
            }
        }
    }, [router.isReady, school]);

    return (
        <AuthLayout title={title} school_name={school.school_name}>
            {loader && <Loader className="overlay" />}
            <form onSubmit={forgotSubmit}>
                <Alert className="-mt-2 mb-6 light" text={intl.formatMessage({ id: "page.password.forgot.instruction" })} />

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
                    <input autoComplete="new-email" onInput={e => setEmail(e.target.value)} type="text" value={email} placeholder=" " />
                    <label className={(error.email && 'label-error')}>{error.email ? error.email : intl.formatMessage({ id: "page.registration.form.email" })}</label>
                </div>

                <button className="btn btn-primary mt-4" type="submit"><AiOutlineCheck /> <span>{intl.formatMessage({ id: "page.password.send_the_code" })}</span></button>
            </form>
        </AuthLayout >
    )
}