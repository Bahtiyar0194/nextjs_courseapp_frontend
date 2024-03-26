const ProgressBar = (props) => {
    return (
        <div className={"progress " + (props.bg_class ? props.bg_class : "inactive")}>
            <div className={"progress-bar " + (props.className ? props.className : "")} style={{ 'width': props.percentage?.toFixed() + '%' }}>
                {props.show_percentage && (props.percentage + "%")}
            </div>
        </div>
    );
};

export default ProgressBar;