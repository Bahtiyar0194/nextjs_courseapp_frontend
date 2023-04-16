const LocaleItem = (props) => {
    return (
        <div className="flex items-center">
            <div className="border border-active">
            <img width={'18'} src={props.flag} />
            </div>
            {props.text && <span className="ml-1.5">{props.text}</span>}
        </div>
    )
}

export default LocaleItem;