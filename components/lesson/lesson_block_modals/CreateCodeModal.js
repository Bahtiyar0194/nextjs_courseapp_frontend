import { AiOutlineCheck, AiOutlineCode, AiOutlineFormatPainter } from "react-icons/ai";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from 'react-redux';
import { setLessonBlocks } from "../../../store/slices/lessonBlocksSlice";

import SyntaxHighlighter from "react-syntax-highlighter";
import * as themes from "react-syntax-highlighter/dist/cjs/styles/hljs";
import supportedLanguages from 'react-syntax-highlighter/dist/cjs/languages/hljs/supported-languages';

const CreateCodeModal = ({ closeModal }) => {
    const intl = useIntl();
    const dispatch = useDispatch();
    let lesson_blocks = useSelector((state) => state.lessonBlocks.lesson_blocks);

    const defaultCodeLanguage = 'javascript';
    const defaultCodeTheme = 'monokaiSublime';
    const [code_text, setCodeText] = useState('');
    const [code_language, setCodeLanguage] = useState(defaultCodeLanguage);
    const [code_theme, setCodeTheme] = useState(defaultCodeTheme);
    const [code_text_error, setCodeTextError] = useState('');

    const createCodeSubmit = async (e) => {
        e.preventDefault();

        if (code_text.length > 0) {
            setCodeTextError('');
            lesson_blocks = [...lesson_blocks, {
                'block_id': lesson_blocks.length,
                'block_type_id': 6,
                'code_language': code_language,
                'code_theme': code_theme,
                'code': code_text,
            }];

            dispatch(setLessonBlocks(lesson_blocks));
            closeModal();
        }
        else {
            setCodeTextError(intl.formatMessage({ id: "codeModal.enter_the_code" }))
        }
    }

    return (
        <>
            <div className="modal-body">
                <form onSubmit={e => createCodeSubmit(e)} encType="multipart/form-data">
                    <div className="form-group mt-4">
                        <AiOutlineCode />
                        <select defaultValue={defaultCodeLanguage} name="languages" onChange={(e) => setCodeLanguage(e.target.value)}>
                            {supportedLanguages.map((language, i) => (
                                <option key={i}>{language}</option>
                            ))}
                        </select>
                        <label>{intl.formatMessage({ id: "codeModal.code_language" })}</label>
                    </div>
                    <div className="form-group mt-4">
                        <AiOutlineFormatPainter />
                        <select defaultValue={defaultCodeTheme} name="themes" onChange={(e) => setCodeTheme(e.target.value)}>
                            {Object.keys(themes).map((theme, i) => (
                                <option key={i}>{theme}</option>
                            ))}
                        </select>
                        <label>{intl.formatMessage({ id: "codeModal.code_theme" })}</label>
                    </div>

                    <div className="form-group mt-4">
                        <AiOutlineCode />
                        <textarea cols="30" onInput={e => setCodeText(e.target.value)} value={code_text} placeholder=" "></textarea>
                        <label className={(code_text_error && 'label-error')}>{ code_text_error ? code_text_error : intl.formatMessage({ id: "codeModal.code_text" })}</label>
                    </div>

                    {code_text.length > 0 &&
                        <SyntaxHighlighter language={code_language} style={themes[code_theme]}>
                            {code_text}
                        </SyntaxHighlighter>
                    }

                    <button className="btn btn-primary mt-4" type="submit"><AiOutlineCheck /> <span>{intl.formatMessage({ id: "done" })}</span></button>
                </form>
            </div>
        </>
    );
};

export default CreateCodeModal;