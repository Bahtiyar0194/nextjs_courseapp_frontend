import { useRouter } from "next/router";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function LocaleProvider(props) {
    const router = useRouter();
    const { defaultLocale, locales } = router;
    useEffect(() => {
        if (typeof window !== undefined) {
            const locale = Cookies.get('locale');
            if (locale && locales.includes(locale)) {
                router.push(router.route, router.asPath, {
                    locale: locale
                });
            }
            else{
                router.push(router.route, router.asPath, {
                    locale: defaultLocale
                });
            }
        }
    }, []);
    return (props.children)
}