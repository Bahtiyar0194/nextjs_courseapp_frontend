import { AiOutlineCheck, AiOutlineInsertRowAbove, AiOutlineInsertRowLeft } from "react-icons/ai";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from 'react-redux';
import { setLessonBlocks, setLessonBlocksCount } from "../../../store/slices/lessonBlocksSlice";
import { setTaskBlocks, setTaskBlocksCount } from '../../../store/slices/taskBlocksSlice';

const TableModal = ({ create_lesson, create_task, closeModal }) => {
    const intl = useIntl();
    const dispatch = useDispatch();

    let lesson_blocks = useSelector((state) => state.lessonBlocks.lesson_blocks);
    const lesson_blocks_count = useSelector((state) => state.lessonBlocks.lesson_blocks_count);

    let task_blocks = useSelector((state) => state.taskBlocks.task_blocks);
    const task_blocks_count = useSelector((state) => state.taskBlocks.task_blocks_count);

    const [columns_count, setColumnsCount] = useState('');
    const [rows_count, setRowsCount] = useState('');
    const [table_header, setTableHeader] = useState(false);

    const [column_error, setColumnError] = useState('');
    const [row_error, setRowError] = useState('');

    const createTableSubmit = async (e) => {
        e.preventDefault();

        if (columns_count > 0 && rows_count > 0) {
            let tableWrap = document.createElement('div');
            tableWrap.setAttribute('className', 'table bordered');

            let table = document.createElement('table');
            let tbody = document.createElement('tbody');

            for (let cell = 1; cell <= rows_count; cell++) {
                let newTr = document.createElement('tr');

                for (let column = 1; column <= columns_count; column++) {
                    let newTd = document.createElement('td');
                    if (cell == 1) {
                        if (table_header === true) {
                            let newTh = document.createElement('th');
                            newTh.setAttribute('contenteditable', true);
                            newTr.insertAdjacentElement('beforeEnd', newTh);
                        }
                        else {
                            newTd.setAttribute('contenteditable', true);
                            newTr.insertAdjacentElement('beforeEnd', newTd);
                        }
                    }
                    else {
                        newTd.setAttribute('contenteditable', true);
                        newTr.insertAdjacentElement('beforeEnd', newTd);
                    }
                }

                if (cell == 1 && table_header === true) {
                    let thead = document.createElement('thead');
                    thead.insertAdjacentElement('beforeEnd', newTr);
                    table.insertAdjacentElement('beforeEnd', thead);
                }
                else {
                    tbody.insertAdjacentElement('beforeEnd', newTr);
                }
            }

            table.insertAdjacentElement('beforeEnd', tbody);
            tableWrap.insertAdjacentElement('afterbegin', table);

            if (create_lesson === true) {
                dispatch(setLessonBlocksCount(lesson_blocks_count + 1));
                lesson_blocks = [...lesson_blocks, {
                    'block_id': lesson_blocks_count + 1,
                    'block_type_id': 5,
                    'content': tableWrap.outerHTML,
                }];
                dispatch(setLessonBlocks(lesson_blocks));
            }

            if (create_task === true) {
                dispatch(setTaskBlocksCount(task_blocks_count + 1));
                task_blocks = [...task_blocks, {
                    'block_id': task_blocks_count + 1,
                    'block_type_id': 5,
                    'content': tableWrap.outerHTML,
                }];
                dispatch(setTaskBlocks(task_blocks));
            }

            closeModal();
        }
        else {
            if (columns_count <= 0) {
                setColumnError(intl.formatMessage({ id: "tableModal.enter_the_number_of_columns" }));
            }

            if (rows_count <= 0) {
                setRowError(intl.formatMessage({ id: "tableModal.enter_the_number_of_rows" }));
            }
        }
    }

    return (
        <>
            <div className="modal-body">
                <form onSubmit={e => createTableSubmit(e)} encType="multipart/form-data">
                    <div className="form-group">
                        <AiOutlineInsertRowAbove />
                        <input onInput={e => setColumnsCount(e.target.value)} type="number" max={10} value={columns_count} placeholder=" " />
                        <label className={(column_error && 'label-error')}>{column_error ? column_error : intl.formatMessage({ id: "tableModal.columns_count" })}</label>
                    </div>

                    <div className="form-group mt-4">
                        <AiOutlineInsertRowLeft />
                        <input onInput={e => setRowsCount(e.target.value)} type="number" max={10} value={rows_count} placeholder=" " />
                        <label className={(row_error && 'label-error')}>{row_error ? row_error : intl.formatMessage({ id: "tableModal.rows_count" })}</label>
                    </div>

                    <label className="custom-checkbox">
                        <input onChange={e => setTableHeader(!table_header)} type="checkbox" />
                        <span>{intl.formatMessage({ id: "tableModal.table_with_header" })}</span>
                    </label>

                    <button className="btn btn-primary mt-4" type="submit"><AiOutlineCheck /> <span>{intl.formatMessage({ id: "done" })}</span></button>
                </form>
            </div>
        </>
    );
};

export default TableModal;