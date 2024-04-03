import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { AiOutlineFilePdf } from "react-icons/ai";
import { useIntl } from "react-intl";

const ExportToPDFButton = ({ file_name, elem_id, btn_size_class }) => {
    const intl = useIntl();

    const exportToPDF = () => {
        const w = document.getElementById(elem_id).offsetWidth;
        const h = document.getElementById(elem_id).offsetHeight;

        html2canvas(document.getElementById(elem_id))
            .then((canvas) => {
                const img = canvas.toDataURL("image/png", 1);
                const pdf = new jsPDF('L', 'px', [w, h]);
                pdf.addImage(img, 'JPEG', 0, 0, w, h);
                pdf.save(file_name + '.pdf');
            });
    }

    return (
        <button onClick={() => exportToPDF()} className={"btn btn-outline-danger " + btn_size_class}><AiOutlineFilePdf /> <span>{intl.formatMessage({ id: "export_to_pdf" })}</span></button>
    );
};

export default ExportToPDFButton;