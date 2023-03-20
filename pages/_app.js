import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'next-themes';
import { useRouter } from 'next/router';
import { IntlProvider } from "react-intl";
import { store } from '../store/store';
import axios from "axios";
import Cookies from 'js-cookie';

import API_URL from '../config/api';

import kk from "../locales/kk.json";
import ru from "../locales/ru.json";
import en from "../locales/en.json";

const messages = {
    kk,
    ru,
    en
};

import 'react-quill/dist/quill.snow.css';
import '../assets/css/global.css';

export default function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const { defaultLocale, locale } = router;
    axios.defaults.baseURL = API_URL;
    axios.defaults.headers.common['Accept'] = 'application/json';

    const getSchool = async () => {
        await axios.get('school/get')
            .then(response => {

            }).catch(err => {
                if (err.response) {
                    router.push({
                        pathname: '/error'
                    });
                }
                else {
                    router.push('/error');
                }
            });
    }

    useEffect(() => {
        getSchool();
    }, []);

    const token = Cookies.get('token');
    if (token) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    }

    const localeFromCookie = Cookies.get('locale');

    if (localeFromCookie) {
        axios.defaults.headers.common['Accept-Language'] = localeFromCookie;
    }
    else {
        axios.defaults.headers.common['Accept-Language'] = defaultLocale;
    }

    return (
        <IntlProvider locale={locale} messages={messages[locale]}>
            <Provider store={store}>
                <ThemeProvider attribute="class">
                    <Component {...pageProps} />
                </ThemeProvider>
            </Provider>
        </IntlProvider>
    )
}