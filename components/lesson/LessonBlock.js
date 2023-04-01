import API_URL from '../../config/api';
import { Player } from 'video-react';
import ReactAudioPlayer from 'react-audio-player';
import parse from 'html-react-parser';
import "../../node_modules/video-react/dist/video-react.css";
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setLessonBlocks } from '../../store/slices/lessonBlocksSlice';
import { useIntl } from "react-intl";
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineDelete } from 'react-icons/ai';
import Modal from '../ui/Modal';
import DeleteLessonBlockModal from './lesson_block_modals/DeleteLessonBlockModal';

import SyntaxHighlighter from "react-syntax-highlighter";
import * as themes from "react-syntax-highlighter/dist/cjs/styles/hljs";
import supportedLanguages from 'react-syntax-highlighter/dist/cjs/languages/hljs/supported-languages';
import { scrollIntoView } from "seamless-scroll-polyfill";
import RoleProvider from '../../services/RoleProvider';

const LessonBlock = ({ lesson_block, index, edit }) => {
    const intl = useIntl();
    const dispatch = useDispatch();
    let lesson_blocks = useSelector((state) => state.lessonBlocks.lesson_blocks);
    const [delete_lesson_block_modal, setDeleteLessonBlockModal] = useState(false);
    const [delete_lesson_block_id, setDeleteLessonBlockId] = useState('');

    function deleteLessonBlock(block_id) {
        setDeleteLessonBlockId(block_id);
        setDeleteLessonBlockModal(true);
    }

    function moveLessonBlock(index, direction, block_id) {
        let newArr = JSON.parse(JSON.stringify(lesson_blocks));
        let element;
        if (direction == 'up') {
            newArr.splice(index - 1, 0, newArr.splice(index, 1)[0]);
        }
        else if (direction == 'down') {
            newArr.splice(index + 1, 0, newArr.splice(index, 1)[0]);
        }

        element = document.querySelector("#block_" + block_id);

        dispatch(setLessonBlocks(newArr));

        setTimeout(() => {
            scrollIntoView(element, { behavior: "smooth", block: "center", inline: "center" });
        }, 200);
    }

    return (
        <div id={'block_' + lesson_block.block_id} className={"lesson-block " + (edit === true ? "edit " : " ") + (lesson_block.file_type_id == 4 ? lesson_block.image_width : "col-span-12")}>
            {edit === true &&
                <RoleProvider roles={[2]}>
                    <div className="flex justify-between items-center border-b-active pb-4 mb-4">
                        <div>
                            {/* Если это текстовый блок */}
                            {lesson_block.block_type_id == 1 && <p className='mb-0 text-corp'>{intl.formatMessage({ id: "textModal.text" })}</p>}
                            {lesson_block.block_type_id == 5 && <p className='mb-0 text-corp'>{intl.formatMessage({ id: "tableModal.table" })}</p>}
                            {lesson_block.block_type_id == 6 && <p className='mb-0 text-corp'>{intl.formatMessage({ id: "codeModal.code" })}</p>}

                            {/* Если это файлы */}
                            {lesson_block.file_type_id == 1 && <p className='mb-0'><span className='text-corp'>{intl.formatMessage({ id: "videoModal.video" })}:</span> {lesson_block.file_name}</p>}
                            {lesson_block.file_type_id == 2 && <p className='mb-0'><span className='text-corp'>{intl.formatMessage({ id: "videoModal.video" })}:</span> {lesson_block.file_name}</p>}
                            {lesson_block.file_type_id == 3 && <p className='mb-0'><span className='text-corp'>{intl.formatMessage({ id: "audioModal.audio" })}:</span> {lesson_block.file_name}</p>}
                            {lesson_block.file_type_id == 4 && <p className='mb-0'><span className='text-corp'>{intl.formatMessage({ id: "imageModal.image" })}:</span> {lesson_block.file_name}</p>}
                        </div>
                        <div className='btn-wrap'>
                            {index > 0 && <button title={intl.formatMessage({ id: "move_up" })} onClick={e => moveLessonBlock(index, 'up', lesson_block.block_id)} className="btn-up"><AiOutlineArrowUp /></button>}
                            {index != lesson_blocks.length - 1 && <button title={intl.formatMessage({ id: "move_down" })} onClick={e => moveLessonBlock(index, 'down', lesson_block.block_id)} className="btn-down"><AiOutlineArrowDown /></button>}
                            <button title={intl.formatMessage({ id: "delete" })} onClick={e => deleteLessonBlock(lesson_block.block_id)} className="btn-delete"><AiOutlineDelete /></button>
                        </div>
                    </div>
                </RoleProvider>
            }

            {lesson_block.block_type_id == 1 && parse(lesson_block.content)}

            {lesson_block.file_type_id == 1 &&
                <Player playsInline src={API_URL + '/lessons/video/' + lesson_block.file_id} />
            }

            {lesson_block.file_type_id == 2 &&
                <iframe width="100%" height="100%" src={lesson_block.file_target}></iframe>
            }

            {lesson_block.file_type_id == 3 &&
                <ReactAudioPlayer width="100%" src={API_URL + '/lessons/audio/' + lesson_block.file_id} controls />
            }

            {lesson_block.file_type_id == 4 &&
                <img src={API_URL + '/lessons/image/' + lesson_block.file_id} />
            }

            {lesson_block.block_type_id == 5 && parse(lesson_block.content)}

            {lesson_block.block_type_id == 6 &&
                <SyntaxHighlighter language={lesson_block.code_language} style={themes[lesson_block.code_theme]}>
                    {lesson_block.code}
                </SyntaxHighlighter>
            }

            <Modal
                show={delete_lesson_block_modal}
                onClose={() => setDeleteLessonBlockModal(false)}
                modal_title={intl.formatMessage({ id: "lesson.delete_lesson_block_title" })}
                modal_size="modal-xl"
            >
                <DeleteLessonBlockModal delete_lesson_block_id={delete_lesson_block_id} closeModal={() => setDeleteLessonBlockModal(false)} />
            </Modal>
        </div>

    );
};

export default LessonBlock;