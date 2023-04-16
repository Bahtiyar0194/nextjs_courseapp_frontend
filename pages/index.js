import MainLayout from "../components/layouts/MainLayout";
import LocaleProvider from "../services/LocaleProvider";
import { useIntl } from "react-intl";
import Link from "next/link";
import FadeSlider from "../components/main-page/FadeSlider";

export default function Index() {
    const intl = useIntl();
    const title = intl.formatMessage({ id: "page.home.title" });

    return (
        <LocaleProvider>
            <MainLayout title={title}>
                <div className="custom-container">
                    <div className="custom-grid pt-20">
                        <div className="col-span-12">
                            <div className="flex flex-col items-center">
                                <h1 className="text-center mb-10">Создавайте свой онлайн-курс за 15 минут: быстро, просто, эффективно.</h1>
                                <p className="text-center text-lg mb-6">WebTeach - это инновационный инструмент, который поможет вам быстро и легко создавать и продавать свои курсы онлайн. Мы предлагаем удобный и простой в использовании конструктор курсов, который позволит вам создавать курсы любой сложности, с возможностью добавления видеоуроков, текстовых материалов, тестов и многое другое.</p>
                                <Link href={'/registration'} className="btn btn-lg btn-outline-primary mb-6">Начать использовать WebTeach</Link>
                            </div>
                        </div>
                        <div className="col-span-12 lg:col-span-10 lg:col-start-2">
                            <FadeSlider/>
                        </div>
                    </div>
                </div>
            </MainLayout>
        </LocaleProvider>
    );
}