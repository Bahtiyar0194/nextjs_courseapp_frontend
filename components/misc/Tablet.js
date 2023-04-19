const Tablet = (props) => {
    return (
        <div className="bg-active px-6 py-1.5 md:px-10 md:py-3 lg:px-12 lg:py-4 border-inactive rounded-2xl shadow-xl relative">
            <div className="h-1.5 lg:h-2 w-1.5 lg:w-2 bg-inactive border-inactive rounded-full absolute left-3 md:left-4 lg:left-6 top-1/2 -mt-0.5 lg:-mt-1"></div>
            <div className="border-inactive">
                {props.children}
            </div>
            <div className="h-4 md:h-6 lg:h-8 w-4 md:w-6 lg:w-8 bg-inactive border-inactive rounded-full absolute right-1 md:right-2 top-1/2 -mt-2 lg:-mt-4"></div>
        </div>
    );
};

export default Tablet;