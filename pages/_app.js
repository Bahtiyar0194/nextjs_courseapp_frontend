import { Provider } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { IntlProvider } from "react-intl";
import { store } from '../store/store';
import axios from "axios";
import Cookies from 'js-cookie';
import SchoolProvider from '../services/SchoolProvider';

import API_URL from '../config/api';
import { ThemeProvider } from 'next-themes';
import kk from "../locales/kk.json";
import ru from "../locales/ru.json";
import en from "../locales/en.json";

const messages = {
    kk,
    ru,
    en
};

import '../assets/css/slider-animate.css';
import '../assets/css/animate.css';
import 'react-quill/dist/quill.snow.css';
import '../assets/css/global.css';

export default function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const { defaultLocale, locale } = router;
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

    useEffect(() => {
        if (router.isReady) {
            let full_domain = window.location.host; // subdomain.domain.com
            full_domain = full_domain.replace('www.', '');
            full_domain = full_domain.replace(':3000', '');
            let parts = full_domain.split('.');

            if ((parts.length == 1 && parts[0] == 'localhost') || (parts.length == 2 && parts[1] != 'localhost')) {
                let link = document.createElement('link');
                link.rel = 'manifest';
                link.href = '/manifest.json';
                document.getElementsByTagName('head')[0].appendChild(link);
            }
            else{
                if (router.asPath === '/') {
                    router.push('/login');
                }
            }
        }
    }, [router.isReady]);


    return (
        <IntlProvider locale={locale} messages={messages[locale]}>
            <Provider store={store}>
                <SchoolProvider>
                    <ThemeProvider attribute="class">
                        <Component {...pageProps} />
                    </ThemeProvider>
                </SchoolProvider>
            </Provider>
        </IntlProvider>
    )
}