import MainLayout from "../components/layouts/MainLayout";
import LocaleProvider from "../services/LocaleProvider";
import { useIntl } from "react-intl";

export default function Index() {
    const intl = useIntl();
    const title = intl.formatMessage({ id: "page.home.title" });

    return (
        <LocaleProvider>
            <MainLayout title={title}>
                <div className="custom-container">
                    <div className="card">
                    </div>
                </div>
            </MainLayout>
        </LocaleProvider>
    );
}