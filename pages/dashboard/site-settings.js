import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import axios from "axios";
import Breadcrumb from "../../components/ui/Breadcrumb";
import { AiOutlineCheck, AiOutlineRead, AiOutlineFormatPainter, AiOutlineFontSize, AiOutlineCrown, AiOutlineDelete, AiOutlineMail, AiOutlinePhone, AiOutlineInstagram, AiOutlineFacebook, AiOutlineWhatsApp, AiOutlineYoutube } from "react-icons/ai";
import { FaTelegram, FaTiktok } from "react-icons/fa";
import serialize from 'form-serialize';
import InputMask from "react-input-mask";
import ButtonLoader from "../../components/ui/ButtonLoader";
import { useDispatch, useSelector } from "react-redux";
import { setSchoolData } from "../../store/slices/schoolSlice";
import debounceHandler from "../../utils/debounceHandler";
import RoleProvider from "../../services/RoleProvider";
import Modal from "../../components/ui/Modal";
import UploadLogoModal from "../../components/site-settings/UploadLogo";
import API_URL from "../../config/api";
import DeleteLogoModal from "../../components/site-settings/DeleteLogoModal";
import { scrollIntoView } from "seamless-scroll-polyfill";

export default function SiteSettings() {
    const [button_loader, setButtonLoader] = useState(false);
    const [error, setError] = useState([]);
    const intl = useIntl();
    const router = useRouter();
    const school = useSelector((state) => state.school.school_data);
    const [school_attributes, setSchoolAttributes] = useState([]);

    const [edit_school_phone, setEditSchoolPhone] = useState('');
    const [edit_school_whatsapp, setEditSchoolWhatsApp] = useState('');

    const [light_logo_modal, setLightLogoModal] = useState(false);
    const [light_logo_file, setLightLogoFile] = useState(null);

    const [dark_logo_modal, setDarkLogoModal] = useState(false);
    const [dark_logo_file, setDarkLogoFile] = useState(null);

    const [delete_logo_modal, setDeleteLogoModal] = useState(false);
    const [delete_logo_variable, setDeleteLogoVariable] = useState('');

    const dispatch = useDispatch();

    const saveSchoolSubmit = async (e) => {
        e.preventDefault();
        setButtonLoader(true);

        const form_body = serialize(e.currentTarget, { hash: true, empty: true });

        await axios.post('school/update', form_body)
            .then(response => {
                dispatch(setSchoolData(response.data.school));
                router.push('/dashboard');
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 422) {
                        setError(err.response.data.data);
                        setButtonLoader(false);
                        let card = document.querySelector('#edit_wrap');
                        setTimeout(() => {
                            scrollIntoView(card, { behavior: "smooth", block: "start", inline: "center" });
                        }, 200);
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

    const setSchoolSettings = async () => {
        const settings_form = document.querySelector('#settings_form');
        const form_body = serialize(settings_form, { hash: true, empty: true });

        await axios.post('school/set_attributes', form_body)
            .then(response => {
                document.querySelector('body').classList.remove(response.data.old_title_font_class.toString());
                document.querySelector('body').classList.add(response.data.new_title_font_class.toString());
                document.querySelector('body').classList.remove(response.data.old_body_font_class.toString());
                document.querySelector('body').classList.add(response.data.new_body_font_class.toString());
                document.querySelector('body').classList.remove(response.data.old_color_scheme_class.toString());
                document.querySelector('body').classList.add(response.data.new_color_scheme_class.toString());
                getSchoolAttributes();
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 422) {
                        setError(err.response.data.data);
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

    const getSchoolAttributes = async () => {
        await axios.get('school/get_attributes')
            .then(response => {
                dispatch(setSchoolData(response.data.school));
                setSchoolAttributes(response.data);
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

    const cancelUpload = () => {
        setLightLogoFile(null);
        setLightLogoModal(false);
        setDarkLogoFile(null);
        setDarkLogoModal(false);
    }

    const deleteLogo = (logo_variable) => {
        setDeleteLogoVariable(logo_variable);
        setDeleteLogoModal(true);
    }

    useEffect(() => {
        getSchoolAttributes();
    }, []);

    return (
        <DashboardLayout showLoader={false} title={intl.formatMessage({ id: "page.site_settings.title" })}>
            <RoleProvider roles={[2]} redirect={true}>
                <Breadcrumb>
                    {intl.formatMessage({ id: "page.site_settings.title" })}
                </Breadcrumb>
                <div id="edit_wrap" className="col-span-12 lg:col-span-12">
                    <div className="title-wrap">
                        <h2>{intl.formatMessage({ id: "page.site_settings.title" })}</h2>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-6">
                    <form onSubmit={e => saveSchoolSubmit(e)} encType="multipart/form-data">
                        <div className="form-group-border active label-inactive">
                            <AiOutlineRead />
                            <input autoComplete="edit_school_name" type="text" defaultValue={school.school_name} name="school_name" placeholder=" " />
                            <label className={(error.school_name && 'label-error')}>{error.school_name ? error.school_name : intl.formatMessage({ id: "page.site.school_name" })}</label>
                        </div>

                        <div className="form-group-border active label-inactive mt-6">
                            <AiOutlineRead />
                            <textarea autoComplete="edit_about_school" type="text" defaultValue={school.about} name="about" placeholder=" "></textarea>
                            <label className={(error.about && 'label-error')}>{error.about ? error.about : intl.formatMessage({ id: "page.registration.form.about_school" })}</label>
                        </div>

                        <div className="form-group-border active label-inactive mt-6">
                            <AiOutlineMail />
                            <input autoComplete="edit_school_email" type="text" defaultValue={school.email} name="email" placeholder=" " />
                            <label className={(error.email && 'label-error')}>{error.email ? error.email : intl.formatMessage({ id: "page.registration.form.email" })}</label>
                        </div>

                        <div className="form-group-border active label-inactive mt-6">
                            <AiOutlinePhone />
                            <InputMask autoComplete="edit_school_phone" mask="+7 (799) 999-9999" onInput={e => setEditSchoolPhone(e.target.value)} value={edit_school_phone} name="phone" placeholder=" " />
                            <label className={(error.phone && 'label-error')}>{error.phone ? error.phone : intl.formatMessage({ id: "page.registration.form.phone" })}</label>
                        </div>

                        <div className="form-group-border active label-inactive mt-6">
                            <AiOutlineInstagram />
                            <input autoComplete="edit_school_instagram" type="text" defaultValue={school.instagram} name="instagram" placeholder=" " />
                            <label className={(error.instagram && 'label-error')}>{error.instagram ? error.instagram : "Instagram"}</label>
                        </div>

                        <div className="form-group-border active label-inactive mt-6">
                            <AiOutlineFacebook />
                            <input autoComplete="edit_school_facebook" type="text" defaultValue={school.facebook} name="facebook" placeholder=" " />
                            <label className={(error.facebook && 'label-error')}>{error.facebook ? error.facebook : "Facebook"}</label>
                        </div>

                        <div className="form-group-border active label-inactive mt-6">
                            <FaTiktok />
                            <input autoComplete="edit_school_tiktok" type="text" defaultValue={school.tiktok} name="tiktok" placeholder=" " />
                            <label className={(error.tiktok && 'label-error')}>{error.tiktok ? error.tiktok : "TikTok"}</label>
                        </div>

                        <div className="form-group-border active label-inactive mt-6">
                            <AiOutlineWhatsApp />
                            <InputMask autoComplete="edit_school_whatsapp" mask="+7 (799) 999-9999" onInput={e => setEditSchoolWhatsApp(e.target.value)} value={edit_school_whatsapp} name="whatsapp" placeholder=" " />
                            <label className={(error.whatsapp && 'label-error')}>{error.whatsapp ? error.whatsapp : "Whatsapp"}</label>
                        </div>

                        <div className="form-group-border active label-inactive mt-6">
                            <FaTelegram />
                            <input autoComplete="edit_school_telegram" type="text" defaultValue={school.telegram} name="telegram" placeholder=" " />
                            <label className={(error.telegram && 'label-error')}>{error.telegram ? error.telegram : "Telegram"}</label>
                        </div>

                        <div className="form-group-border active label-inactive mt-6">
                            <AiOutlineYoutube />
                            <input autoComplete="edit_school_youtube" type="text" defaultValue={school.youtube} name="whatsapp" placeholder=" " />
                            <label className={(error.youtube && 'label-error')}>{error.youtube ? error.youtube : "Youtube"}</label>
                        </div>

                        <div className="btn-wrap mt-6">
                            <button disabled={button_loader} className="btn btn-primary" type="submit">
                                {button_loader === true ? <ButtonLoader /> : <AiOutlineCheck />}
                                <span>{intl.formatMessage({ id: "save_changes" })}</span>
                            </button>
                        </div>
                    </form>
                </div>

                <div className="col-span-12 lg:col-span-6">
                    <form id="settings_form" onSubmit={e => saveSettingsSubmit(e)} encType="multipart/form-data">
                        <div className="form-group-border active label-inactive">
                            <AiOutlineFormatPainter />
                            <select name="theme_id" defaultValue={school.theme_id} onChange={debounceHandler(e => setSchoolSettings(), 500)}>
                                <option disabled value="">{intl.formatMessage({ id: "theme.select_default_theme" })}</option>
                                {
                                    school_attributes.themes?.map(theme => (
                                        <option selected={school.theme_id === theme.theme_id} key={theme.theme_id} value={theme.theme_id}>{intl.formatMessage({ id: "theme." + theme.theme_slug })}</option>
                                    ))
                                }
                            </select>
                            <label className={(error.theme_id && 'label-error')}>{error.theme_id ? error.theme_id : intl.formatMessage({ id: "theme.default_theme" })}</label>
                        </div>

                        <div className="custom-grid mt-6">
                            {(school.theme_id == 1 || school.theme_id == 2) &&
                                <div className="col-span-12">
                                    <div className="border-active p-4 rounded-lg">
                                        <div className="flex gap-4 flex-wrap">
                                            {school.light_theme_logo ?
                                                <>
                                                    <div className="border-active border-dashed p-1">
                                                        <div className="bg-white w-48 h-fit">
                                                            <img className="w-full h-auto" src={API_URL + '/school/get_logo/' + school.light_theme_logo + '/light_logo'} />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h5 className="mb-2">{intl.formatMessage({ id: "theme.light_logo" })}</h5>
                                                        <div className="btn-wrap">
                                                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={e => setLightLogoModal(true)}><AiOutlineCrown /> <span className="whitespace-nowrap">{intl.formatMessage({ id: "theme.change_logo" })}</span></button>
                                                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={e => deleteLogo('light_logo')}><AiOutlineDelete /> <span className="whitespace-nowrap">{intl.formatMessage({ id: "theme.delete_logo" })}</span></button>
                                                        </div>
                                                    </div>
                                                </>
                                                :
                                                <div>
                                                    <h5 className="mb-2">{intl.formatMessage({ id: "theme.light_logo" })}</h5>
                                                    <button type="button" className="btn btn-sm btn-primary" onClick={e => setLightLogoModal(true)}><AiOutlineCrown /> <span className="whitespace-nowrap">{intl.formatMessage({ id: "theme.upload_logo" })}</span></button>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            }

                            {(school.theme_id == 1 || school.theme_id == 3) &&
                                <div className="col-span-12">
                                    <div className="border-active p-4 rounded-lg">
                                        <div className="flex gap-4 flex-wrap">
                                            {school.dark_theme_logo ?
                                                <>
                                                    <div className="border-active border-dashed p-1">
                                                        <div className="bg-black w-48 h-fit">
                                                            <img className="w-full h-auto" src={API_URL + '/school/get_logo/' + school.dark_theme_logo + '/dark_logo'} />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h5 className="mb-2">{intl.formatMessage({ id: "theme.dark_logo" })}</h5>
                                                        <div className="btn-wrap">
                                                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={e => setDarkLogoModal(true)}><AiOutlineCrown /> <span className="whitespace-nowrap">{intl.formatMessage({ id: "theme.change_logo" })}</span></button>
                                                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={e => deleteLogo('dark_logo')}><AiOutlineDelete /> <span className="whitespace-nowrap">{intl.formatMessage({ id: "theme.delete_logo" })}</span></button>
                                                        </div>
                                                    </div>
                                                </>
                                                :
                                                <div>
                                                    <h5 className="mb-2">{intl.formatMessage({ id: "theme.dark_logo" })}</h5>
                                                    <button type="button" className="btn btn-sm btn-primary" onClick={e => setDarkLogoModal(true)}><AiOutlineCrown /> <span className="whitespace-nowrap">{intl.formatMessage({ id: "theme.upload_logo" })}</span></button>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>

                        <div className="form-group-border active label-inactive mt-6">
                            <AiOutlineFormatPainter />
                            <select name="color_id" defaultValue={school.color_id} onChange={debounceHandler(e => setSchoolSettings(), 500)}>
                                <option disabled value="">{intl.formatMessage({ id: "theme.select_default_color_scheme" })}</option>
                                {
                                    school_attributes.colors?.map(color => (
                                        <option selected={school.color_id === color.color_id} key={color.color_id} value={color.color_id}>{color.color_name}</option>
                                    ))
                                }
                            </select>
                            <label className={(error.color_id && 'label-error')}>{error.color_id ? error.color_id : intl.formatMessage({ id: "theme.default_color_scheme" })}</label>
                        </div>

                        <div className="form-group-border active label-inactive mt-6">
                            <AiOutlineFontSize />
                            <select name="title_font_id" defaultValue={school.title_font_id} onChange={debounceHandler(e => setSchoolSettings(), 500)}>
                                <option disabled value="">{intl.formatMessage({ id: "theme.select_default_font" })}</option>
                                {
                                    school_attributes.fonts?.map(font => (
                                        <option selected={school.title_font_id === font.font_id} key={font.font_id} value={font.font_id}>{font.font_name}</option>
                                    ))
                                }
                            </select>
                            <label className={(error.title_font_id && 'label-error')}>{error.title_font_id ? error.title_font_id : intl.formatMessage({ id: "theme.default_font_for_headings" })}</label>
                        </div>

                        <div className="form-group-border active label-inactive mt-6">
                            <AiOutlineFontSize />
                            <select name="body_font_id" defaultValue={school.body_font_id} onChange={debounceHandler(e => setSchoolSettings(), 500)}>
                                <option disabled value="">{intl.formatMessage({ id: "theme.select_default_font" })}</option>
                                {
                                    school_attributes.fonts?.map(font => (
                                        <option selected={school.body_font_id === font.font_id} key={font.font_id} value={font.font_id}>{font.font_name}</option>
                                    ))
                                }
                            </select>
                            <label className={(error.body_font_id && 'label-error')}>{error.body_font_id ? error.body_font_id : intl.formatMessage({ id: "theme.default_font_for_paragraphs" })}</label>
                        </div>
                    </form>
                </div>

                <Modal show={light_logo_modal} onClose={cancelUpload} modal_title={intl.formatMessage({ id: "theme.light_logo_title" })} modal_size="modal-xl">
                    <UploadLogoModal closeModal={cancelUpload} id={'light_logo'} logo_file={light_logo_file} setLogoFile={setLightLogoFile} getSchoolAttributes={getSchoolAttributes} />
                </Modal>

                <Modal show={dark_logo_modal} onClose={cancelUpload} modal_title={intl.formatMessage({ id: "theme.dark_logo_title" })} modal_size="modal-xl">
                    <UploadLogoModal closeModal={cancelUpload} id={'dark_logo'} logo_file={dark_logo_file} setLogoFile={setDarkLogoFile} getSchoolAttributes={getSchoolAttributes} />
                </Modal>

                <Modal show={delete_logo_modal} onClose={() => setDeleteLogoModal(false)} modal_title={intl.formatMessage({ id: "theme.delete_logo_title" })} modal_size="modal-xl">
                    <DeleteLogoModal closeModal={() => setDeleteLogoModal(false)} variable={delete_logo_variable} getSchoolAttributes={getSchoolAttributes} />
                </Modal>
            </RoleProvider>
        </DashboardLayout>
    );
}