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
                <section>
                    <div className="custom-container relative">
                        <div className="slider-area" >
                            <ul className="slider-circles">
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                        </div >
                        <div className="custom-grid pt-20">
                            <div className="col-span-12">
                                <div className="flex flex-col items-center">
                                    <h1 className="text-center mb-10">Создавайте свой онлайн-курс за 15 минут: быстро, просто, эффективно.</h1>
                                    <p className="text-center text-lg mb-6">WebTeach - это инновационный инструмент, который поможет вам быстро и легко создавать и продавать свои курсы онлайн. Мы предлагаем удобный и простой в использовании конструктор курсов, который позволит вам создавать курсы любой сложности, с возможностью добавления видеоуроков, текстовых материалов, тестов и многое другое.</p>
                                    <Link href={'/registration'} className="btn btn-lg btn-primary mb-6">Начать использовать WebTeach</Link>
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-10 md:col-start-2">
                                <FadeSlider />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="bg-active border-t-active border-b-active">
                    <div className="custom-container">
                        <div className="custom-grid py-20">
                            <div className="col-span-12 mb-10">
                                <h2 className="text-center">Кому подходит платформа Web<span className="text-corp">Teach</span>?</h2>
                            </div>
                            <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                <div className="flex flex-col items-center text-center">
                                    <img className="w-1/2" src="/img/index/section-2/presentation.png"/>
                                    <h4 className="mb-2">Учителям и преподавателям</h4>
                                    <p>Которые хотят перевести свои учебные материалы в онлайн формат, чтобы сделать их более доступными для студентов и заработать дополнительный доход.</p>
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                <div className="flex flex-col items-center text-center">
                                    <img className="w-1/2" src="/img/index/section-2/target.png"/>
                                    <h4 className="mb-2">Тренерам и коучам</h4>
                                    <p>Которые могут использовать платформу для создания онлайн-курсов в своей области экспертизы и расширения своей аудитории за счет продажи курсов.</p>
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                <div className="flex flex-col items-center text-center">
                                    <img className="w-1/2" src="/img/index/section-2/strategy-development.png"/>
                                    <h4 className="mb-2">Экспертам в различных областях</h4>
                                    <p>Которые могут создавать онлайн-курсы, чтобы поделиться своими знаниями и опытом с другими людьми.</p>
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                <div className="flex flex-col items-center text-center">
                                    <img className="w-1/2" src="/img/index/section-2/training.png"/>
                                    <h4 className="mb-2">Брендам и компаниям</h4>
                                    <p>Которые могут создавать курсы для обучения своих сотрудников и расширения своих бизнес-возможностей.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </MainLayout>
        </LocaleProvider>
    );
}