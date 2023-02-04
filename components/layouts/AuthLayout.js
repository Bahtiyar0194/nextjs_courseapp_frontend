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
                    <div className="grid grid-cols-7 w-full">
                        <div className="col-span-7 md:col-start-2 md:col-span-5 lg:col-start-3 lg:col-span-3">
                            <div className="card">
                                <div className="card-header">
                                    <div className="flex justify-between">
                                        <h2 className="mb-2">{props.title}</h2>
                                        <div className="flex items-center">
                                            <ThemeChanger />
                                            <Locales />
                                        </div>
                                    </div>
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