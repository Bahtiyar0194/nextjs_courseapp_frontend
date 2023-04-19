import Header from "./Header";
import Locales from "../ui/Locales";
import ThemeChanger from "../ui/ThemeChanger";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

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
            <div className="h-screen w-full flex items-center justify-center">
                <div className="custom-container">
                    <div className="custom-grid">
                        <div className="col-span-12 lg:col-span-6 lg:col-start-4">
                            <div className="card">
                                <div className="card-header">
                                    <div className="flex justify-between">
                                        <h3 className="mb-2">{props.title}</h3>
                                        <div className="btn-wrap items-center">
                                            <ThemeChanger />
                                            <Locales />
                                        </div>
                                    </div>

                                    {props.school_name && <h5 className="text-corp mb-0">{props.school_name}</h5>}
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