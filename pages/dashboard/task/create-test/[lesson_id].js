import DashboardLayout from "../../../../components/layouts/DashboardLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setTestQuestionBlocks, setTestQuestionBlocksCount } from "../../../../store/slices/testQuestionBlocksSlice";
import { AiOutlineCaretDown, AiOutlineCheck, AiOutlineFileDone } from "react-icons/ai";
import axios from "axios";
import Link from "next/link";
import Breadcrumb from "../../../../components/ui/Breadcrumb";
import ButtonLoader from "../../../../components/ui/ButtonLoader";
import Modal from "../../../../components/ui/Modal";
import DeleteTestQuestionModal from "../../../../components/lesson/lesson_task_modals/test_components/DeleteTestQuestionModal";
import TestQuestionBlock from "../../../../components/lesson/lesson_task_modals/test_components/TestQuestionBlock";
import CreateQuestionImageModal from "../../../../components/lesson/lesson_task_modals/test_components/CreateQuestionImageModal";
import CreateQuestionCodeModal from "../../../../components/lesson/lesson_task_modals/test_components/CreateQuestionCodeModal";
import CreateQuestionAudioModal from "../../../../components/lesson/lesson_task_modals/test_components/CreateQuestionAudioModal";
import { scrollIntoView } from "seamless-scroll-polyfill";

