import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from "@coreui/react";
import LocaleItem from "./LocaleItem";
import { useIntl } from "react-intl";

const Locales = () => {
    const intl = useIntl();
    const router = useRouter();

    const { locale, locales, defaultLocale } = router;

    const handleLocaleChange = (locale) => {
        const value = locale;
        Cookies.set('locale', value)
        router.push(router.route, router.asPath, {
            locale: value
        });
    };

    return (
        <CDropdown>
            <CDropdownToggle href="#" color="transparent no-px" title={intl.formatMessage({ id: "change_site_language" })}>
                {
                    locale === 'kk' ? <LocaleItem flag='/flags/kz.svg' /> :
                        locale === 'ru' ? <LocaleItem flag='/flags/ru.svg' /> :
                            locale === 'en' ? <LocaleItem flag='/flags/us.svg' /> : ''
                }
            </CDropdownToggle>
            <CDropdownMenu>
                {
                    locales?.map(localeItem => (
                        <button key={localeItem} onClick={() => handleLocaleChange(localeItem)}>
                            {
                                localeItem === 'kk' ? <LocaleItem flag='/flags/kz.svg' text='Қазақша' /> :
                                    localeItem === 'ru' ? <LocaleItem flag='/flags/ru.svg' text='Русский' /> :
                                        localeItem === 'en' ? <LocaleItem flag='/flags/us.svg' text='English' /> : ''
                            }
                        </button>
                    ))
                }
            </CDropdownMenu>
        </CDropdown>
    )
}

export default Locales;