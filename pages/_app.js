import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'next-themes';
import { useRouter } from 'next/router';
import { IntlProvider } from "react-intl";
import { store } from '../store/store';
import axios from "axios";
import Cookies from 'js-cookie';

import kk from "../locales/kk.json";
import ru from "../locales/ru.json";
import en from "../locales/en.json";

const messages = {
    kk,
    ru,
    en
};

import '../assets/css/global.css';

export default function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const { defaultLocale, locale } = router;
    const API_URL = process.env.NODE_ENV === 'development' ? process.env.DEV_API : process.env.PROD_API;
    const MAIN_DOMAIN = process.env.MAIN_DOMAIN;
    axios.defaults.baseURL = API_URL;
    axios.defaults.headers.common['Accept'] = 'application/json';
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

    async function checkSchool() {
        await axios.get('school/check')
            .then(response => {
                console.log(response);
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
        if (typeof window !== undefined) {
            const host = window.location.host;
            const hostArr = host.split('.').slice(0, host.includes(MAIN_DOMAIN) ? -1 : -2);
            if (hostArr.length > 0) {
                Cookies.set('subdomain', hostArr[0]);
            }
            else {
                Cookies.remove('subdomain');
            }
            const subdomain = Cookies.get('subdomain');
            if (subdomain) {
                axios.defaults.headers.common['Subdomain'] = subdomain;
                checkSchool();
            }
        }
    }, [])


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