import { useSelector } from "react-redux";
import API_URL from "../../config/api";
const DefaultLogo = ({show_logo_alt}) => {
    const school = useSelector((state) => state.school.school_data);
    return (
        school &&
        <div className="logo">
            {
                school == 'main'
                    ?
                    <img className="logo-light" src="/img/logo/logo_light.svg" />
                    :
                    school.light_theme_logo
                        ?
                        <img className="logo-light" src={API_URL + '/school/get_logo/' + school.light_theme_logo + '/light_logo'} />
                        :
                        show_logo_alt == true
                            ?
                            <span className="logo-light font-medium text-corp">
                                {school.school_name}
                            </span>
                            :
                            null
            }
            {
                school == 'main'
                    ?
                    <img className="logo-dark" src="/img/logo/logo_dark.svg" />
                    :
                    school.dark_theme_logo
                        ?
                        <img className="logo-dark" src={API_URL + '/school/get_logo/' + school.dark_theme_logo + '/dark_logo'} />
                        :
                        show_logo_alt === true
                            ?
                            <span className="logo-dark font-medium text-corp">
                                {school.school_name}
                            </span>
                            :
                            null
            }
        </div>
    );
};

export default DefaultLogo;