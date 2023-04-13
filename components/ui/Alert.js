const Alert = ({className, text}) => {
    return (
        <div className={'alert ' + className}>{text}</div>
    );
};

export default Alert;