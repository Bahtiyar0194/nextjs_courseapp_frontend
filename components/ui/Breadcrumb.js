import Link from "next/link";
import { useIntl } from "react-intl";
const Breadcrumb = (props) => {
    const intl = useIntl();
    return (
        <div className="col-span-12 lg:col-span-9">
            <p className="my-2"><Link href={'/dashboard'}>{intl.formatMessage({ id: "page.dashboard.title" })}</Link> / {props.children}</p>
        </div>
    );
};

export default Breadcrumb;