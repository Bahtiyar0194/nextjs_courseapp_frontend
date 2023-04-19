const IphoneScreen = (props) => {
    return (
        <div className="bg-active p-0.5 md:p-1.5 lg:p-2 border-inactive rounded-xl md:rounded-3xl shadow-2xl relative">
            <div className="w-2/4 border-b-inactive border-l-inactive border-r-inactive rounded-t-none md:rounded-t-none rounded-md md:rounded-xl absolute bg-active left-1/4 z-10 p-0.5 md:p-1">
                <div className="bg-inactive border-inactive w-1/2 h-1 md:h-2 rounded-md mx-auto"></div>
                <div className="bg-inactive border-inactive w-1 md:w-2 h-1 md:h-2 rounded-md mx-auto absolute left-2/4 md:left-2/3 -mt-1 md:-mt-2 ml-2.5 md:ml-3"></div>
            </div>
            <div className="border-inactive rounded-lg md:rounded-2xl overflow-hidden relative pt-2 md:pt-4">
                {props.children}
            </div>
        </div>
    );
};

export default IphoneScreen;