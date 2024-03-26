import Link from "next/link";
import { useIntl } from "react-intl";
const Breadcrumb = (props) => {
    const intl = useIntl();
    return (
        <div className="col-span-12">
            <p className="breadcrumb">
                {props.children
                    ?
                    <>
                        <Link href={'/dashboard'}>{intl.formatMessage({ id: "page.dashboard.title" })}</Link>
                        {props.children}
                    </>
                    :
                    intl.formatMessage({ id: "page.dashboard.title" })
                }
            </p>
        </div>
    );
};

export default Breadcrumb;