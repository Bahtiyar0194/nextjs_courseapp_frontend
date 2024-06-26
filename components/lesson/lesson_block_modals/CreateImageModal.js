import { AiOutlineCheck, AiOutlineFile, AiOutlineFileImage } from "react-icons/ai";
import Loader from "../../ui/Loader";
import { useState } from "react";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from 'react-redux';
import { setLessonBlocks, setLessonBlocksCount } from "../../../store/slices/lessonBlocksSlice";
import { setTaskBlocks, setTaskBlocksCount } from '../../../store/slices/taskBlocksSlice';
import { setTaskAnswerBlocks, setTaskAnswerBlocksCount } from "../../../store/slices/taskAnswerBlocksSlice";
import axios from "axios";

const CreateImageModal = ({ create_lesson, create_task, create_task_answer, upload_file, getDiskData, closeModal }) => {
    const router = useRouter();
    const intl = useIntl();
    const [error, setError] = useState([]);
    const [loader, setLoader] = useState(false);
    const [progress, setProgress] = useState(0);
    const dispatch = useDispatch();

    let lesson_blocks = useSelector((state) => state.lessonBlocks.lesson_blocks);
    const lesson_blocks_count = useSelector((state) => state.lessonBlocks.lesson_blocks_count);

    let task_blocks = useSelector((state) => state.taskBlocks.task_blocks);
    const task_blocks_count = useSelector((state) => state.taskBlocks.task_blocks_count);

    let task_answer_blocks = useSelector((state) => state.taskAnswerBlocks.task_answer_blocks);
    const task_answer_blocks_count = useSelector((state) => state.taskAnswerBlocks.task_answer_blocks_count);

    const [image_name, setImageName] = useState('');
    const [image_type, setImageType] = useState('image_file');
    const [image_width, setImageWidth] = useState('col-span-12');
    const [image_file, setImageFile] = useState('');
    const [images, setImages] = useState([]);
    const [selected_image_id, setSelectedImageId] = useState('');

    const changeImageType = (image_type) => {
        setImageType(image_type);

        if (image_type === 'image_from_media') {
            getImages();
        }
    }

    const getImages = async () => {
        setLoader(true);
        await axios.get('media/get_images')
            .then(response => {
                setImages(response.data);
                setLoader(false);
            }).catch(err => {
                if (err.response) {
                    router.push({
                        pathname: '/error',
                        query: {
                            status: err.response.status,
                            message: err.response.data.message,
                            url: err.request.responseURL,
                        }
                    });
                }
                else {
                    router.push('/error');
                }
            });
    }

    const createImageSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);

        const form_data = new FormData();
        form_data.append('image_name', image_name);
        form_data.append('image_type', image_type);
        form_data.append('image_file', image_file);
        form_data.append('selected_image_id', selected_image_id);
        form_data.append('operation_type_id', 9);

        const config = {
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                setProgress(Math.floor((loaded * 100) / total))
            },
        }

        await axios.post('media/upload_image', form_data, config)
            .then(response => {
                const data = response.data.data;

                if (create_lesson === true) {
                    dispatch(setLessonBlocksCount(lesson_blocks_count + 1));
                    lesson_blocks = [...lesson_blocks, {
                        'block_id': lesson_blocks_count + 1,
                        'file_type_id': data.file_type_id,
                        'file_id': data.file_id,
                        'file_name': data.file_name,
                        'file_target': data.file_target,
                        'image_width': image_width
                    }];
                    dispatch(setLessonBlocks(lesson_blocks));
                }

                if (create_task === true) {
                    dispatch(setTaskBlocksCount(task_blocks_count + 1));
                    task_blocks = [...task_blocks, {
                        'block_id': task_blocks_count + 1,
                        'file_type_id': data.file_type_id,
                        'file_id': data.file_id,
                        'file_name': data.file_name,
                        'file_target': data.file_target,
                        'image_width': image_width
                    }];
                    dispatch(setTaskBlocks(task_blocks));
                }

                if (create_task_answer === true) {
                    dispatch(setTaskAnswerBlocksCount(task_answer_blocks_count + 1));
                    task_answer_blocks = [...task_answer_blocks, {
                        'block_id': task_answer_blocks_count + 1,
                        'file_type_id': data.file_type_id,
                        'file_id': data.file_id,
                        'file_name': data.file_name,
                        'file_target': data.file_target,
                        'image_width': image_width
                    }];
                    dispatch(setTaskAnswerBlocks(task_answer_blocks));
                }

                if (upload_file === true) {
                    getDiskData();
                }

                setLoader(false);
                setImageName('');
                setImageType('image_file');
                setImageFile('');
                setSelectedImageId('');
                setError([]);
                closeModal();
            }).catch(err => {
                console.log(err)
                if (err.response) {
                    if (err.response.status == 422) {
                        setError(err.response.data.data);
                        setLoader(false);
                    }
                    else {
                        router.push({
                            pathname: '/error',
                            query: {
                                status: err.response.status,
                                message: err.response.data.message,
                                url: err.request.responseURL,
                            }
                        });
                    }
                }
                else {
                    router.push('/error');
                }
            });
    }

    return (
        <>
            {loader && <Loader className="overlay" progress={progress} />}
            <div className="modal-body">
                <form onSubmit={e => createImageSubmit(e)} encType="multipart/form-data">
                    {upload_file === false &&
                        <div className="mb-4">
                            <div>
                                <label className="custom-radio">
                                    <input type="radio" onChange={e => changeImageType('image_file')} checked={image_type === 'image_file'} name="image_type" />
                                    <span>{intl.formatMessage({ id: "imageModal.form.upload_new_image" })}</span>
                                </label>
                            </div>

                            <div className="mt-2">
                                <label className="custom-radio">
                                    <input type="radio" onChange={e => changeImageType('image_from_media')} checked={image_type === 'image_from_media'} name="image_type" />
                                    <span>{intl.formatMessage({ id: "upload_from_media" })}</span>
                                </label>
                            </div>
                        </div>
                    }

                    {image_type != 'image_from_media' &&
                        <div className="form-group">
                            <AiOutlineFile />
                            <input onInput={e => setImageName(e.target.value)} type="text" value={image_name} placeholder=" " />
                            <label className={(error.image_name && 'label-error')}>{error.image_name ? error.image_name : intl.formatMessage({ id: "imageModal.image_name" })}</label>
                        </div>
                    }

                    <p className="text-inactive mt-4">{intl.formatMessage({ id: "imageModal.image_width" })}</p>

                    <div className="flex gap-x-4 mb-4">
                        <label className="custom-radio">
                            <input type="radio" onChange={e => setImageWidth('col-span-12')} defaultChecked name="image_width" />
                            <span>100%</span>
                        </label>


                        <label className="custom-radio">
                            <input type="radio" onChange={e => setImageWidth('col-span-12 md:col-span-6')} name="image_width" />
                            <span>50%</span>
                        </label>

                        <label className="custom-radio">
                            <input type="radio" onChange={e => setImageWidth('col-span-12 lg:col-span-4')} name="image_width" />
                            <span>33%</span>
                        </label>

                        <label className="custom-radio">
                            <input type="radio" onChange={e => setImageWidth('col-span-12 md:col-span-6 lg:col-span-3')} name="image_width" />
                            <span>25%</span>
                        </label>
                    </div>

                    {image_type === 'image_file'
                        ?
                        <div className="form-group-file mt-2 mb-4">
                            <input id="image_file" onChange={e => setImageFile(e.target.files[0])} type="file" accept="image/*" placeholder=" " />
                            <label htmlFor="image_file" className={(error.image_file && 'label-error' || error.lack_of_disk_space && 'label-error')}>
                                <AiOutlineFileImage />
                                <p>
                                    {
                                        error.image_file
                                            ?
                                            error.image_file
                                            :
                                            error.lack_of_disk_space
                                                ?
                                                intl.formatMessage({ id: "lack_of_disk_space" })
                                                :
                                                image_file
                                                    ?
                                                    intl.formatMessage({ id: "file_ready_to_upload" })
                                                    :
                                                    intl.formatMessage({ id: "imageModal.form.upload_image_file" })
                                    }
                                </p>
                                {image_file ?
                                    <div>
                                        {image_file.name && <p className="text-xs mb-0">{intl.formatMessage({ id: "selected_file" })}: <b>{image_file.name}</b></p>}
                                        {image_file.size && <p className="text-xs mb-0">{intl.formatMessage({ id: "file_size" })}: <b>{(image_file.size / 1048576).toFixed(2)} {intl.formatMessage({ id: "megabyte" })}</b></p>}
                                    </div>
                                    :
                                    <p className="text-xs mb-0">{intl.formatMessage({ id: "choose_file" })}</p>
                                }
                            </label>
                        </div>
                        :
                        <div className="form-group mt-6 mb-4">
                            <AiOutlineFile />
                            <select defaultValue={''} onChange={e => setSelectedImageId(e.target.value)}>
                                <option value='' selected>{intl.formatMessage({ id: "choose_file" })}</option>
                                {images.map(image => (
                                    <option key={image.file_id} value={image.file_id}>{image.file_name}</option>
                                ))}
                            </select>
                            <label className={(error.selected_image_id && 'label-error')}>{error.selected_image_id ? error.selected_image_id : intl.formatMessage({ id: "selected_file" })}</label>
                        </div>
                    }

                    <button className="btn btn-primary mt-4" type="submit"><AiOutlineCheck /> <span>{intl.formatMessage({ id: "done" })}</span></button>
                </form>
            </div>
        </>
    );
};

export default CreateImageModal;