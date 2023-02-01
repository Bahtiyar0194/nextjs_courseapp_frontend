import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CDropdownDivider } from "@coreui/react";
import LocaleItem from "./LocaleItem";
const Locales = () => {
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
            <CDropdownToggle href="#" color="no-color">
                {
                    locale === 'kk' ? <LocaleItem flag='/flags/kz.svg'/> :
                        locale === 'ru' ? <LocaleItem flag='/flags/ru.svg'/> :
                            locale === 'en' ? <LocaleItem flag='/flags/us.svg'/> : ''
                }
            </CDropdownToggle>
            <CDropdownMenu>
                {
                    locales?.map(localeItem => (
                        <CDropdownItem key={localeItem} onClick={() => handleLocaleChange(localeItem)} href={'#'}>
                            {
                                localeItem === 'kk' ? <LocaleItem flag='/flags/kz.svg' text='Қазақша'/> :
                                    localeItem === 'ru' ? <LocaleItem flag='/flags/ru.svg' text='Русский'/> :
                                        localeItem === 'en' ? <LocaleItem flag='/flags/us.svg' text='English'/> : ''
                            }
                        </CDropdownItem>
                    ))
                }
            </CDropdownMenu>
        </CDropdown>
    )
}

export default Locales;