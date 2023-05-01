import { useRouter } from "next/router";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { authenticate } from "../store/slices/userSlice";
import { setDiskData } from "../store/slices/diskSlice";
import axios from "axios";

export default function AuthProvider(props) {
    const router = useRouter();
    const dispatch = useDispatch();
    useEffect(() => {
        if (typeof window !== undefined) {
            const token = Cookies.get('token');
            if (!token) {
                router.push("/login");
            }
            else {
                const getDiskData = async () => {
                    await axios.get('media/get_disk_space')
                        .then(response => {
                            dispatch(setDiskData(response.data));
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

                const getMe = async () => {
                    await axios.get('auth/me')
                        .then(response => {
                            dispatch(authenticate(response.data.user));
                            getDiskData();
                        }).catch(err => {
                            if (err.response) {
                                if(err.response.status == 401){
                                    dispatch(authenticate([]));
                                    Cookies.remove('token');
                                    router.push('/login');
                                }
                            }
                            else {
                                router.push('/error');
                            }
                        });
                }
                getMe();
            }
        }
    }, []);
    return (props.children)
}