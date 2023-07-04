import ErrorLayout from "../components/layouts/ErrorLayout";
import Link from "next/link";
import { useIntl } from "react-intl";

export default function PageUnderConstruction() {
    const intl = useIntl();
    return (
        <ErrorLayout title={intl.formatMessage({ id: "page.under_construction.title" })}>
            <div className="text-center">
                <img className="w-32 mx-auto mb-4" src="/img/under-construction/brick.svg"/>
                <h3 className="text-active mb-0">{intl.formatMessage({ id: "page.under_construction.title" })}</h3>
                <p className="text-active">
                    {intl.formatMessage({ id: "page.under_construction.description" })}
                </p>
                <Link className="btn btn-outline-primary btn-sm mx-auto" href={'/dashboard'}>{intl.formatMessage({ id: "page.home.to" })}</Link>
            </div>
        </ErrorLayout>
    );
}