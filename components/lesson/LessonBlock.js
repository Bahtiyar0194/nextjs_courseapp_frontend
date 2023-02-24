import API_URL from '../../config/api';
import { Player } from 'video-react';
import "../../node_modules/video-react/dist/video-react.css";
import { useSelector } from 'react-redux';
import { useIntl } from "react-intl";
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineDelete } from 'react-icons/ai';
import parse from 'html-react-parser';

const LessonBlock = ({ lesson_block, lesson_blocks, setLessonBlocks, index, edit }) => {

    const roles = useSelector((state) => state.authUser.roles);
    const intl = useIntl();

    function deleteLessonBlock(block_id) {
        setLessonBlocks([
            ...lesson_blocks.filter(block => block.block_id !== block_id),
        ]);
    }

    function moveLessonBlock(direction, index, block_id) {
        if (direction == 'up') {
            lesson_blocks.splice(index - 1, 0, lesson_blocks.splice(index, 1)[0]);
        }
        else if (direction == 'down') {
            lesson_blocks.splice(index + 1, 0, lesson_blocks.splice(index, 1)[0]);
        }
        setLessonBlocks([...lesson_blocks]);

        let element = document.querySelector(
            "#block_" + block_id
        );
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
                        {lesson_block.block_type_id == 1 && <p className='mb-0 text-corp'>{intl.formatMessage({ id: "lesson_blocks.text_block" })}</p>}

                        {/* Если это видеоблок */}
                        {lesson_block.file_type_id == 1 && <p className='mb-0'><span className='text-corp'>{intl.formatMessage({ id: "lesson_blocks.video_block" })}:</span> {lesson_block.file_name}</p>}
                        {lesson_block.file_type_id == 2 && <p className='mb-0'><span className='text-corp'>{intl.formatMessage({ id: "lesson_blocks.video_block" })}:</span> {lesson_block.file_name}</p>}
                    </div>
                    <div>
                        {index > 0 && <button title={intl.formatMessage({ id: "move_up" })} onClick={e => moveLessonBlock('up', index, lesson_block.block_id)} className="btn-up mr-1"><AiOutlineArrowUp /></button>}
                        {index != lesson_blocks.length - 1 && <button title={intl.formatMessage({ id: "move_down" })} onClick={e => moveLessonBlock('down', index, lesson_block.block_id)} className="btn-down mr-1"><AiOutlineArrowDown /></button>}
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

        </div>
    );
};

export default LessonBlock;