import { AiOutlineCheck, AiOutlineFile, AiOutlineFileImage } from "react-icons/ai";
import Loader from "../../ui/Loader";
import { useState } from "react";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from 'react-redux';
import { setLessonBlocks, setLessonBlocksCount } from "../../../store/slices/lessonBlocksSlice";
import axios from "axios";

const CreateImageModal = ({ closeModal }) => {
    const router = useRouter();
    const intl = useIntl();
    const [error, setError] = useState([]);
    const [loader, setLoader] = useState(false);
    const [progress, setProgress] = useState(0);
    const dispatch = useDispatch();
    let lesson_blocks = useSelector((state) => state.lessonBlocks.lesson_blocks);
    const lesson_blocks_count = useSelector((state) => state.lessonBlocks.lesson_blocks_count);

    const [image_name, setImageName] = useState('');
    const [image_type, setImageType] = useState('image_file');
    const [image_width, setImageWidth] = useState('w-full');
    const [image_file, setImageFile] = useState('');

    const createImageSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);

        const form_data = new FormData();
        form_data.append('image_name', image_name);
        form_data.append('image_file', image_file);
        form_data.append('operation_type_id', 9);

        const config = {
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                setProgress(Math.floor((loaded * 100) / total))
            },
        }

        await axios.post('lessons/upload_image', form_data, config)
            .then(response => {
                const data = response.data.data;

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

                setLoader(false);
                setImageName('');
                setImageFile('');
                closeModal();
            }).catch(err => {
                if (err.response) {
                    if (err.response.status == 422) {
                        setError(err.response.data.data);
                        setLoader(false);
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

    return (
        <>
            {loader && <Loader className="overlay" progress={progress} />}
            <div className="modal-body">
                <form onSubmit={e => createImageSubmit(e)} encType="multipart/form-data">
                    <div className="mt-4">
                        <label className="custom-radio">
                            <input type="radio" onChange={e => setImageType('image_file')} defaultChecked name="image_type" />
                            <span>{intl.formatMessage({ id: "imageModal.form.upload_new_image" })}</span>
                        </label>
                    </div>

                    <div className="mt-2">
                        <label className="custom-radio">
                            <input type="radio" onChange={e => setImageType('image_from_media')} name="image_type" />
                            <span>{intl.formatMessage({ id: "upload_from_media" })}</span>
                        </label>
                    </div>

                    <div className="form-group mt-4">
                        <AiOutlineFile />
                        <input onInput={e => setImageName(e.target.value)} type="text" value={image_name} placeholder=" " />
                        <label className={(error.image_name && 'label-error')}>{error.image_name ? error.image_name : intl.formatMessage({ id: "imageModal.image_name" })}</label>
                    </div>

                    <p className="text-inactive">{intl.formatMessage({ id: "imageModal.image_width" })}</p>

                    <div className="btn-wrap-lg mb-4">
                        <label className="custom-radio">
                            <input type="radio" onChange={e => setImageWidth('w-full')} defaultChecked name="image_width" />
                            <span>100%</span>
                        </label>


                        <label className="custom-radio">
                            <input type="radio" onChange={e => setImageWidth('w-1/2')} name="image_width" />
                            <span>50%</span>
                        </label>


                        <label className="custom-radio">
                            <input type="radio" onChange={e => setImageWidth('w-1/4')} name="image_width" />
                            <span>25%</span>
                        </label>
                    </div>

                    {image_type === 'image_file'
                        ?
                        <div className="form-group-file mt-2 mb-4">
                            <input id="image_file" onChange={e => setImageFile(e.target.files[0])} type="file" accept="image/*" placeholder=" " />
                            <label htmlFor="image_file" className={(error.image_file && 'label-error')}>
                                <AiOutlineFileImage />
                                <p className="mb-1">{error.image_file ? error.image_file : image_file ? intl.formatMessage({ id: "file_ready_to_upload" }) : intl.formatMessage({ id: "imageModal.form.upload_image_file" })}</p>
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
                        : "Under construction"
                    }


                    <button className="btn btn-primary mt-4" type="submit"><AiOutlineCheck /> <span>{intl.formatMessage({ id: "done" })}</span></button>
                </form>
            </div>
        </>
    );
};

export default CreateImageModal;