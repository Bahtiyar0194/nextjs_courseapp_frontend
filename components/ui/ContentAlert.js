const ContentAlert = ({ children, className }) => {
    return (
        <div className={'alert ' + className}>
            {children}
        </div>
    );
};

export default ContentAlert;