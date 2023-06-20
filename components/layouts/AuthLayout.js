import Header from "./Header";
import Locales from "../ui/Locales";
import ThemeChanger from "../ui/ThemeChanger";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Loader from "../ui/Loader";
import DefaultLogo from "../ui/Logo";

export default function AuthLayout(props) {
    const router = useRouter();
    useEffect(() => {
        if (typeof window !== undefined) {
            const token = Cookies.get('token');
            if (token) {
                router.push("/dashboard");
            }
        }
    }, []);
    return (
        <>
            <Header title={props.title} />
            <div className="h-screen w-full flex items-center justify-center relative">
                {props.showLoader && <Loader className="full-overlay" />}
                <div className="custom-container">
                    <div className="custom-grid">
                        <div className="col-span-12 lg:col-span-6 lg:col-start-4">
                            <div className="flex justify-center">
                                <DefaultLogo show_logo_alt={false} />
                            </div>
                            <div className="card mt-8">
                                <div className="card-header">
                                    <div className="title-wrap">
                                        <h3>{props.title}</h3>
                                        <div className="btn-wrap items-center">
                                            <ThemeChanger />
                                            <Locales />
                                        </div>
                                    </div>

                                    {props.school_name && <p className="text-corp mb-0">{props.school_name}</p>}
                                </div>
                                <div className="card-body">
                                    {props.children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}