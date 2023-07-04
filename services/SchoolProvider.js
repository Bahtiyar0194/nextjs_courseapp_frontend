import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setSchoolData } from "../store/slices/schoolSlice";
import API_URL from "../config/api";

export default function SchoolProvider(props) {
    const router = useRouter();
    const dispatch = useDispatch();

    const setDefaultIcons = () => {
        let defaultIcons = [
            {
                "size": 36,
                "rel": "android-touch-icon",
                "icon_name": "android-icon"
            },
            {
                "size": 48,
                "rel": "android-touch-icon",
                "icon_name": "android-icon"
            },
            {
                "size": 72,
                "rel": "android-touch-icon",
                "icon_name": "android-icon"
            },
            {
                "size": 96,
                "rel": "android-touch-icon",
                "icon_name": "android-icon"
            },
            {
                "size": 144,
                "rel": "android-touch-icon",
                "icon_name": "android-icon"
            },
            {
                "size": 192,
                "rel": "android-touch-icon",
                "icon_name": "android-icon"
            },
            {
                "size": 57,
                "rel": "apple-touch-icon",
                "icon_name": "apple-icon"
            },
            {
                "size": 60,
                "rel": "apple-touch-icon",
                "icon_name": "apple-icon"
            },
            {
                "size": 72,
                "rel": "apple-touch-icon",
                "icon_name": "apple-icon"
            },
            {
                "size": 114,
                "rel": "apple-touch-icon",
                "icon_name": "apple-icon"
            },
            {
                "size": 120,
                "rel": "apple-touch-icon",
                "icon_name": "apple-icon"
            },
            {
                "size": 144,
                "rel": "apple-touch-icon",
                "icon_name": "apple-icon"
            },
            {
                "size": 152,
                "rel": "apple-touch-icon",
                "icon_name": "apple-icon"
            },
            {
                "size": 180,
                "rel": "apple-touch-icon",
                "icon_name": "apple-icon"
            },
            {
                "size": 16,
                "rel": "icon",
                "icon_name": "favicon"
            },
            {
                "size": 32,
                "rel": "icon",
                "icon_name": "favicon"
            },
            {
                "size": 96,
                "rel": "icon",
                "icon_name": "favicon"
            }
        ];

        for (let index = 0; index < defaultIcons.length; index++) {
            let link = document.createElement('link');
            link.rel = defaultIcons[index].rel;
            link.sizes = defaultIcons[index].size + 'x' + defaultIcons[index].size;
            link.type = "image/png";
            link.href = '/' + defaultIcons[index].icon_name + '-' + (defaultIcons[index].size + 'x' + defaultIcons[index].size) + '.png';
            document.getElementsByTagName('head')[0].appendChild(link);
        }
    }

    const getSchool = async () => {
        await axios.get('school/get')
            .then(response => {
                if (response.data.school_id) {
                    let school = response.data;
                    dispatch(setSchoolData(school));
                    document.querySelector('body').classList.add(school.title_font_class.toString());
                    document.querySelector('body').classList.add(school.body_font_class.toString());
                    document.querySelector('body').classList.add(school.color_scheme_class.toString());

                    let dynamicManifest = {
                        "name": school.school_name,
                        "short_name": school.school_name,
                        "description": school.school_name,
                        "start_url": window.location.protocol + '//' + window.location.host,
                        "scope": window.location.protocol + '//' + window.location.host,
                        "display": "standalone",
                        "orientation": "portrait",
                        "background_color": "#ffffff",
                        "theme_color": "#ffffff",
                        "icons": school.manifest_icons
                    }

                    let link = document.createElement('link');
                    link.rel = 'manifest';
                    let stringManifest = JSON.stringify(dynamicManifest);
                    const blob = new Blob([stringManifest], {type: 'application/json'});
                    link.href = URL.createObjectURL(blob);
                    document.getElementsByTagName('head')[0].appendChild(link);

                    if (school.favicons && school.favicons?.length > 0) {
                        let favicons = school.favicons;
                        for (let index = 0; index < favicons.length; index++) {
                            let link = document.createElement('link');
                            link.rel = favicons[index].rel;
                            link.sizes = favicons[index].size + 'x' + favicons[index].size;
                            link.type = "image/png";
                            if(school.favicon){
                                link.href = API_URL + '/school/get_favicon/' + school.school_id + '/' + favicons[index].icon_name + '-' + (favicons[index].size + 'x' + favicons[index].size) + '.png';
                            }
                            else{
                                link.href = '/' + favicons[index].icon_name + '-' + (favicons[index].size + 'x' + favicons[index].size) + '.png';
                            }

                            document.getElementsByTagName('head')[0].appendChild(link);
                        }
                    }
                    else {
                        setDefaultIcons();
                    }
                }
                else {
                    dispatch(setSchoolData('main'));
                    setDefaultIcons();
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