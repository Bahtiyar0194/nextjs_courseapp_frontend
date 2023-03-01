import { useIntl } from "react-intl";

const Loader = (props) => {
    const intl = useIntl();
    return (
        <div className={props.className}>
            <div className="overlay-loding-circle"></div>

            {props.progress >= 1 &&
                <div className="pt-2 text-center">
                    {intl.formatMessage({ id: "uploading_file" })}
                    <p className="font-medium">{props.progress}%</p>
                </div>
            }
        </div>
    );
};

export default Loader;