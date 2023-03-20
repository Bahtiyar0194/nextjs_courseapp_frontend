import API_URL from '../../../../config/api';
import ReactAudioPlayer from 'react-audio-player';
import "../../../../node_modules/video-react/dist/video-react.css";
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { useIntl } from "react-intl";
import { AiOutlineDelete } from 'react-icons/ai';
import Modal from '../../../ui/Modal';
import DeleteTestQuestionMaterialBlockModal from './DeleteTestQuestionMaterialBlockModal';

import SyntaxHighlighter from "react-syntax-highlighter";
import * as themes from "react-syntax-highlighter/dist/cjs/styles/hljs";

const TestQuestionMaterialBlock = ({ question_material_block, question_index, edit }) => {
    const intl = useIntl();
    const dispatch = useDispatch();

    const roles = useSelector((state) => state.authUser.roles);
    const [delete_test_question_material_block_modal, setDeleteTestQuestionMaterialBlockModal] = useState(false);
    const [delete_test_question_material_block_id, setDeleteTestQuestionMaterialBlockId] = useState('');

    function deleteTestQuestionMaterialBlock(block_id) {
        setDeleteTestQuestionMaterialBlockId(block_id);
        setDeleteTestQuestionMaterialBlockModal(true);
    }

    return (
        <div id={'block_' + question_material_block.block_id} className={"lesson-block " + (edit === true && "edit")}>
            {roles.includes(2) && edit === true &&
                <div className="flex justify-between items-center border-b-active pb-4 mb-4">
                    <div>
                        {question_material_block.block_type_id == 6 && <p className='mb-0 text-corp'>{intl.formatMessage({ id: "codeModal.code" })}</p>}

                        {/* Если это файлы */}
                        {question_material_block.file_type_id == 3 && <p className='mb-0'><span className='text-corp'>{intl.formatMessage({ id: "audioModal.audio" })}:</span> {question_material_block.file_name}</p>}
                        {question_material_block.file_type_id == 4 && <p className='mb-0'><span className='text-corp'>{intl.formatMessage({ id: "imageModal.image" })}:</span> {question_material_block.file_name}</p>}
                    </div>
                    <div className='btn-wrap'>
                        <button title={intl.formatMessage({ id: "delete" })} onClick={e => deleteTestQuestionMaterialBlock(question_material_block.block_id)} className="btn-delete"><AiOutlineDelete /></button>
                    </div>
                </div>
            }
            <div className="custom-grid">
                {question_material_block.file_type_id == 3 &&
                    <div className='col-span-12'>
                        <ReactAudioPlayer width="100%" src={API_URL + '/lessons/audio/' + question_material_block.file_id} controls />
                    </div>
                }

                {question_material_block.file_type_id == 4 &&
                    <div className='col-span-12 md:col-span-4 lg:col-span-2'>
                        <img className={question_material_block.image_width} src={API_URL + '/lessons/image/' + question_material_block.file_id} />
                    </div>
                }

                {question_material_block.block_type_id == 6 &&
                    <div className='col-span-12'>
                        <SyntaxHighlighter language={question_material_block.code_language} style={themes[question_material_block.code_theme]}>
                            {question_material_block.code}
                        </SyntaxHighlighter>
                    </div>
                }
            </div>
            <Modal
                show={delete_test_question_material_block_modal}
                onClose={() => setDeleteTestQuestionMaterialBlockModal(false)}
                modal_title={intl.formatMessage({ id: "task.test.deleteTestQuestionMaterialModal.title" })}
                modal_size="modal-xl"
            >
                <DeleteTestQuestionMaterialBlockModal question_index={question_index} delete_test_question_material_block_id={delete_test_question_material_block_id} closeModal={() => setDeleteTestQuestionMaterialBlockModal(false)} />
            </Modal>
        </div>

    );
};

export default TestQuestionMaterialBlock;