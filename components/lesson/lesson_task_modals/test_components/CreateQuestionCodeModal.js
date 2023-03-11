import { AiOutlineCheck, AiOutlineCode, AiOutlineFormatPainter } from "react-icons/ai";
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from 'react-redux';
import { setTestQuestionBlocks } from "../../../../store/slices/testQuestionBlocksSlice";

import SyntaxHighlighter from "react-syntax-highlighter";
import * as themes from "react-syntax-highlighter/dist/cjs/styles/hljs";
import supportedLanguages from 'react-syntax-highlighter/dist/cjs/languages/hljs/supported-languages';

const CreateQuestionCodeModal = ({ question_index, closeModal }) => {
    const intl = useIntl();
    const dispatch = useDispatch();
    let test_question_blocks = useSelector((state) => state.testQuestionBlocks.test_question_blocks);
    let test_question_blocks_count = useSelector((state) => state.testQuestionBlocks.test_question_blocks_count);
    const [question_materials_count, setQuestionMaterialsCount] = useState(0);

    useEffect(() => {
        if (test_question_blocks_count > 0) {
            setQuestionMaterialsCount(test_question_blocks[question_index].question_materials.length);
        }
    }, []);

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

            setQuestionMaterialsCount(question_materials_count + 1);

            let question_material = {
                'block_id': question_materials_count,
                'block_type_id': 6,
                'code_language': code_language,
                'code_theme': code_theme,
                'code': code_text,
            };

            let newArr = JSON.parse(JSON.stringify(test_question_blocks));
            newArr[question_index].question_materials.push(question_material);
            dispatch(setTestQuestionBlocks(newArr));
            setCodeText('');
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

export default CreateQuestionCodeModal;