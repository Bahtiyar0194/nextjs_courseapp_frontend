import React from 'react';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import IphoneScreen from '../misc/IphoneScreen';
import MacBookScreen from '../misc/MacBookScreen';

const fadeImages = [
    'my-courses.png',
    'users.png',
    'materials.png',
    'add-video.png',
    'code.png'
];

const fadeProperties = {
    duration: 5000,
    transitionDuration: 500,
    infinite: true,
    indicators: true,
    arrows: false,
    pauseOnHover: false
}

const FadeSlider = () => {
    return (
        <div className="main-fade-slider">
            <MacBookScreen>
                <div className='main-fade-slider-light'>
                    <Fade {...fadeProperties}>
                        {fadeImages.map((image, index) => (
                            <div key={index} className="each-fade">
                                <div className="image-container">
                                    <img className='border-inactive' src={'/img/index/main-slider/light/' + fadeImages[index]} />
                                </div>
                            </div>
                        ))}
                    </Fade>
                </div>
                <div className='main-fade-slider-dark'>
                    <Fade {...fadeProperties}>
                        {fadeImages.map((image, index) => (
                            <div key={index} className="each-fade">
                                <div className="image-container">
                                    <img className='border-inactive' src={'/img/index/main-slider/dark/' + fadeImages[index]} />
                                </div>
                            </div>
                        ))}
                    </Fade>
                </div>
            </MacBookScreen>

            <div className='custom-grid absolute bottom-0 z-20'>
                <div className='col-span-5 col-start-11 md:col-span-6 md:col-start-11 lg:col-span-7 lg:col-start-11'>
                    <IphoneScreen>
                        <img src='/img/index/users-mobile.png'/>
                    </IphoneScreen>
                </div>
            </div>
        </div>
    )
}

export default FadeSlider;