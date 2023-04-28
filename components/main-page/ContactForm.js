import { useState } from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import Loader from "../ui/Loader";
import axios from "axios";
import { AiOutlineCheck, AiOutlineMail, AiOutlineMessage, AiOutlinePhone, AiOutlineUser } from "react-icons/ai";
import InputMask from "react-input-mask";
import serialize from 'form-serialize';

const ContactForm = () => {
    const intl = useIntl();
    const router = useRouter();
    const [error, setError] = useState([]);
    const [loader, setLoader] = useState(false);
    const [contact_phone, setContactPhone] = useState('');
    const [contact_sended, setContactSended] = useState(false);

    const contactFormSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);

        const form_body = serialize(e.currentTarget, { hash: true, empty: true });

        await axios.post('/contacts/send_feedback', form_body)
            .then(response => {
                setLoader(false);
                setContactSended(true);
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

    return (
        <div className="card p-4 md:p-6 lg:p-8">
            {loader && <Loader className="overlay" />}

            {contact_sended === false
                ?
                <form onSubmit={e => contactFormSubmit(e)} encType="multipart/form-data">

                    <h5 className="mb-6 text-center">{intl.formatMessage({ id: "page.home.leave_a_feedback" })}</h5>

                    <div className="form-group-border mb-6">
                        <AiOutlineUser />
                        <input autoComplete="contact-name" type="text" defaultValue={''} name="first_name" placeholder=" " />
                        <label className={(error.first_name && 'label-error')}>{error.first_name ? error.first_name : intl.formatMessage({ id: "page.registration.form.first_name" })}</label>
                    </div>

                    <div className="form-group-border mb-6">
                        <AiOutlineMail />
                        <input autoComplete="contact-email" type="text" defaultValue={''} name="email" placeholder=" " />
                        <label className={(error.email && 'label-error')}>{error.email ? error.email : intl.formatMessage({ id: "page.registration.form.email" })}</label>
                    </div>

                    <div className="form-group-border mb-6">
                        <AiOutlinePhone />
                        <InputMask mask="+7 (799) 999-9999" onInput={e => setContactPhone(e.target.value)} value={contact_phone} name="phone" placeholder=" " />
                        <label className={(error.phone && 'label-error')}>{error.phone ? error.phone : intl.formatMessage({ id: "page.registration.form.phone" })}</label>
                    </div>

                    <div className="form-group-border mb-4">
                        <AiOutlineMessage />
                        <textarea autoComplete="contact-question" type="text" defaultValue={''} name="question" placeholder=" "></textarea>
                        <label>{intl.formatMessage({ id: "your_question" })} ({intl.formatMessage({ id: "not_necessary" })})</label>
                    </div>

                    <label className="custom-checkbox">
                        <input name="data_agreement" type="checkbox" />
                        {error.data_agreement ? <span className="error">{intl.formatMessage({ id: "you_must_accept_data_agreement" })}</span> : <span>{intl.formatMessage({ id: "data_agreement" })}</span>}
                    </label>

                    <button className="btn btn-primary mt-4" type="submit"><AiOutlineCheck /> <span>{intl.formatMessage({ id: "done" })}</span></button>
                </form>
                :
                <h5 className="text-center mb-0">
                    {intl.formatMessage({ id: "page.home.feedback.succesfully_sent" })}
                </h5>
            }
        </div>
    )
}

export default ContactForm;