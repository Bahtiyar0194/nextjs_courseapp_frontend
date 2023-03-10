import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTestQuestionBlocks } from "../../../../store/slices/testQuestionBlocksSlice";
import Link from "next/link";
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineDelete, AiOutlineQuestion, AiOutlinePlusCircle, AiOutlinePlus, AiOutlineCaretDown, AiOutlineFileImage, AiOutlineAudio, AiOutlineCode} from "react-icons/ai";
import AnswerElemInput from "./AnswerElemInput";
import QuestionMaterialBlock from "../../QuestionMaterialBlock";
import { CDropdown, CDropdownToggle, CDropdownMenu } from "@coreui/react";

const TestQuestionBlock = ({ index, intl, moveTestQuestionBlock, deleteTestQuestionBlock, test_question, createQuestionImage, createQuestionAudio, edit}) => {

    const dispatch = useDispatch();
    let test_question_blocks = useSelector((state) => state.testQuestionBlocks.test_question_blocks);

    const [answers_count, setAnswersCount] = useState(test_question.answers.length);

    const addAnswerElem = () => {
        let obj = {
            answer_id: answers_count + 1,
            answer_value: '',
            checked: false
        };

        let newArr = JSON.parse(JSON.stringify(test_question_blocks));
        newArr[index].answers.push(obj);
        dispatch(setTestQuestionBlocks(newArr));
        setAnswersCount(answers_count + 1);
    }

    return (
        <div className={"test-question-block " + (edit === true && "edit")}>
            <div className="flex justify-between items-center border-b-active pb-4 mb-4">
                <div>
                    <p className='mb-0 text-corp'>{intl.formatMessage({ id: "task.test.addTestQuestionsModal.question" })} № {index + 1}</p>
                </div>
                <div className='btn-wrap'>
                    <button title={intl.formatMessage({ id: "move_up" })} onClick={e => moveTestQuestionBlock(e.currentTarget, 'up')} className="btn-up"><AiOutlineArrowUp /></button>
                    <button title={intl.formatMessage({ id: "move_down" })} onClick={e => moveTestQuestionBlock(e.currentTarget, 'down')} className="btn-down"><AiOutlineArrowDown /></button>
                    <button title={intl.formatMessage({ id: "delete" })} onClick={e => deleteTestQuestionBlock(test_question.question_id)} className="btn-delete"><AiOutlineDelete /></button>
                </div>
            </div>

            <div className="form-group mt-4">
                <AiOutlineQuestion />
                <input className="question-input" defaultValue={test_question.question} type="text" placeholder=" " />
                <label className="question-label">{intl.formatMessage({ id: "task.test.addTestQuestionsModal.question" })}</label>
            </div>

            {test_question_blocks[index].question_materials.length > 0 &&
                <div className="custom-grid mb-4">
                    {test_question_blocks[index].question_materials.map((question_material_block, i) => (
                        <div key={i} className="col-span-12 md:col-span-6 lg:col-span-4">
                            <QuestionMaterialBlock question_material_block={question_material_block} question_index={index} edit={true} />
                        </div>
                    ))}
                </div>
            }

            <div className="btn-wrap mb-6">
                <CDropdown>
                    <CDropdownToggle color="light" href="#">
                        <AiOutlinePlus /> {intl.formatMessage({ id: "lesson.add_material" })} <AiOutlineCaretDown className="ml-0.5 h-3 w-3" />
                    </CDropdownToggle>
                    <CDropdownMenu>
                        <Link href={'#'} onClick={() => createQuestionImage(index)}><AiOutlineFileImage />{intl.formatMessage({ id: "imageModal.image" })}</Link>
                        <Link href={'#'} onClick={() => createQuestionAudio(index)}><AiOutlineAudio />{intl.formatMessage({ id: "audioModal.audio" })}</Link>
                        <Link href={'#'} onClick={() => setCodeModal(true)}><AiOutlineCode />{intl.formatMessage({ id: "codeModal.code" })}</Link>
                    </CDropdownMenu>
                </CDropdown>
            </div>

            {test_question.answers.map((answer, i) => (
                <AnswerElemInput key={i} index={i} question_id={test_question.question_id} question_index={index} answer={answer} intl={intl} />
            ))}

            <button type="button" onClick={e => addAnswerElem()} className="text-sm flex items-center pb-1 border-b border-dashed border-inactive text-corp"><AiOutlinePlusCircle className="mr-1" /> {intl.formatMessage({ id: "task.test.addTestQuestionsModal.add_variant" })}</button>
        </div>
    )
}

export default TestQuestionBlock;