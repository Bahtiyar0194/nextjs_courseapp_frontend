const Alert = (props) => {
    return (
        <div className={'alert ' + props.className}>{props.children}</div>
    );
};

export default Alert;