import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";

const ThemeChanger = () => {

    const { theme, setTheme } = useTheme();

    useEffect(() => {
        if(!window.localStorage.getItem('theme')){
            setTheme('light')
        }
    },[]);
    
    return (
        theme === 'dark' ?
            <button className='text-corp text-xl' onClick={() => setTheme('light')}>
                <HiOutlineMoon />
            </button>
            :
            <button className='text-corp text-xl' onClick={() => setTheme('dark')}>
                <HiOutlineSun />
            </button>
    );
};

export default ThemeChanger;