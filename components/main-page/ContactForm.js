import { useState } from "react";
import { useIntl } from "react-intl";
import Loader from "../ui/Loader";
import axios from "axios";
import { AiOutlineCheck, AiOutlineMail, AiOutlinePhone, AiOutlineUser } from "react-icons/ai";
import InputMask from "react-input-mask";
import serialize from 'form-serialize';

const ContactForm = () => {
    const intl = useIntl();
    const [error, setError] = useState([]);
    const [loader, setLoader] = useState(false);
    const [contact_phone, setContactPhone] = useState('');
    const [contact_sended, setContactSended] = useState(false);


    const contactFormSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);

        const form_body = serialize(e.currentTarget, { hash: true, empty: true });

        await axios.post('/contacts/send', form_body)
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
        <div className="card p-8">
            {loader && <Loader className="overlay" />}

            {contact_sended === false
                ?
                <form onSubmit={e => contactFormSubmit(e)} encType="multipart/form-data">

                    <p className="mb-6 text-center text-inactive">Оставьте заявку и наш менеджер свяжется с вами в ближайшее время и ответит на Ваши вопросы.</p>

                    <div className="form-group-border mb-6">
                        <AiOutlineUser />
                        <input autoComplete="contact-name" type="text" defaultValue={''} name="first_name" placeholder=" " />
                        <label>{intl.formatMessage({ id: "page.registration.form.first_name" })}</label>
                    </div>

                    <div className="form-group-border mb-6">
                        <AiOutlineMail />
                        <input autoComplete="contact-email" type="text" defaultValue={''} name="email" placeholder=" " />
                        <label>{intl.formatMessage({ id: "page.registration.form.email" })}</label>
                    </div>

                    <div className="form-group-border mb-6">
                        <AiOutlinePhone />
                        <InputMask mask="+7 (799) 999-9999" onInput={e => setContactPhone(e.target.value)} value={contact_phone} name="phone" placeholder=" " />
                        <label>{intl.formatMessage({ id: "page.registration.form.phone" })}</label>
                    </div>

                    <button className="btn btn-primary mt-4" type="submit"><AiOutlineCheck /> <span>{intl.formatMessage({ id: "done" })}</span></button>
                </form>
                :
                <h5 className="text-center">
                    Ваша заявка была успешно отправлена. Наш менеджер свяжется с вами в ближайшее время и ответит на Ваши вопросы.
                </h5>
            }
        </div>
    )
}

export default ContactForm;