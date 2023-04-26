import MainLayout from "../components/layouts/MainLayout";
import LocaleProvider from "../services/LocaleProvider";
import { useIntl } from "react-intl";
import Link from "next/link";
import FadeSlider from "../components/main-page/FadeSlider";
import HorizontalAccordeon from "../components/main-page/HorizontalAccordeon";
import SubscriptionPlans from "../components/main-page/SubscriptionPlans";
import ContactForm from "../components/main-page/ContactForm";

export default function Index() {
    const intl = useIntl();
    const title = intl.formatMessage({ id: "page.home.title" });

    return (
        <LocaleProvider>
            <MainLayout title={title}>
                <section className="pt-20 relative">
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
                    <div className="custom-container">
                        <div className="custom-grid">
                            <div className="col-span-12">
                                <div className="flex flex-col items-center">
                                    <h1 className="max-lg:text-2xl text-center">Создавайте свой онлайн-курс за 15 минут: быстро, просто, эффективно.</h1>
                                    <p className="text-center text-inactive text-xl max-lg:text-base mb-6">Web<span className="text-corp">Teach</span> - это инновационный инструмент, который поможет вам быстро и легко создавать и продавать свои курсы онлайн. Мы предлагаем удобный и простой в использовании конструктор курсов, который позволит вам создавать курсы любой сложности, с возможностью добавления видеоуроков, текстовых материалов, тестов и многое другое.</p>
                                    <Link href={'/registration'} className="btn btn-lg btn-primary mb-6">Начать использовать WebTeach</Link>
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-10 md:col-start-2">
                                <FadeSlider />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="bg-active border-t-active py-20">
                    <div className="custom-container">
                        <div className="custom-grid">
                            <div className="col-span-12">
                                <h2 className="max-lg:text-2xl text-center">Кому подходит платформа Web<span className="text-corp">Teach</span>?</h2>
                            </div>
                            <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                <div className="flex flex-col items-center text-center">
                                    <img className="w-1/2" src="/img/index/section-2/presentation.png" />
                                    <h4 className="mb-2">Учителям и преподавателям</h4>
                                    <p className="text-inactive">Которые хотят перевести свои учебные материалы в онлайн формат, чтобы сделать их более доступными для студентов и заработать дополнительный доход.</p>
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                <div className="flex flex-col items-center text-center">
                                    <img className="w-1/2" src="/img/index/section-2/target.png" />
                                    <h4 className="mb-2">Тренерам и коучам</h4>
                                    <p className="text-inactive">Которые могут использовать платформу для создания онлайн-курсов в своей области экспертизы и расширения своей аудитории за счет продажи курсов.</p>
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                <div className="flex flex-col items-center text-center">
                                    <img className="w-1/2" src="/img/index/section-2/strategy-development.png" />
                                    <h4 className="mb-2">Экспертам в различных областях</h4>
                                    <p className="text-inactive">Которые могут создавать онлайн-курсы, чтобы поделиться своими знаниями и опытом с другими людьми.</p>
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                <div className="flex flex-col items-center text-center">
                                    <img className="w-1/2" src="/img/index/section-2/training.png" />
                                    <h4 className="mb-2">Брендам и компаниям</h4>
                                    <p className="text-inactive">Которые могут создавать курсы для обучения своих сотрудников и расширения своих бизнес-возможностей.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="bg-inactive border-t-active py-20">
                    <div className="custom-container">
                        <div className="custom-grid">
                            <div className="col-span-12">
                                <h2 className="max-lg:text-2xl text-center text-active">Какие преимущества у WebTeach?</h2>
                                <p className="text-center text-inactive text-xl max-lg:text-base mb-10">WebTeach - это инструмент, который позволяет пользователям создавать собственные онлайн-курсы, используя готовые элементы и инструменты. Преимущества конструктора курсов включают в себя:</p>
                            </div>
                            <HorizontalAccordeon />
                        </div>
                    </div>
                </section>
                <section className="bg-active border-t-active py-20">
                    <div className="custom-container">
                        <div className="custom-grid">
                            <div className="col-span-12">
                                <h2 className="max-lg:text-2xl text-center text-active">Тарифы WebTeach</h2>
                                <p className="text-center text-inactive text-xl max-lg:text-base mb-10">Вы можете начать использовать WebTeach уже сейчас и оценить её преимущества в демоверсии, а также перейти на тариф для профессионального использования!</p>
                            </div>

                            <SubscriptionPlans />
                        </div>
                    </div>
                </section>
                <section className="bg-inactive border-t-active py-20">
                    <div className="custom-container">
                        <div className="custom-grid">
                            <div className="col-span-12 lg:col-span-12">
                                <h2 className="max-lg:text-2xl text-center text-active">Свяжитесь с нами</h2>
                                <p className="text-center text-inactive text-xl max-lg:text-base mb-4">Пишите нам или звоните, будем рады ответить на интересующие Вас вопросы</p>
                            </div>

                            <div className="col-span-12 lg:col-span-6 lg:col-start-4">
                                <ContactForm />
                            </div>
                        </div>
                    </div>
                </section>
            </MainLayout>
        </LocaleProvider>
    );
}