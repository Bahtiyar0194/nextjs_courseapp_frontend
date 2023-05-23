import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setSchoolData } from "../store/slices/schoolSlice";

export default function SchoolProvider(props) {
    const router = useRouter();
    const dispatch = useDispatch();

    const getSchool = async () => {
        await axios.get('school/get')
            .then(response => {
                if (response.data.school_id) {
                    dispatch(setSchoolData(response.data));
                    document.querySelector('body').classList.add(response.data.title_font_class.toString());
                    document.querySelector('body').classList.add(response.data.body_font_class.toString());
                    document.querySelector('body').classList.add(response.data.color_scheme_class.toString());
                    
                    if (router.asPath === '/') {
                        router.push('/login');
                    }
                }
                else{
                    dispatch(setSchoolData('main'));
                }
            }).catch(err => {
                if (err.response) {
                    router.push({
                        pathname: '/error',
                        query: {
                            status: err.response.status,
                            message: err.response.data.message,
                            url: err.request.responseURL,
                        }
                    });
                }
                else {
                    router.push('/error');
                }
            });
    }

    useEffect(() => {
        if (router.isReady) {
            getSchool();
        }
    }, [router.isReady]);

    return (props.children)
}