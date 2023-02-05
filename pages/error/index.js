import ErrorLayout from "../../components/layouts/ErrorLayout";
import Link from "next/link";
import { useIntl } from "react-intl";

export default function PageNumError() {
    const intl = useIntl();
    return (
        <ErrorLayout title={intl.formatMessage({ id: "page.error.server_lost" })}>
            <div className="text-center">
                <h4 className="mb-2 text-3xl">{intl.formatMessage({ id: "page.error.server_lost" })}</h4>
                <Link href={'/'}>{intl.formatMessage({ id: "page.home.to" })}</Link>
            </div>
        </ErrorLayout>
    );
}