export default function CreateTest() {
    const router = useRouter();
    const [showFullLoader, setShowFullLoader] = useState(true);
    const intl = useIntl();

    const [lesson, setLesson] = useState([]);
    const roles = useSelector((state) => state.authUser.roles);

    const [error, setError] = useState([]);
    const [button_loader, setButtonLoader] = useState(false);

    const [delete_test_question_modal, setDeleteTestQuestionModal] = useState(false);
    const [delete_question_id, setDeleteQuestionId] = useState('');

    const [task_name, setTaskName] = useState('');
    const [task_description, setTaskDescription] = useState('');

    const [imageModal, setImageModal] = useState(false);
    const [audioModal, setAudioModal] = useState(false);
    const [codeModal, setCodeModal] = useState(false);

    const [question_index, setQuestionIndex] = useState(0);

    const dispatch = useDispatch();
    let test_question_blocks = useSelector((state) => state.testQuestionBlocks.test_question_blocks);
    const test_question_blocks_count = useSelector((state) => state.testQuestionBlocks.test_question_blocks_count);

    const getLesson = async (lesson_id) => {
        setShowFullLoader(true);
        await axios.get('lessons/' + lesson_id)
            .then(response => {
                setLesson(response.data.lesson);
                setShowFullLoader(false);
                dispatch(setTestQuestionBlocksCount(0));
                dispatch(setTestQuestionBlocks([]));
            }).catch(err => {
                if (err.response) {
                    router.push('/error/' + err.response.status)
                }
                else {
                    router.push('/error')
                }
            });
    }

    const addTestQuestion = () => {
        dispatch(setTestQuestionBlocksCount(test_question_blocks_count + 1))
        dispatch(setTestQuestionBlocks([...test_question_blocks, {
            question_id: test_question_blocks_count,
            question: '',
            question_materials: [],
            answers: [
                {
                    answer_id: 1,
                    answer_value: '',
                    checked: false
                },
                {
                    answer_id: 2,
                    answer_value: '',
                    checked: false
                }
            ]
        }]));

        setTimeout(() => {
            let someElementsItems = document.querySelectorAll(".test-question-block");
            let elem = someElementsItems[someElementsItems.length - 1]
            scrollIntoView(elem, { behavior: "smooth", block: "center", inline: "center" });
        }, 200);
    }

    const createQuestionImage = (question_index) => {
        setImageModal(true);
        setQuestionIndex(question_index);
    }

    const createQuestionAudio = (question_index) => {
        setAudioModal(true);
        setQuestionIndex(question_index);
    }

    const createQuestionCode = (question_index) => {
        setCodeModal(true);
        setQuestionIndex(question_index);
    }

    function moveTestQuestionBlock(element, direction) {
        let parent = element.closest('.test-question-block');
        let wrap = element.closest('#test_questions_block');

        if (direction == 'up') {
            if (parent.previousElementSibling) {
                wrap.insertBefore(parent, parent.previousElementSibling);
            }
        }
        else if (direction == 'down') {
            if (parent.nextElementSibling) {
                wrap.insertBefore(parent.nextElementSibling, parent);
            }
        }

        setTimeout(() => {
            scrollIntoView(parent, { behavior: "smooth", block: "center", inline: "center" });
        }, 200);
    }

    const deleteTestQuestionBlock = (question_id) => {
        setDeleteQuestionId(question_id);
        setDeleteTestQuestionModal(true);
    }

    const createTestSubmit = async (lesson_id) => {
        setButtonLoader(true);
        let all_questions = [];
        let blocks = document.querySelectorAll('.test-question-block');
        let blocks_error = false;
        if (blocks.length > 0) {
            for (let index = 0; index < blocks.length; index++) {
                let i = 0;
                let block = blocks[index];
                let question_input = block.querySelector('.question-input');
                let question_label = block.querySelector('.question-label');
                let empty_answers = 0;
                let correct_answers = 0;

                if (question_input.value == '') {
                    question_label.classList.add('label-error');
                    question_label.textContent = intl.formatMessage({ id: "task.test.addTestQuestionsModal.question_error" });
                }
                else {
                    question_label.classList.remove('label-error');
                    question_label.textContent = intl.formatMessage({ id: "task.test.addTestQuestionsModal.question" });
                }

                let answers = [];
                let answer_inputs = block.querySelectorAll('[data-answer-input]');

                for (let input of answer_inputs) {
                    let label = block.querySelector('[data-answer-label="' + input.getAttribute('data-answer-input') + '"]');
                    let radio = block.querySelector('[data-answer-radio="' + input.getAttribute('data-answer-input') + '"]');

                    answers.push({
                        answer_value: input.value,
                        checked: radio.checked
                    });

                    if (input.value == '') {
                        empty_answers += 1;
                        label.classList.add('label-error');
                        label.textContent = intl.formatMessage({ id: "task.test.addTestQuestionsModal.answer_variant" }) + ' № ' + (i += 1) + ' ' + intl.formatMessage({ id: "task.test.addTestQuestionsModal.answer_error" });
                    }
                    else {
                        label.classList.remove('label-error');
                        label.textContent = intl.formatMessage({ id: "task.test.addTestQuestionsModal.answer_variant" }) + ' № ' + (i += 1);
                    }

                    if (radio.checked === true) {
                        correct_answers += 1;
                    }

                    let radios = block.querySelectorAll('[data-answer-radio]');

                    if (correct_answers === 0) {
                        for (let radio of radios) {
                            radio.nextElementSibling.classList.add('error');
                            radio.nextElementSibling.textContent = intl.formatMessage({ id: "task.test.addTestQuestionsModal.correct_answer_error" });
                        }
                    }
                    else {
                        for (let radio of radios) {
                            radio.nextElementSibling.classList.remove('error');
                            radio.nextElementSibling.textContent = intl.formatMessage({ id: "task.test.addTestQuestionsModal.correct_answer" });
                        }
                    }
                }

                all_questions.push({
                    question: question_input.value,
                    question_materials: test_question_blocks[index].question_materials,
                    answers: answers
                });

                if (question_input.value == '' || empty_answers > 0 || correct_answers === 0) {
                    if (task_name != '' || task_description != '') {
                        scrollIntoView(block, { behavior: "smooth", block: "center", inline: "center" });
                    }
                    blocks_error = true;
                    break;
                }
            }
        }


        const form_data = new FormData();
        form_data.append('task_name', task_name);
        form_data.append('task_description', task_description);
        form_data.append('task_type_id', 1);
        form_data.append('test_question_blocks', JSON.stringify(all_questions));
        form_data.append('test_question_blocks_error', blocks_error);
        form_data.append('operation_type_id', 6);

        await axios.post('tasks/create/' + lesson_id, form_data)
            .then(response => {
                //console.log(all_questions)
                //router.push('/dashboard/lesson/' + lesson_id)
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 422) {
                        setError(err.response.data.data);
                        setButtonLoader(false);
                        if (error.task_name || error.task_description) {
                            let card = document.querySelector('#create_wrap');
                            setTimeout(() => {
                                scrollIntoView(card, { behavior: "smooth", block: "center", inline: "center" });
                            }, 200);
                        }
                    }
                    else {
                        router.push('/error/' + err.response.status)
                    }
                }
                else {
                    router.push('/error/')
                }
            });
    }

    useEffect(() => {
        if (router.isReady) {
            const { lesson_id } = router.query;
            getLesson(lesson_id);
        }
    }, [router.isReady]);

    return (
        <DashboardLayout showLoader={showFullLoader} title={intl.formatMessage({ id: "task.add_test" })}>
            {roles.includes(2) ?
                <>
                    <Breadcrumb>
                        <Link href={'/dashboard/courses'}>{intl.formatMessage({ id: "page.my_courses.title" })}</Link>
                        <Link href={'/dashboard/courses/' + lesson.course_id}>{lesson.course_name}</Link>
                        <Link href={'/dashboard/lesson/' + lesson.lesson_id}>{lesson.lesson_name}</Link>
                        {intl.formatMessage({ id: "task.add_test" })}
                    </Breadcrumb>

                    <div className="col-span-12">
                        <div id="create_wrap" className="form-group mt-2">
                            <AiOutlineFileDone />
                            <input onInput={e => setTaskName(e.target.value)} type="text" value={task_name} placeholder=" " />
                            <label className={error.task_name && 'label-error'}>{error.task_name ? error.task_name : intl.formatMessage({ id: "task.test_name" })}</label>
                        </div>

                        <div className="form-group mt-2">
                            <AiOutlineFileDone />
                            <textarea cols="20" onInput={e => setTaskDescription(e.target.value)} value={task_description} placeholder=" "></textarea>
                            <label className={error.task_description && 'label-error'}>{error.task_description ? error.task_description : intl.formatMessage({ id: "task.test_description" })}</label>
                        </div>

                        <div id="test_questions_block">
                            {test_question_blocks.length > 0 &&
                                test_question_blocks.map((test_question, i) => (
                                    <TestQuestionBlock
                                        key={i}
                                        index={i}
                                        intl={intl}
                                        moveTestQuestionBlock={moveTestQuestionBlock}
                                        deleteTestQuestionBlock={deleteTestQuestionBlock}
                                        test_question={test_question}
                                        createQuestionImage={createQuestionImage}
                                        createQuestionAudio={createQuestionAudio}
                                        createQuestionCode={createQuestionCode}
                                        edit={true}
                                    />
                                ))
                            }
                        </div>

                        <p className="my-4">{intl.formatMessage({ id: "task.test.addTestQuestionsModal.count_of_questions" })}: <span className="text-corp">{test_question_blocks.length}</span></p>
                        {error.test_question_blocks && test_question_blocks.length == 0 && <p className="text-danger mb-4">{intl.formatMessage({ id: "task.test.addTestQuestionsModal.please_add_questions" })}</p>}

                        <div className="btn-wrap">
                            <button onClick={e => addTestQuestion()} className="btn btn-primary">
                                {intl.formatMessage({ id: "task.test.addTestQuestionsModal.add_questions" })} <AiOutlineCaretDown className="ml-0.5 h-3 w-3" />
                            </button>
                            <button disabled={button_loader} onClick={e => createTestSubmit(lesson.lesson_id)} className="btn btn-outline-primary">
                                {button_loader === true ? <ButtonLoader /> : <AiOutlineCheck />}
                                <span>{intl.formatMessage({ id: "done" })}</span>
                            </button>
                        </div>
                    </div>

                    <Modal
                        show={delete_test_question_modal}
                        onClose={() => setDeleteTestQuestionModal(false)}
                        modal_title={intl.formatMessage({ id: "task.test.deleteTestQuestionsModal.title" })}
                        modal_size="modal-xl"
                    >
                        <DeleteTestQuestionModal delete_question_id={delete_question_id} closeModal={() => setDeleteTestQuestionModal(false)} />
                    </Modal>

                    <Modal show={imageModal} onClose={() => setImageModal(false)} modal_title={intl.formatMessage({ id: "imageModal.title" })} modal_size="modal-xl">
                        <CreateQuestionImageModal question_index={question_index} closeModal={() => setImageModal(false)} />
                    </Modal>

                    <Modal show={audioModal} onClose={() => setAudioModal(false)} modal_title={intl.formatMessage({ id: "audioModal.title" })} modal_size="modal-xl">
                        <CreateQuestionAudioModal question_index={question_index} closeModal={() => setAudioModal(false)} />
                    </Modal>

                    <Modal show={codeModal} onClose={() => setCodeModal(false)} modal_title={intl.formatMessage({ id: "codeModal.title" })} modal_size="modal-4xl">
                        <CreateQuestionCodeModal question_index={question_index} closeModal={() => setCodeModal(false)} />
                    </Modal>
                </>
                :
                <div className="col-span-12">
                    {intl.formatMessage({ id: "loading" })}
                </div>
            }
        </DashboardLayout>
    );
}