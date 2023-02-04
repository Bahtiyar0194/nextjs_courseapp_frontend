import AuthLayout from "../components/layouts/AuthLayout";
import axios from "axios";
import { useState } from "react";
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import Loader from "../components/ui/Loader";
import { AiOutlineMail, AiOutlineUser, AiOutlinePhone, AiOutlineKey, AiOutlineEyeInvisible, AiOutlineEye, AiOutlineGlobal} from "react-icons/ai";
import { HiOutlineAcademicCap } from "react-icons/hi2";
import { FiUserPlus } from "react-icons/fi";
import Link from "next/link";

export default function Registration() {
    const intl = useIntl();
    const title = intl.formatMessage({ id: "page.registration.title" });
    const [loader, setLoader] = useState(false);
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [school_name, setSchoolName] = useState('');
    const [school_domain, setSchoolDomain] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState([]);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const registerSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        const form_data = new FormData();
        form_data.append('first_name', first_name);
        form_data.append('last_name', last_name);
        form_data.append('email', email);
        form_data.append('phone', phone);
        form_data.append('school_name', school_name);
        form_data.append('school_domain', school_domain);
        form_data.append('password', password);

        await axios.post('auth/register', form_data)
            .then(response => {
                let token = response.data.data.token
                Cookies.set('token', token);
                router.push('/dashboard');
            }).catch(error => {
                setError(error.response.data.data);
                setLoader(false);
            });
    }

    return (
        <AuthLayout title={title}>
                {loader && <Loader className="overlay" />}
                <form onSubmit={registerSubmit}>
                    <div className="form-group">
                        <AiOutlineUser />
                        <input onInput={e => setFirstName(e.target.value)} type="text" value={first_name} placeholder=" " />
                        <label className={(error.first_name && 'label-error')}>{error.first_name ? error.first_name : intl.formatMessage({ id: "page.registration.form.first_name" })}</label>
                    </div>
                    <div className="form-group">
                        <AiOutlineUser />
                        <input onInput={e => setLastName(e.target.value)} type="text" value={last_name} placeholder=" " />
                        <label className={(error.last_name && 'label-error')}>{error.last_name ? error.last_name : intl.formatMessage({ id: "page.registration.form.last_name" })}</label>
                    </div>
                    <div className="form-group">
                        <AiOutlineMail />
                        <input autoComplete="new-email" onInput={e => setEmail(e.target.value)} type="email" value={email} placeholder=" " />
                        <label className={(error.email && 'label-error')}>{error.email ? error.email : intl.formatMessage({ id: "page.registration.form.email" })}</label>
                    </div>
                    <div className="form-group">
                        <AiOutlinePhone />
                        <input onInput={e => setPhone(e.target.value)} type="number" value={phone} placeholder=" " />
                        <label className={(error.phone && 'label-error')}>{error.phone ? error.phone : intl.formatMessage({ id: "page.registration.form.phone" })}</label>
                    </div>
                    <div className="form-group">
                        <HiOutlineAcademicCap />
                        <input onInput={e => setSchoolName(e.target.value)} type="text" value={school_name} placeholder=" " />
                        <label className={(error.school_name && 'label-error')}>{error.school_name ? error.school_name : intl.formatMessage({ id: "page.registration.form.school_name" })}</label>
                    </div>
                    <div className="form-group">
                        <AiOutlineGlobal />
                        <div className="flex justify-between items-center">
                            <input onInput={e => setSchoolDomain(e.target.value)} type="text" value={school_domain} placeholder=" " />
                            <label className={(error.school_domain && 'label-error')}>{error.school_domain ? error.school_domain : intl.formatMessage({ id: "page.registration.form.school_domain" })}</label>
                            <span className="pl-2 text-gray-500">.lectoria.com</span>
                        </div>
                        <span className="text-xs text-gray-500">{intl.formatMessage({ id: "example" })}: <i>school.lectoria.com</i></span>
                    </div>
                    <div className="form-group">
                        <AiOutlineKey />
                        <input autoComplete="new-password" onInput={e => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} value={password} placeholder=" " />
                        <label className={(error.password && 'label-error')}>{error.password ? error.password : intl.formatMessage({ id: "page.registration.form.password" })}</label>
                        <div onClick={() => setShowPassword(!showPassword)}>{showPassword ? <AiOutlineEye className="right-0" /> : <AiOutlineEyeInvisible className="right-0" />}</div>
                    </div>
                    <p className="text-sm">{intl.formatMessage({ id: "page.registration.form.have_an_account" })} <Link href={'/login'}>{intl.formatMessage({ id: "page.login.title" })}</Link></p>

                    <button className="btn btn-primary mt-4" type="submit"><FiUserPlus/> <span>{title}</span></button>
                </form>
        </AuthLayout >
    )
}