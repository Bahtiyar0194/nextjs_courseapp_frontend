import * as XLSX from 'xlsx';
import { AiOutlineFileExcel } from "react-icons/ai";
import { useIntl } from "react-intl";

const TableToXLSXButton = ({ table_id, file_name, btn_size_class }) => {
    const intl = useIntl();

    const exportToXLSX = () => {
        const table = document.getElementById(table_id);
        const tableData = [];

        // Extract table data
        table.querySelectorAll('tr').forEach(row => {
            const rowData = [];
            row.querySelectorAll('th, td').forEach(cell => {
                rowData.push(cell.textContent);
            });
            tableData.push(rowData);
        });

        // Create worksheet
        const worksheet = XLSX.utils.aoa_to_sheet(tableData);

        // Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Export the workbook to Excel file
        XLSX.writeFile(workbook, file_name + '.xlsx');
    }

    return (
        <button onClick={() => exportToXLSX()} className={"btn btn-outline-success " + btn_size_class}><AiOutlineFileExcel /> <span>{intl.formatMessage({ id: "export_to_xlsx" })}</span></button>
    );
};

export default TableToXLSXButton;