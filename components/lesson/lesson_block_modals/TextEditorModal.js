import dynamic from 'next/dynamic';
import { AiOutlineCheck } from "react-icons/ai";
import { useState } from "react";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from 'react-redux';
import { setLessonBlocks, setLessonBlocksCount } from '../../../store/slices/lessonBlocksSlice';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
})

const TextEditorModal = ({ closeModal }) => {
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
    const [text, setText] = useState('');
    const [text_error, setTextError] = useState(false);

    const createTextSubmit = async () => {
        if (text.length == 0 || text == '<p><br></p>') {
            setTextError(true);
        }
        else {
            dispatch(setLessonBlocksCount(lesson_blocks_count + 1));
            lesson_blocks = [...lesson_blocks, {
                'block_id': lesson_blocks_count + 1,
                'block_type_id': 1,
                'content': text,
            }];
            dispatch(setLessonBlocks(lesson_blocks));
            closeModal();
            setText('');
        }
    }

    return (
        <>
            <div className="modal-body">
                {text_error === true && <p className='text-sm text-danger mb-0 mt-4'>{intl.formatMessage({ id: "textModal.write_text" })}</p>}
                <QuillNoSSRWrapper className={'mt-6 ' + locale} value={text} onChange={setText} placeholder={intl.formatMessage({ id: "textModal.write_here" })} modules={modules} formats={formats} theme="snow" />
                <button onClick={createTextSubmit} className="btn btn-primary mt-4"><AiOutlineCheck /> <span>{intl.formatMessage({ id: "done" })}</span></button>
            </div>
        </>
    );
};

export default TextEditorModal;