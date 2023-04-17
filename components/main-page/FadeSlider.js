import React from 'react';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

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
            <div className="px-4 lg:px-8">
                <div className="h-1 lg:h-2 w-1 lg:w-2 bg-inactive border-inactive rounded-full mx-auto absolute z-10 left-1/2 top-1.5 lg:top-2.5"></div>
                <div className="bg-active border-t-inactive border-l-inactive border-r-inactive border-b-0 w-full rounded-t-xl relative px-1.5 lg:px-3 pt-3 lg:pt-6">
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
                </div>
            </div>
            <div className="bg-active border-inactive w-full px-1 lg:px-2 pb-1 lg:pb-2 rounded-b-xl relative mx-auto">
                <div className="bg-inactive border-t-0 border-r-inactive border-b-inactive border-l-inactive w-1/4 h-2 lg:h-3 mx-auto rounded-b-xl"></div>
            </div>
        </div>
    )
}

export default FadeSlider;