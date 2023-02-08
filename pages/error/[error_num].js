import ErrorLayout from "../../components/layouts/ErrorLayout";
import { useRouter } from "next/router";
import Link from "next/link";
import { useIntl } from "react-intl";

export default function PageNumError() {
    const intl = useIntl();
    const router = useRouter();
    const { error_num } = router.query;

    return (
            <ErrorLayout title={intl.formatMessage({ id: "page.error." + error_num })}>
                <div className="text-center">
                    <h1 className="mb-0 text-6xl">{error_num}</h1>

                    <p className="text-active">
                        {
                            intl.formatMessage({ id: "page.error." + error_num })
                        }
                    </p>
                    {error_num != 400 && <Link href={'/'}>{intl.formatMessage({ id: "page.home.to" })}</Link>}
                </div>
            </ErrorLayout>
    );
}