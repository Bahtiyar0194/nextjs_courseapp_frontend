import ErrorLayout from "../components/layouts/ErrorLayout";
import Link from "next/link";
import { useIntl } from "react-intl";

export default function Page404() {
    const intl = useIntl();
    return (
        <ErrorLayout title={intl.formatMessage({ id: "page.error.404" })}>
            <div className="text-center">
                <h1 className="mb-0 text-6xl">404</h1>
                <p className="text-active">
                    {intl.formatMessage({ id: "page.error.404" })}
                </p>
                <Link className="btn btn-primary btn-sm" href={'/'}>{intl.formatMessage({ id: "page.home.to" })}</Link>
            </div>
        </ErrorLayout>
    );
}