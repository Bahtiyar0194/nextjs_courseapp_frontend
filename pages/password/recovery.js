import AuthLayout from "../../components/layouts/AuthLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import Loader from "../../components/ui/Loader";
import { FiUserCheck } from "react-icons/fi";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineKey, AiOutlineNumber } from "react-icons/ai";
import Alert from "../../components/ui/Alert";
import serialize from 'form-serialize';
import Cookies from "js-cookie";
import InputMask from "react-input-mask";
import Link from "next/link";

export default function Activation() {
    const router = useRouter();
    const intl = useIntl();
    const title = intl.formatMessage({ id: "page.password.forgot.title" });
    const [loader, setLoader] = useState(false);
    const school = useSelector((state) => state.school.school_data);
    const [error, setError] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [recovery_code, setRecoveryCode] = useState('');

    const recoverySubmit = async (e) => {
        e.preventDefault();
        setLoader(true);

        const form_body = serialize(e.currentTarget, { hash: true, empty: true });
        form_body.school_domain = school.school_domain;

        let recovery_code = form_body.recovery_code.replace(/[^0-9]/g, '');
        form_body.recovery_code = recovery_code;

        await axios.post('auth/password_recovery', form_body)
            .then(response => {
                    Cookies.set('token', response.data.data.token);
                    router.push('/dashboard');
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
            if (router.query.code) {
                setRecoveryCode(router.query.code);
            }
        }
    }, [router.isReady]);

    return (
        <AuthLayout title={title} school_name={school.school_name}>
            {loader && <Loader className="overlay" />}
            <form onSubmit={recoverySubmit}>
                <Alert className="-mt-2 mb-6 light" text={intl.formatMessage({ id: "page.password.recovery.instruction" })} />

                <div className="form-group">
                    <AiOutlineNumber />
                    <InputMask autoComplete="new-recovery-code" name="recovery_code" mask="9999-9999" onChange={e => setRecoveryCode(e.target.value)} value={recovery_code} placeholder=" " />
                    <label className={(error.recovery_code && 'label-error')}>{error.recovery_code ? error.recovery_code : intl.formatMessage({ id: "page.password.recovery_code" })}</label>
                </div>

                <div className="form-group">
                    <AiOutlineKey />
                    <input autoComplete="new-password" name="password" type={showPassword ? 'text' : 'password'} placeholder=" " />
                    <label className={(error.password && 'label-error')}>{error.password ? error.password : intl.formatMessage({ id: "page.registration.form.new_password" })}</label>
                    <div onClick={() => setShowPassword(!showPassword)}>{showPassword ? <AiOutlineEye className="show-password" /> : <AiOutlineEyeInvisible className="show-password" />}</div>
                </div>

                <div className="form-group">
                    <AiOutlineKey />
                    <input autoComplete="new-confirm-password" name="password_confirmation" type={showPassword ? 'text' : 'password'} placeholder=" " />
                    <label className={(error.password_confirmation && 'label-error')}>{error.password_confirmation ? error.password_confirmation : intl.formatMessage({ id: "page.registration.form.confirm_new_password" })}</label>
                </div>

                <p className="text-sm">{intl.formatMessage({ id: "page.password.can't_recover_my_password" })} <Link className="text-corp" href={'/password/forgot'}>{intl.formatMessage({ id: "try_again" })}</Link></p>
                <p className="text-sm">{intl.formatMessage({ id: "page.login.form.dont_have_an_account" })} <Link className="text-corp" href={'/registration'}>{intl.formatMessage({ id: "page.registration.title" })}</Link></p>

                <button className="btn btn-primary mt-4" type="submit"><FiUserCheck /> <span>{intl.formatMessage({ id: "page.password.recovery_password" })}</span></button>
            </form>
        </AuthLayout >
    );
}