import { useIntl } from "react-intl";

const FileSize = ({ file_size }) => {
    const intl = useIntl();
    return (
        <>
            {
                file_size >= 1.024
                    ?
                    file_size.toFixed(1)
                    :
                    file_size >= 1024
                        ?
                        (file_size / 1024).toFixed()
                        :
                        (file_size * 1024).toFixed(2)
            }
            <> </>
            {
                file_size >= 1.024
                    ?
                    intl.formatMessage({ id: "megabyte" })
                    :
                    file_size >= 1024
                        ?
                        intl.formatMessage({ id: "giabyte" })
                        :
                        intl.formatMessage({ id: "kilobyte" })
            }
        </>

    );
};

export default FileSize;