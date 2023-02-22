import API_URL from '../../config/api';
import { Player } from 'video-react';
import "../../node_modules/video-react/dist/video-react.css";
import { useSelector } from 'react-redux';
import { useIntl } from "react-intl";
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineDelete } from 'react-icons/ai';

const LessonBlock = ({ lesson_block, lesson_blocks, setLessonBlocks, index, edit }) => {

    const roles = useSelector((state) => state.authUser.roles);
    const intl = useIntl();

    function deleteLessonBlock(block_id) {
        setLessonBlocks([
            ...lesson_blocks.filter(block => block.block_id !== block_id),
        ]);
    }

    function moveLessonBlock(direction, index){
        if(direction == 'up'){
            lesson_blocks.splice(index - 1, 0, lesson_blocks.splice(index, 1)[0]);
        }
        else if(direction == 'down'){
            lesson_blocks.splice(index + 1, 0, lesson_blocks.splice(index, 1)[0]);
        }
        setLessonBlocks([...lesson_blocks]);
    }

    return (
        <div className={"lesson-block " + (edit === true && "edit")}>
            {roles.includes(2) && edit === true &&
                <div className="flex items-center mb-4">
                    {index > 0 && <button title={intl.formatMessage({ id: "move_up" })} onClick={e => moveLessonBlock('up', index)} className="btn-up mr-1"><AiOutlineArrowUp /></button>}
                    {index != lesson_blocks.length - 1 && <button title={intl.formatMessage({ id: "move_down" })} onClick={e => moveLessonBlock('down', index)} className="btn-down mr-1"><AiOutlineArrowDown /></button>}
                    <button title={intl.formatMessage({ id: "delete" })} onClick={e => deleteLessonBlock(lesson_block.block_id)} className="btn-delete"><AiOutlineDelete /></button>
                </div>
            }
            {lesson_block.file_type_id == 1 &&
                <div>
                    <Player playsInline src={API_URL + '/lessons/video/' + lesson_block.file_id} />
                </div>
            }
        </div>
    );
};

export default LessonBlock;