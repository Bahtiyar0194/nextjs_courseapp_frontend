import { AiOutlineCheck } from "react-icons/ai";
import { useState } from "react";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from 'react-redux';
import { setLessonBlocks, setLessonBlocksCount } from '../../../store/slices/lessonBlocksSlice';
import { setTaskBlocks, setTaskBlocksCount } from '../../../store/slices/taskBlocksSlice';
import { setTaskAnswerBlocks, setTaskAnswerBlocksCount } from "../../../store/slices/taskAnswerBlocksSlice";

const QuillNoSSRWrapper = typeof window === 'object' ? require('react-quill') : () => false;

const TextEditorModal = ({ create_lesson, create_task, create_task_answer, closeModal }) => {
    const modules = {
        toolbar: [
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
            ]
        ],
        clipboard: {
            matchVisual: false,
        },
    }
    /*
     * Quill editor formats
     * See https://quilljs.com/docs/formats/
     */
    const formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent'
    ]

    const router = useRouter();
    const { locale } = router;
    const intl = useIntl();
    const dispatch = useDispatch();

    let lesson_blocks = useSelector((state) => state.lessonBlocks.lesson_blocks);
    const lesson_blocks_count = useSelector((state) => state.lessonBlocks.lesson_blocks_count);

    let task_blocks = useSelector((state) => state.taskBlocks.task_blocks);
    const task_blocks_count = useSelector((state) => state.taskBlocks.task_blocks_count);

    let task_answer_blocks = useSelector((state) => state.taskAnswerBlocks.task_answer_blocks);
    const task_answer_blocks_count = useSelector((state) => state.taskAnswerBlocks.task_answer_blocks_count);

    const [text, setText] = useState('');
    const [text_error, setTextError] = useState(false);

    const createTextSubmit = async () => {
        if (text.length == 0 || text == '<p><br></p>') {
            setTextError(true);
        }
        else {
            if (create_lesson === true) {
                dispatch(setLessonBlocksCount(lesson_blocks_count + 1));
                lesson_blocks = [...lesson_blocks, {
                    'block_id': lesson_blocks_count + 1,
                    'block_type_id': 1,
                    'content': text,
                }];
                dispatch(setLessonBlocks(lesson_blocks));
            }

            if (create_task === true) {
                dispatch(setTaskBlocksCount(task_blocks_count + 1));
                task_blocks = [...task_blocks, {
                    'block_id': task_blocks_count + 1,
                    'block_type_id': 1,
                    'content': text,
                }];
                dispatch(setTaskBlocks(task_blocks));
            }

            if (create_task_answer === true) {
                dispatch(setTaskAnswerBlocksCount(task_answer_blocks_count + 1));
                task_answer_blocks = [...task_answer_blocks, {
                    'block_id': task_answer_blocks_count + 1,
                    'block_type_id': 1,
                    'content': text,
                }];
                dispatch(setTaskAnswerBlocks(task_answer_blocks));
            }

            closeModal();
            setText('');
        }
    }

    return (
        <div className="modal-body">
            {text_error === true && <p className='text-sm text-danger mb-0 mt-4'>{intl.formatMessage({ id: "textModal.write_text" })}</p>}
            <QuillNoSSRWrapper className={locale} value={text} onChange={setText} placeholder={intl.formatMessage({ id: "textModal.write_here" })} modules={modules} formats={formats} theme="snow" />
            <button onClick={createTextSubmit} className="btn btn-primary mt-4"><AiOutlineCheck /> <span>{intl.formatMessage({ id: "done" })}</span></button>
        </div>
    );
};

export default TextEditorModal;