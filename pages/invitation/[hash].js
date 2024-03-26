import AuthLayout from "../../components/layouts/AuthLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import Loader from "../../components/ui/Loader";
import { FiUserCheck } from "react-icons/fi";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineKey, AiOutlineUser, AiOutlinePhone, AiOutlineMail } from "react-icons/ai";
import InputMask from "react-input-mask";
import serialize from 'form-serialize';
import Cookies from "js-cookie";

export default function Activation() {
    const router = useRouter();
    const intl = useIntl();
    const title = intl.formatMessage({ id: "page.courses.invitation.title" });
    const [invitation_hash, setInvitationHash] = useState('');
    const [loader, setLoader] = useState(false);
    const school = useSelector((state) => state.school.school_data);
    const [course, setCourse] = useState([]);
    const [phone, setPhone] = useState('');
    const [error, setError] = useState([]);
    const [showPassword, setShowPassword] = useState(false);

    const getInvitation = async (hash) => {
        await axios.get('courses/get_invitation/' + hash)
            .then(response => {
                setCourse(response.data);
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

    const invitationSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);

        const form_body = serialize(e.currentTarget, { hash: true, empty: true });

        await axios.post('auth/accept_invitation/' + invitation_hash, form_body)
            .then(response => {
                Cookies.set('token', response.data.data.token);
                router.push('/dashboard/courses/' + course.course_id);
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
            setInvitationHash(router.query.hash);
            getInvitation(router.query.hash);
        }
    }, [router.isReady]);

    return (
        <AuthLayout title={title} school_name={school.school_name}>
            {loader && <Loader className="overlay" />}
            <form onSubmit={invitationSubmit}>

                {error.registration_failed && <p className="text-danger mb-4">{error.registration_failed}</p>}

                <div className="form-group">
                    <AiOutlineUser />
                    <input type="text" name="first_name" defaultValue={''} placeholder=" " />
                    <label className={(error.first_name && 'label-error')}>{error.first_name ? error.first_name : intl.formatMessage({ id: "page.registration.form.first_name" })}</label>
                </div>

                <div className="form-group">
                    <AiOutlineUser />
                    <input type="text" name="last_name" defaultValue={''} placeholder=" " />
                    <label className={(error.last_name && 'label-error')}>{error.last_name ? error.last_name : intl.formatMessage({ id: "page.registration.form.last_name" })}</label>
                </div>

                <div className="form-group">
                    <AiOutlinePhone />
                    <InputMask mask="+7 (799) 999-9999" onChange={e => setPhone(e.target.value)} name="phone" value={phone} placeholder=" " />
                    <label className={(error.phone && 'label-error')}>{error.phone ? error.phone : intl.formatMessage({ id: "page.registration.form.phone" })}</label>
                </div>
                <div className="form-group">
                    <AiOutlineMail />
                    <input autoComplete="new-email" type="text" name="email" defaultValue={course?.subscriber_email} placeholder=" " />
                    <label className={(error.email && 'label-error')}>{error.email ? error.email : intl.formatMessage({ id: "page.registration.form.email" })}</label>
                </div>
                <div className="form-group">
                    <AiOutlineKey />
                    <input autoComplete="new-password" type={showPassword ? 'text' : 'password'} name="password" defaultValue={''} placeholder=" " />
                    <label className={(error.password && 'label-error')}>{error.password ? error.password : intl.formatMessage({ id: "page.registration.form.password" })}</label>
                    <div onClick={() => setShowPassword(!showPassword)}>{showPassword ? <AiOutlineEye className="show-password" /> : <AiOutlineEyeInvisible className="show-password" />}</div>
                </div>

                <button className="btn btn-primary mt-4" type="submit"><FiUserCheck /> <span>{intl.formatMessage({ id: "page.account_activation.button" })}</span></button>
            </form>
        </AuthLayout >
    );
}