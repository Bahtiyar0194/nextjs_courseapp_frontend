import ErrorLayout from "../../components/layouts/ErrorLayout";
import { useRouter } from "next/router";
import Link from "next/link";
import { useIntl } from "react-intl";

export default function PageNumError() {
    const intl = useIntl();
    const router = useRouter();
    const { error_num } = router.query;
    return (
        <ErrorLayout title="Ошибка на стороне сервера">
            <div className="text-center">
                <h1 className="mb-0 text-6xl">{error_num}</h1>

                <p className="text-active">
                    {
                        error_num == 403 ? intl.formatMessage({ id: "page.error.403" }) :
                        error_num == 404 ? intl.formatMessage({ id: "page.error.404" }) :
                        error_num == 500 ? intl.formatMessage({ id: "page.error.500" }) :
                        error_num
                    }
                </p>
                <Link href={'/'}>На главную страницу</Link>
            </div>
        </ErrorLayout>
    );
}