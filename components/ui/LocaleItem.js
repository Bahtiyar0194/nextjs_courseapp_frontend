const LocaleItem = (props) => {
    return (
        <div className="flex items-center">
            <img className="mr-1" width={'16'} src={props.flag} /> {props.text}
        </div>
    )
}

export default LocaleItem;