import dynamic from 'next/dynamic';
import { AiOutlineCheck } from "react-icons/ai";
import Loader from "../ui/Loader";
import { useState } from "react";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
})


const TextEditorModal = ({ closeModal, lesson_blocks, setLessonBlocks }) => {
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
    const [error, setError] = useState([]);
    const [loader, setLoader] = useState(false);
    const [text, setText] = useState('');
    const [text_error, setTextError] = useState(false);

    const createTextSubmit = async () => {
        setLoader(true);

        if (text.length == 0 || text == '<p><br></p>') {
            setTextError(true);
        }
        else {
            setLessonBlocks([...lesson_blocks, {
                'block_id': lesson_blocks.length,
                'block_type_id': 1,
                'content': text,
            }])

            closeModal();
            setText('');
        }
        setLoader(false);



        // const form_data = new FormData();
        // form_data.append('video_name', video_name);
        // form_data.append('video_type', video_type);
        // form_data.append('video_link', video_link);
        // form_data.append('video_file', video_file);
        // form_data.append('operation_type_id', 7);

        // await axios.post('lessons/upload_video', form_data)
        //     .then(response => {
        //         const data = response.data.data;
        //         setLessonBlocks([...lesson_blocks, {
        //             'block_id': lesson_blocks.length,
        //             'file_type_id': data.file_type_id,
        //             'file_id': data.file_id,
        //             'file_name': data.file_name,
        //             'file_target': data.file_target
        //         }])

        //         setLoader(false);
        //         setVideoName('');
        //         setVideoType('video_file');
        //         setVideoLink('');
        //         setVideoFile('');
        //         closeModal();
        //     }).catch(err => {
        //         if (err.response) {
        //             if (err.response.status == 422) {
        //                 setError(err.response.data.data);
        //                 setLoader(false);
        //             }
        //             else {
        //                 router.push('/error/' + err.response.status)
        //             }
        //         }
        //         else {
        //             router.push('/error/')
        //         }
        //     });
    }

    return (
        <>
            {loader && <Loader className="overlay" />}
            <div className="modal-body">
                {text_error === true && <p className='text-sm text-danger mb-0 mt-4'>{intl.formatMessage({ id: "textModal.write_text" })}</p>}
                <QuillNoSSRWrapper className={'mt-6 ' + locale} value={text} onChange={setText} placeholder={intl.formatMessage({ id: "textModal.write_here" })} modules={modules} formats={formats} theme="snow" />
                <button onClick={createTextSubmit} className="btn btn-primary mt-4"><AiOutlineCheck /> <span>{intl.formatMessage({ id: "done" })}</span></button>
            </div>
        </>
    );
};

export default TextEditorModal;