import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import { useIntl } from "react-intl";
import { useSelector } from 'react-redux';

const ThemeChanger = () => {

    const { theme, setTheme } = useTheme();
    const intl = useIntl();
    const school = useSelector((state) => state.school.school_data);

    useEffect(() => {
            if(!school.theme_id){
                let currentTheme = window.localStorage.getItem('theme');
                if(!currentTheme){
                    setTheme('light');
                }
                else{
                    setTheme(currentTheme);
                }
            }
            else if(school.theme_id == 2){
                setTheme('light');
            }
            else if(school.theme_id == 3){
                setTheme('dark');
            }
    }, [school]);

    if (!school.theme_id || school.theme_id == 1) {
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
    }
};

export default ThemeChanger;