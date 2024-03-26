import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { setDiskData } from "../../store/slices/diskSlice";
import Modal from "../../components/ui/Modal";
import PreviewFileModal from "../../components/ui/PreviewFileModal";
import DeleteFileModal from "../../components/ui/DeleteFileModal";
import { AiOutlineCalendar, AiOutlineColumnHeight, AiOutlineSearch, AiOutlineUndo, AiOutlineFile, AiOutlinePlayCircle, AiOutlineAudio } from "react-icons/ai";
import axios from "axios";
import Breadcrumb from "../../components/ui/Breadcrumb";
import RoleProvider from "../../services/RoleProvider";
import Loader from "../../components/ui/Loader";
import Pagination from "../../components/ui/Pagination";
import serialize from 'form-serialize';
import Alert from "../../components/ui/Alert";
import debounceHandler from "../../utils/debounceHandler";
import StickyBox from "react-sticky-box";
import ContentViewTypeButtons from "../../components/ui/ContentViewTypeButtons";
import API_URL from "../../config/api";
import FileSize from "../../components/ui/FileSize";
import UploadFileModals from "../../components/ui/UploadFileModals";
import ProgressBar from "../../components/ui/ProgressBar";

export default function Files() {
    const intl = useIntl();
    const dispatch = useDispatch();
    const title = intl.formatMessage({ id: "page.disk.title" });
    const [contentViewType, setContentViewType] = useState('grid');
    const [preview_file, setPreviewFile] = useState([]);
    const [preview_file_modal, setPreviewFileModal] = useState(false);
    const [delete_file_modal, setDeleteFileModal] = useState(false);
    const [files, setFiles] = useState([]);
    const [file_types, setFileTypes] = useState([]);
    const disk_data = useSelector((state) => state.disk.disk_data);
    const [disk_loader, setDiskLoader] = useState(false);
    const [files_loader, setFilesLoader] = useState(false);
    const [showFullLoader, setShowFullLoader] = useState(true);
    const router = useRouter();
    const [search_file_filter, setSearchFileFilter] = useState(false);
    const [edit_file_name, setEditFileName] = useState('');

    const getFiles = async (url) => {
        setFilesLoader(true);
        const search_form = document.querySelector('#file_search_form');
        const form_body = serialize(search_form, { hash: true, empty: true });

        form_body.per_page = document.querySelector('#per-page-select')?.value;

        if (!url) {
            url = 'media/get';
        }

        await axios.post(url, form_body)
            .then(response => {
                setFiles(response.data)
                setFilesLoader(false);
                setShowFullLoader(false);
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

    const getDiskData = async () => {
        setDiskLoader(true);
        await axios.get('media/get_disk_space')
            .then(response => {
                dispatch(setDiskData(response.data));
                resetFileSearchFilter();
                setDiskLoader(false);
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

    const getFileTypes = async () => {
        await axios.get('media/types_of_media_files')
            .then(response => {
                setFileTypes(response.data);
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

    const openPreviewFileModal = (file) => {
        setPreviewFile(file);
        setEditFileName(file.file_name);
        setPreviewFileModal(true);
    }

    const closePreviewFileModal = (preview_file) => {
        if (preview_file.file_type_id == 1) {
            let video_tag = document.querySelector('video');
            video_tag.pause();
        }
        else if (preview_file.file_type_id == 2) {
            let audio_tag = document.querySelector('audio');
            audio_tag.pause();
        }
        setPreviewFileModal(false);
        setTimeout(() => {
            setPreviewFile([]);
        }, 500);
    }

    const openDeleteFileModal = () => {
        setPreviewFileModal(false);
        setDeleteFileModal(true);
    }

    const closeDeleteFileModal = () => {
        setDeleteFileModal(false);
        setPreviewFileModal(true);
    }

    const showHideFileSearchFilter = () => {
        if (search_file_filter === true) {
            setSearchFileFilter(false);
            resetFileSearchFilter();
        }
        else {
            setSearchFileFilter(true);
        }
    }

    const resetFileSearchFilter = () => {
        const search_form = document.querySelector('#file_search_form');
        search_form.reset();
        getFiles();
    }

    useEffect(() => {
        setShowFullLoader(true);
        getFiles();
        getFileTypes();
    }, []);

    return (
        <DashboardLayout showLoader={showFullLoader} title={title}>
            <RoleProvider roles={[2]} redirect={true}>
                <Breadcrumb>
                    {title}
                </Breadcrumb>

                <div className="col-span-12">
                    <div className="title-wrap">
                        <h2>{title}</h2>
                        <div className="btn-wrap">
                            {
                                disk_data?.files_count > 0 &&
                                <>
                                    <ContentViewTypeButtons contentViewType={contentViewType} setContentViewType={setContentViewType} />
                                    <UploadFileModals getDiskData={getDiskData} />
                                    <button onClick={() => showHideFileSearchFilter()} className="btn btn-light"><AiOutlineSearch /> <span>{search_file_filter === true ? intl.formatMessage({ id: "hide_search_filter" }) : intl.formatMessage({ id: "show_search_filter" })}</span></button>
                                </>
                            }
                        </div>
                    </div>
                </div>

                <div className="col-span-12 md:col-span-4 lg:col-span-3">
                    <StickyBox offsetTop={6} offsetBottom={6}>
                        <div className="custom-grid">
                            <div className="col-span-12">
                                <div className="card p-4">
                                    {disk_loader && <Loader className="overlay" />}
                                    <p className="text-xs m-0 text-inactive">{intl.formatMessage({ id: "subscription_plan.your_subscription_plan" })}:</p>
                                    <div className="flex justify-between">
                                        <p className="m-0 font-medium text-lg">{disk_data.plan_name}</p>
                                        <p className="m-0 font-medium text-lg">{disk_data.disk_space_gb?.toFixed()} {intl.formatMessage({ id: "gigabyte" })}</p>
                                    </div>

                                    <ProgressBar bg_class={'success'} className={"danger"} percentage={disk_data.used_space_percent} show_percentage={false} />

                                    <div className="flex justify-between">
                                        <p className="text-sm text-success m-0">{intl.formatMessage({ id: "free_space" })}: <span className="text-active">{disk_data.free_space_gb?.toFixed(2)} {intl.formatMessage({ id: "gigabyte" })}</span></p>
                                        <p className="text-sm text-inactive m-0">{disk_data.free_space_percent?.toFixed()}%</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-sm text-danger m-0">{intl.formatMessage({ id: "used_space" })}: <span className="text-active">{disk_data.used_space_gb?.toFixed(2)} {intl.formatMessage({ id: "gigabyte" })}</span></p>
                                        <p className="text-sm text-inactive m-0">{disk_data.used_space_percent?.toFixed()}%</p>
                                    </div>

                                    <button className="btn btn-sm btn-outline-primary mt-4"><AiOutlineColumnHeight /><span>{intl.formatMessage({ id: "increase_the_space" })}</span></button>
                                </div>
                            </div>
                            <div className={"col-span-12 " + (disk_data?.files_count > 0 && search_file_filter === true ? 'block' : 'hidden')}>
                                <div className="card p-4">
                                    <h5>{intl.formatMessage({ id: "file_search_filter" })}</h5>
                                    <form id="file_search_form">
                                        <div className="custom-grid">
                                            <div className="col-span-12">
                                                <div className="form-group-border active">
                                                    <AiOutlineFile />
                                                    <input autoComplete="search-file-name" type="text" defaultValue={''} name="file_name" placeholder=" " onChange={debounceHandler(getFiles, 1000)} />
                                                    <label>{intl.formatMessage({ id: "file_name" })}</label>
                                                </div>
                                            </div>

                                            <div className="col-span-12">
                                                <div className="form-group-border active">
                                                    <AiOutlineCalendar />
                                                    <input type="date" defaultValue={''} name="created_at_from" onChange={debounceHandler(getFiles, 1000)} placeholder=" " />
                                                    <label>{intl.formatMessage({ id: "uploaded_at_from" })}</label>
                                                </div>
                                            </div>

                                            <div className="col-span-12">
                                                <div className="form-group-border active">
                                                    <AiOutlineCalendar />
                                                    <input type="date" defaultValue={''} name="created_at_to" onChange={debounceHandler(getFiles, 1000)} placeholder=" " />
                                                    <label>{intl.formatMessage({ id: "uploaded_at_to" })}</label>
                                                </div>
                                            </div>

                                            <div className="col-span-12">
                                                <div className="form-group-border active">
                                                    <AiOutlineFile />
                                                    <select defaultValue={''} name="file_type_id" onChange={debounceHandler(getFiles, 1000)}>
                                                        <option value='' selected>{intl.formatMessage({ id: "specify_the_file_type" })}</option>
                                                        {file_types.map(file_type => (
                                                            <option key={file_type.file_type_id} value={file_type.file_type_id}>{file_type.file_type_name}</option>
                                                        ))}
                                                    </select>
                                                    <label>{intl.formatMessage({ id: "file_type" })}</label>
                                                </div>
                                            </div>

                                            <div className="col-span-12">
                                                <div className="btn-wrap">
                                                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={debounceHandler(resetFileSearchFilter, 500)}> <AiOutlineUndo /> <span>{intl.formatMessage({ id: "reset_search_filter" })}</span></button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </StickyBox>
                </div>

                <div className={"col-span-12 md:col-span-8 lg:col-span-9"}>
                    {disk_data?.files_count > 0
                        ?
                        files.data?.length > 0 ?
                            <>
                                {
                                    contentViewType === 'grid' ?
                                        <div className="table table-sm selectable">
                                            {files_loader && <Loader className="overlay" />}
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>

                                                        </th>
                                                        <th>{intl.formatMessage({ id: "file_name" })}</th>
                                                        <th>{intl.formatMessage({ id: "file_type" })}</th>
                                                        <th>{intl.formatMessage({ id: "file_size" })}</th>
                                                        <th>{intl.formatMessage({ id: "uploaded_at" })}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {files.data?.map(file => (
                                                        <tr key={file.file_id} onClick={e => openPreviewFileModal(file)} className="hover:cursor-pointer">
                                                            <td>
                                                                {
                                                                    file.file_type_id == 1
                                                                        ?
                                                                        <div className="w-10 h-10 rounded-lg bg-active border-inactive flex items-center justify-center text-2xl">
                                                                            <AiOutlinePlayCircle />
                                                                        </div>
                                                                        :
                                                                        file.file_type_id == 2
                                                                            ?
                                                                            <div className="w-10 h-10 rounded-lg bg-active border-inactive flex items-center justify-center text-2xl">
                                                                                <AiOutlineAudio />
                                                                            </div>
                                                                            :
                                                                            file.file_type_id == 3
                                                                                ?
                                                                                <div className="w-10 h-10 bg-center bg-cover bg-no-repeat border-inactive rounded-lg" style={{ backgroundImage: "url(" + API_URL + '/media/image/' + file.file_id + ")" }}></div>
                                                                                :
                                                                                <></>
                                                                }
                                                            </td>
                                                            <td>{file.file_name}</td>
                                                            <td>{file.file_type_name}</td>
                                                            <td>
                                                                <FileSize file_size={file.size} />
                                                            </td>
                                                            <td>{new Date(file.created_at).toLocaleString()}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        :
                                        <div className="custom-grid">
                                            {files.data?.map(file => (
                                                <div key={file.file_id} className="col-span-6 md:col-span-4 lg:col-span-3">
                                                    <div className="card p-2 hover:cursor-pointer" onClick={e => openPreviewFileModal(file)}>
                                                        {
                                                            file.file_type_id == 1
                                                                ?
                                                                <div className="w-full h-24 sm:h-48 lg:h-36 rounded-lg bg-active border-inactive flex items-center justify-center text-inactive text-5xl">
                                                                    <AiOutlinePlayCircle />
                                                                </div>
                                                                :
                                                                file.file_type_id == 2
                                                                    ?
                                                                    <div className="w-full h-24 sm:h-48 lg:h-36 rounded-lg bg-active border-inactive flex items-center justify-center text-inactive text-5xl">
                                                                        <AiOutlineAudio />
                                                                    </div>
                                                                    :
                                                                    file.file_type_id == 3
                                                                        ?
                                                                        <div className="w-full h-24 sm:h-48 lg:h-36 bg-center bg-cover bg-no-repeat rounded-lg border-inactive" style={{ backgroundImage: "url(" + API_URL + '/media/image/' + file.file_id + ")" }}></div>
                                                                        :
                                                                        <></>
                                                        }
                                                        <p className="mt-2 mb-1">{file.file_name}</p>
                                                        <div className="flex flex-wrap justify-between gap-2">
                                                            <p className="text-xs text-inactive mb-0">{file.file_type_name}</p>
                                                            <p className="text-xs text-inactive mb-0"><FileSize file_size={file.size} /></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                }
                                <div className="btn-wrap mt-6">
                                    <Pagination items={files} setItems={getFiles} />
                                </div>

                                <Modal show={preview_file_modal} onClose={() => closePreviewFileModal(preview_file)} modal_title={preview_file.file_name} modal_size="modal-xl">
                                    <PreviewFileModal
                                        file={preview_file}
                                        closeModal={() => closePreviewFileModal(preview_file)}
                                        getFiles={getFiles}
                                        getDiskData={getDiskData}
                                        edit_file_name={edit_file_name}
                                        setEditFileName={setEditFileName}
                                        openDeleteFileModal={openDeleteFileModal} />
                                </Modal>

                                <Modal show={delete_file_modal} onClose={() => closeDeleteFileModal(true)} modal_title={intl.formatMessage({ id: "deleting_a_file" })} modal_size="modal-xl">
                                    <DeleteFileModal
                                        file={preview_file}
                                        closeModal={() => closeDeleteFileModal(true)}
                                        closePreviewFileModal={closePreviewFileModal}
                                        getDiskData={getDiskData} />
                                </Modal>
                            </>
                            :
                            <Alert className="alert light">
                                {files_loader && <Loader className="overlay" />}
                                <p className="mb-0">{intl.formatMessage({ id: "nothing_was_found_for_your_query" })}</p>
                            </Alert>
                        :
                        <div className="p-6 bg-active border-inactive rounded-lg flex items-center flex-col">
                            <h3 className="text-center mb-2">{intl.formatMessage({ id: "page.disk.welcome" })}</h3>
                            <p className="text-center mb-4">{intl.formatMessage({ id: "page.disk.welcome_description" })}</p>
                            <UploadFileModals getDiskData={getDiskData} />
                        </div>
                    }
                </div>
            </RoleProvider>
        </DashboardLayout>
    );
}