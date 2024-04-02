import API_URL from '../../../../config/api';
import { Player } from 'video-react';
import ReactAudioPlayer from 'react-audio-player';
import parse from 'html-react-parser';
import "../../../../node_modules/video-react/dist/video-react.css";
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setTaskAnswerBlocks } from '../../../../store/slices/taskAnswerBlocksSlice';
import { useIntl } from "react-intl";
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineDelete } from 'react-icons/ai';
import Modal from '../../../ui/Modal';
import DeleteTaskAnswerBlockModal from './DeleteTaskAnswerBlockModal';

import SyntaxHighlighter from "react-syntax-highlighter";
import * as themes from "react-syntax-highlighter/dist/cjs/styles/hljs";
import supportedLanguages from 'react-syntax-highlighter/dist/cjs/languages/hljs/supported-languages';
import { scrollIntoView } from "seamless-scroll-polyfill";

const TaskAnswerBlock = ({ task_answer_block, index, edit }) => {
    const intl = useIntl();
    const dispatch = useDispatch();
    let task_answer_blocks = useSelector((state) => state.taskAnswerBlocks.task_answer_blocks);
    const [delete_task_answer_block_modal, setDeleteTaskAnswerBlockModal] = useState(false);
    const [delete_task_answer_block_id, setDeleteTaskAnswerBlockId] = useState('');

    function deleteTaskAnswerBlock(block_id) {
        setDeleteTaskAnswerBlockId(block_id);
        setDeleteTaskAnswerBlockModal(true);
    }

    function moveTaskAnswerBlock(index, direction, block_id) {
        let newArr = JSON.parse(JSON.stringify(task_answer_blocks));
        let element;
        if (direction == 'up') {
            newArr.splice(index - 1, 0, newArr.splice(index, 1)[0]);
        }
        else if (direction == 'down') {
            newArr.splice(index + 1, 0, newArr.splice(index, 1)[0]);
        }

        element = document.querySelector("#block_" + block_id);

        dispatch(setTaskAnswerBlocks(newArr));

        setTimeout(() => {
            scrollIntoView(element, { behavior: "smooth", block: "center", inline: "center" });
        }, 200);
    }

    return (
        <div id={'block_' + task_answer_block.block_id} className={"lesson-block " + (edit === true ? "edit " : " ") + (task_answer_block.file_type_id == 3 ? task_answer_block.image_width : "col-span-12")}>
            {edit === true &&
                    <div className="flex justify-between items-center border-b-active pb-4 mb-4">
                        <div>
                            {/* Если это текстовый блок */}
                            {task_answer_block.block_type_id == 1 && <p className='mb-0 text-corp'>{intl.formatMessage({ id: "textModal.text" })}</p>}
                            {task_answer_block.block_type_id == 5 && <p className='mb-0 text-corp'>{intl.formatMessage({ id: "tableModal.table" })}</p>}
                            {task_answer_block.block_type_id == 6 && <p className='mb-0 text-corp'>{intl.formatMessage({ id: "codeModal.code" })}</p>}

                            {/* Если это файлы */}
                            {task_answer_block.file_type_id == 1 && <p className='mb-0'><span className='text-corp'>{intl.formatMessage({ id: "videoModal.video" })}:</span> {task_answer_block.file_name}</p>}
                            {task_answer_block.file_type_id == 2 && <p className='mb-0'><span className='text-corp'>{intl.formatMessage({ id: "audioModal.audio" })}:</span> {task_answer_block.file_name}</p>}
                            {task_answer_block.file_type_id == 3 && <p className='mb-0'><span className='text-corp'>{intl.formatMessage({ id: "imageModal.image" })}:</span> {task_answer_block.file_name}</p>}
                        </div>
                        <div className='btn-wrap'>
                            {index > 0 && <button title={intl.formatMessage({ id: "move_up" })} onClick={e => moveTaskAnswerBlock(index, 'up', task_answer_block.block_id)} className="btn-up"><AiOutlineArrowUp /></button>}
                            {index != task_answer_blocks.length - 1 && <button title={intl.formatMessage({ id: "move_down" })} onClick={e => moveTaskAnswerBlock(index, 'down', task_answer_block.block_id)} className="btn-down"><AiOutlineArrowDown /></button>}
                            <button title={intl.formatMessage({ id: "delete" })} onClick={e => deleteTaskAnswerBlock(task_answer_block.block_id)} className="btn-delete"><AiOutlineDelete /></button>
                        </div>
                    </div>
            }

            {task_answer_block.block_type_id == 1 && parse(task_answer_block.content)}

            {task_answer_block.file_type_id == 1 &&
                <Player playsInline src={API_URL + '/media/video/' + task_answer_block.file_id} />
            }

            {task_answer_block.file_type_id == 2 &&
                <ReactAudioPlayer width="100%" src={API_URL + '/media/audio/' + task_answer_block.file_id} controls />
            }

            {task_answer_block.file_type_id == 3 &&
                <img src={API_URL + '/media/image/' + task_answer_block.file_id} />
            }

            {task_answer_block.block_type_id == 5 && parse(task_answer_block.content)}

            {task_answer_block.block_type_id == 6 &&
                <SyntaxHighlighter language={task_answer_block.code_language} style={themes[task_answer_block.code_theme]}>
                    {task_answer_block.code}
                </SyntaxHighlighter>
            }

            <Modal
                show={delete_task_answer_block_modal}
                onClose={() => setDeleteTaskAnswerBlockModal(false)}
                modal_title={intl.formatMessage({ id: "task.test.deleteTestQuestionMaterialModal.title" })}
                modal_size="modal-xl"
            >
                <DeleteTaskAnswerBlockModal delete_task_answer_block_id={delete_task_answer_block_id} closeModal={() => setDeleteTaskAnswerBlockModal(false)} />
            </Modal>
        </div>

    );
};

export default TaskAnswerBlock;