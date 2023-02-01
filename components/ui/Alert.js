const Alert = (props) => {
    return (
        <div className={'alert ' + props.className}>{props.text}</div>
    );
};

export default Alert;