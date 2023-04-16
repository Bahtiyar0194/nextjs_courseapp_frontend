import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import { useIntl } from "react-intl";

const ThemeChanger = () => {

    const { theme, setTheme } = useTheme();
    const intl = useIntl();

    useEffect(() => {
        if (!window.localStorage.getItem('theme')) {
            setTheme('light')
        }
    }, []);

    return (
        <div className='theme-switcher'>
            <button title={intl.formatMessage({ id: "theme.switch_to_a_dark_theme" })} className='theme-light-button' onClick={() => setTheme('dark')}>
                <HiOutlineMoon />
            </button>

            <button title={intl.formatMessage({ id: "theme.switch_to_a_light_theme" })} className='theme-dark-button' onClick={() => setTheme('light')}>
                <HiOutlineSun />
            </button>
        </div>
    );
};

export default ThemeChanger;