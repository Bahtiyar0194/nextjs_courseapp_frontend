import { toPng } from 'html-to-image';
import { AiOutlineFileImage } from "react-icons/ai";
import { useIntl } from "react-intl";

const HtmlToImageButton = ({ elem_id, btn_title, file_name, btn_size_class }) => {
    const intl = useIntl();

    const exportToImage = () => {
        toPng(document.getElementById(elem_id))
        .then(function (dataUrl) {
            let link = document.createElement('a')
            link.download = file_name + '.png';
            link.href = dataUrl;
            link.click();
            link.remove();
        });
    }

    return (
        <button onClick={() => exportToImage()} className={"btn btn-outline-primary " + btn_size_class}><AiOutlineFileImage /> <span>{intl.formatMessage({ id: btn_title })}</span></button>
    );
};

export default HtmlToImageButton;