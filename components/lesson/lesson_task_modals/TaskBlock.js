import API_URL from '../../../config/api';
import { Player } from 'video-react';
import ReactAudioPlayer from 'react-audio-player';
import parse from 'html-react-parser';
import "../../../node_modules/video-react/dist/video-react.css";
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setTaskBlocks } from '../../../store/slices/taskBlocksSlice';
import { useIntl } from "react-intl";
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineDelete } from 'react-icons/ai';
import Modal from '../../ui/Modal';
import DeleteTaskBlockModal from './DeleteTaskBlockModal';

import SyntaxHighlighter from "react-syntax-highlighter";
import * as themes from "react-syntax-highlighter/dist/cjs/styles/hljs";
import supportedLanguages from 'react-syntax-highlighter/dist/cjs/languages/hljs/supported-languages';
import { scrollIntoView } from "seamless-scroll-polyfill";
import RoleProvider from '../../../services/RoleProvider';

const TaskBlock = ({ task_block, index, edit }) => {
    const intl = useIntl();
    const dispatch = useDispatch();
    let task_blocks = useSelector((state) => state.taskBlocks.task_blocks);
    const [delete_task_block_modal, setDeleteTaskBlockModal] = useState(false);
    const [delete_task_block_id, setDeleteTaskBlockId] = useState('');

    function deleteTaskBlock(block_id) {
        setDeleteTaskBlockId(block_id);
        setDeleteTaskBlockModal(true);
    }

    function moveTaskBlock(index, direction, block_id) {
        let newArr = JSON.parse(JSON.stringify(task_blocks));
        let element;
        if (direction == 'up') {
            newArr.splice(index - 1, 0, newArr.splice(index, 1)[0]);
        }
        else if (direction == 'down') {
            newArr.splice(index + 1, 0, newArr.splice(index, 1)[0]);
        }

        element = document.querySelector("#block_" + block_id);

        dispatch(setTaskBlocks(newArr));

        setTimeout(() => {
            scrollIntoView(element, { behavior: "smooth", block: "center", inline: "center" });
        }, 200);
    }

    return (
        <div id={'block_' + task_block.block_id} className={"lesson-block " + (edit === true ? "edit " : " ") + (task_block.file_type_id == 3 ? task_block.image_width : "col-span-12")}>
            {edit === true &&
                <RoleProvider roles={[2]}>
                    <div className="flex justify-between items-center border-b-active pb-4 mb-4">
                        <div>
                            {/* Если это текстовый блок */}
                            {task_block.block_type_id == 1 && <p className='mb-0 text-corp'>{intl.formatMessage({ id: "textModal.text" })}</p>}
                            {task_block.block_type_id == 5 && <p className='mb-0 text-corp'>{intl.formatMessage({ id: "tableModal.table" })}</p>}
                            {task_block.block_type_id == 6 && <p className='mb-0 text-corp'>{intl.formatMessage({ id: "codeModal.code" })}</p>}

                            {/* Если это файлы */}
                            {task_block.file_type_id == 1 && <p className='mb-0'><span className='text-corp'>{intl.formatMessage({ id: "videoModal.video" })}:</span> {task_block.file_name}</p>}
                            {task_block.file_type_id == 2 && <p className='mb-0'><span className='text-corp'>{intl.formatMessage({ id: "audioModal.audio" })}:</span> {task_block.file_name}</p>}
                            {task_block.file_type_id == 3 && <p className='mb-0'><span className='text-corp'>{intl.formatMessage({ id: "imageModal.image" })}:</span> {task_block.file_name}</p>}
                        </div>
                        <div className='btn-wrap'>
                            {index > 0 && <button title={intl.formatMessage({ id: "move_up" })} onClick={e => moveTaskBlock(index, 'up', task_block.block_id)} className="btn-up"><AiOutlineArrowUp /></button>}
                            {index != task_blocks.length - 1 && <button title={intl.formatMessage({ id: "move_down" })} onClick={e => moveTaskBlock(index, 'down', task_block.block_id)} className="btn-down"><AiOutlineArrowDown /></button>}
                            <button title={intl.formatMessage({ id: "delete" })} onClick={e => deleteTaskBlock(task_block.block_id)} className="btn-delete"><AiOutlineDelete /></button>
                        </div>
                    </div>
                </RoleProvider>
            }

            {task_block.block_type_id == 1 && parse(task_block.content)}

            {task_block.file_type_id == 1 &&
                <Player playsInline src={API_URL + '/media/video/' + task_block.file_id} />
            }

            {task_block.file_type_id == 2 &&
                <ReactAudioPlayer width="100%" src={API_URL + '/media/audio/' + task_block.file_id} controls />
            }

            {task_block.file_type_id == 3 &&
                <img src={API_URL + '/media/image/' + task_block.file_id} />
            }

            {task_block.block_type_id == 5 && parse(task_block.content)}

            {task_block.block_type_id == 6 &&
                <SyntaxHighlighter language={task_block.code_language} style={themes[task_block.code_theme]}>
                    {task_block.code}
                </SyntaxHighlighter>
            }

            <Modal
                show={delete_task_block_modal}
                onClose={() => setDeleteTaskBlockModal(false)}
                modal_title={intl.formatMessage({ id: "task.test.deleteTestQuestionMaterialModal.title" })}
                modal_size="modal-xl"
            >
                <DeleteTaskBlockModal delete_task_block_id={delete_task_block_id} closeModal={() => setDeleteTaskBlockModal(false)} />
            </Modal>
        </div>

    );
};

export default TaskBlock;