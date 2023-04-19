const MacBookScreen = (props) => {
    return (
        <>
            <div className="px-4 lg:px-8">
                <div className="h-1 lg:h-2 w-1 lg:w-2 bg-inactive border-inactive rounded-full mx-auto absolute z-10 left-1/2 top-1.5 lg:top-2.5"></div>
                <div className="bg-active shadow-2xl border-t-inactive border-l-inactive border-r-inactive border-b-0 w-full rounded-t-xl relative px-1.5 lg:px-3 pt-3 lg:pt-6">
                    {props.children}
                </div>
            </div>
            <div className="bg-active border-inactive w-full px-1 lg:px-2 pb-1 lg:pb-2 rounded-b-md md:rounded-b-xl relative mx-auto">
                <div className="bg-inactive border-t-0 border-r-inactive border-b-inactive border-l-inactive w-1/4 h-1.5 md:h-2 lg:h-3 mx-auto rounded-b-md md:rounded-b-xl"></div>
            </div>
        </>
    );
};

export default MacBookScreen;