import { useRouter } from "next/router";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { authenticate } from "../store/slices/userSlice";
import axios from "axios";

export default function AuthProvider(props) {
    const router = useRouter();
    const dispatch = useDispatch();
    useEffect(() => {
        if (typeof window !== undefined) {
            const token = Cookies.get('token');
            if (!token) {
                router.push("/");
            }
            else {
                async function getMe() {
                    await axios.get('auth/me')
                        .then(response => {
                            dispatch(authenticate(response.data))
                        }).catch(error => {
                            return [];
                        });
                }
                getMe();
            }
        }
    }, []);
    return (props.children)
}