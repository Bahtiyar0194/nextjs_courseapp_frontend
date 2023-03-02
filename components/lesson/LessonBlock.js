import API_URL from '../../config/api';
import { Player } from 'video-react';
import ReactAudioPlayer from 'react-audio-player';
import parse from 'html-react-parser';
import "../../node_modules/video-react/dist/video-react.css";
import { useDispatch, useSelector } from "react-redux";
import { setLessonBlocks } from '../../store/slices/lessonBlocksSlice';
import { useIntl } from "react-intl";
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineDelete } from 'react-icons/ai';

const LessonBlock = ({ lesson_block, index, edit }) => {
    const intl = useIntl();
    const dispatch = useDispatch();
    let lesson_blocks = useSelector((state) => state.lessonBlocks.lesson_blocks);
    const roles = useSelector((state) => state.authUser.roles);

    function deleteLessonBlock(block_id) {
        let newArr = lesson_blocks.filter(item => item.block_id !== block_id);
        dispatch(setLessonBlocks(newArr));
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
        console.log(element)

        dispatch(setLessonBlocks(newArr));

        setTimeout(() => {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "start",
            });
        }, 500);
    }

    return (
        <div id={'block_' + lesson_block.block_id} className={"lesson-block " + (edit === true && "edit")}>
            {roles.includes(2) && edit === true &&
                <div className="flex justify-between items-center border-b-active pb-4 mb-4">
                    <div>
                        {/* Если это текстовый блок */}
                        {lesson_block.block_type_id == 1 && <p className='mb-0 text-corp'>{intl.formatMessage({ id: "textModal.text" })}</p>}
                        {lesson_block.block_type_id == 5 && <p className='mb-0 text-corp'>{intl.formatMessage({ id: "tableModal.table" })}</p>}

                        {/* Если это видеоблок */}
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
                <img className={lesson_block.image_width} src={API_URL + '/lessons/image/' + lesson_block.file_id} />
            }

            {lesson_block.block_type_id == 5 && parse(lesson_block.content)}
        </div>
    );
};

export default LessonBlock;