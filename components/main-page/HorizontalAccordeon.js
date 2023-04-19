import { useState } from "react";
import Tablet from "../misc/Tablet";

const HorizontalAccordeon = () => {
    const [active_item_index, setActiveItem] = useState(0);

    const accordeonItems = [
        {
            title: 'Простота использования',
            description: 'Наш конструктор курсов имеет простой и интуитивно понятный интерфейс, что позволяет пользователям легко создавать и редактировать свои курсы без необходимости в технических навыках.',
            image: 'users.png'
        },
        {
            title: 'Быстрое создание курсов',
            description: 'Благодаря использованию готовых элементов, таких как тесты, опросы, вопросы для самопроверки и другие, наша система позволяет пользователям быстро создавать курсы.',
            image: 'lessons.png'
        },
        {
            title: 'Гибкость и настраиваемость',
            description: 'Пользователи могут выбрать, какие элементы и функции использовать в своих курсах, а также настроить их под свои потребности.',
            image: 'lessons.png'
        },
        {
            title: 'Экономическая выгода',
            description: 'WebTeach более экономически выгодный, чем разработка курсов с нуля или наем веб-разработчиков.',
            image: 'lessons.png'
        },
        {
            title: 'Возможность масштабирования',
            description: 'Благодаря конструктору, Вы можете легко создавать дополнительные курсы и обновлять существующие, чтобы охватить больше студентов и увеличить свой доход.',
            image: 'courses.png'
        },
        {
            title: 'Удобство использования',
            description: 'Студенты могут легко получить доступ к курсам, созданным на WebTeach, и использовать интерактивные функции для более эффективного обучения.',
            image: 'lessons.png'
        },
        {
            title: 'Аналитика',
            description: 'WebTeach предлагает инструменты аналитики, которые помогают пользователю отслеживать успех своих курсов, анализировать данные и улучшать свои курсы на основе этих данных.',
            image: 'lessons.png'
        }
    ];

    return (
        <>
            <div className="col-span-12 lg:col-span-4">
                <div className="horizontal-accordeon">
                    {accordeonItems.map((item, index) => (
                        <div key={index} onClick={() => setActiveItem(index)} className={"horizontal-accordeon-item " + (active_item_index === index && 'active')}>
                            <h5 className="text-corp">{item.title}:</h5>
                            <p>{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="col-span-12 lg:col-span-8">
                <Tablet>
                    <div className="relative flex">
                        {accordeonItems.map((item, index) => (
                            <img key={index} className={'accordeon-img ' + (active_item_index === index && 'active')} src={"/img/index/horizontal-accordeon/" + item.image} />
                        ))}
                    </div>
                </Tablet>
            </div>
        </>
    )
}
export default HorizontalAccordeon;