import { useIntl } from "react-intl";
const FileUploadButton = ({ item, trigger, id, accept, error, icon, label }) => {
    const intl = useIntl();
    return (
        <div className="form-group-file">
            <input id={id} onChange={e => trigger(e.target.files[0])} type="file" accept={accept} placeholder=" " />
            <label htmlFor={id} className={(error && 'label-error')}>
                {icon}
                <p className="mb-1">{error ? error : label}</p>
                {item
                    ?
                    <div>
                        {item.name && <p className="text-xs mb-0">{intl.formatMessage({ id: "file_name" })}: <b>{item.name}</b></p>}
                        {item.size && <p className="text-xs mb-0">{intl.formatMessage({ id: "file_size" })}: <b>{(item.size / 1048576).toFixed(2)} {intl.formatMessage({ id: "megabyte" })}</b></p>}
                    </div>
                    :
                    <p className="text-xs mb-0">{intl.formatMessage({ id: "choose_file" })}</p>
                }
            </label>
        </div>
    );
};

export default FileUploadButton;