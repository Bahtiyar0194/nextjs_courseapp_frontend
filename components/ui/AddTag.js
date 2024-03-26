import { AiOutlineCloseCircle, AiOutlineFileDone, AiOutlinePlus, AiOutlinePlusCircle } from "react-icons/ai";
import { useIntl } from "react-intl";
import { useRef, useEffect, useState } from 'react';
import Modal from "./Modal";
const AddTag = ({ items, setItems, className, tagClass, tagInputId, label, message, modal_title, with_description }) => {
    const intl = useIntl();
    const ref = useRef(null);
    const [is_exist_modal, setIsExistModal] = useState(false);
    const [add_item_modal, setAddItemModal] = useState(false);

    const [tag_name, setTagName] = useState('');
    const [tag_description, setTagDescription] = useState('');
    const [error, setError] = useState([]);

    const addItem = () => {
        let tag_input = document.querySelector('#' + tagInputId);
        if (tag_input.value != '') {
            document.querySelector('#' + tagInputId).classList.remove('bg-danger');
            document.querySelector('#' + tagInputId).classList.remove('placeholder-white');

            let isExist = items.some(e => e.item_value === tag_input.value);

            if (!isExist) {
                items = [...items, {
                    'item_id': items.length + 1,
                    'item_value': tag_input.value
                }];
                setItems(items);
            }
            else {
                setIsExistModal(true);
            }
            tag_input.value = '';
        }
        else {
            document.querySelector('#' + tagInputId).classList.add('bg-danger');
            document.querySelector('#' + tagInputId).classList.add('placeholder-white');
            setTimeout(() => {
                document.querySelector('#' + tagInputId).classList.remove('bg-danger');
                document.querySelector('#' + tagInputId).classList.remove('placeholder-white');
            }, 500);
            document.querySelector('#' + tagInputId).focus();
        }
    }

    const addItemFromModal = () => {
        if (tag_name === '') {
            error.tag_name = true;
        }
        else {
            let isExist = items.some(e => e.item_value === tag_name);

            if (!isExist) {
                items = [...items, {
                    'item_id': items.length + 1,
                    'item_value': tag_name,
                    'item_description': tag_description
                }];
                setItems(items);
            }
            else {
                setAddItemModal(false);
                setIsExistModal(true);
            }

            error.tag_name = false;
            setTagName('');
            setTagDescription('');
            setAddItemModal(false);
        }
    }

    const deleteItem = (item_id) => {
        let newArr = items.filter(deleteItem => deleteItem.item_id !== item_id);
        setItems(newArr);
    }

    const openAddItemModal = () => {
        setAddItemModal(true);
    }

    useEffect(() => {
        const element = ref.current;

        element?.addEventListener("keyup", ({ key }) => {
            if (key === "Enter") {
                addItem();
            }
        });
    }, []);

    return (
        <>
            <div className={(with_description === true ? "tag-wrap tag-wrap-full " : "tag-wrap ") + className}>
                {
                    items.length > 0 &&
                    items?.map(item => (
                        with_description === true
                            ?
                            <div key={item.item_id} className={'tag ' + tagClass}>
                                <div className="flex justify-between items-center mb-2">
                                    <h6 className="mb-0">{item.item_value}</h6>
                                    <button title={intl.formatMessage({ id: "delete" })} onClick={e => deleteItem(item.item_id)} className='text-inactive text-xl' type='button'><AiOutlineCloseCircle /></button>
                                </div>
                                <span>{item.item_description}</span>
                            </div>
                            :
                            <div key={item.item_id} className={'tag ' + tagClass}>
                                <span className='mr-1'>{item.item_value}</span>
                                <button title={intl.formatMessage({ id: "delete" })} onClick={e => deleteItem(item.item_id)} className='text-inactive text-base' type='button'><AiOutlineCloseCircle /></button>
                            </div>
                    ))
                }

                {!with_description
                    ?
                    <div className='flex gap-2'>
                        <input ref={ref} id={tagInputId} className='border border-corp rounded-lg px-2 w-full text-sm duration-200 ease-in' type="text" title={intl.formatMessage({ id: "write_here_and_then_press_enter" })} placeholder={intl.formatMessage({ id: "write_here_and_then_press_enter" }) + '...'} />
                        <button onClick={e => addItem()} className='btn btn-sm btn-light' type='button'><AiOutlinePlusCircle /> <span>{intl.formatMessage({ id: "add" })}</span></button>
                    </div>
                    :
                    <button onClick={e => openAddItemModal()} className='btn btn-sm btn-light' type='button'><AiOutlinePlusCircle /> <span>{intl.formatMessage({ id: "add" })}</span></button>
                }
            </div>
            <label>{intl.formatMessage({ id: label })}</label>

            {message &&
                <Modal
                    show={is_exist_modal}
                    onClose={() => setIsExistModal(false)}
                    modal_title={intl.formatMessage({ id: "message" })}
                    modal_size="modal-lg"
                >
                    <div className="modal-body">
                        <p className="mb-0">{message}</p>
                    </div>
                </Modal>
            }

            {with_description === true &&
                <Modal
                    show={add_item_modal}
                    onClose={() => setAddItemModal(false)}
                    modal_title={modal_title}
                    modal_size="modal-xl"
                >
                    <div className="modal-body">
                        <div className="form-group-border label-active active mt-4">
                            <AiOutlineFileDone />
                            <input onInput={e => setTagName(e.target.value)} value={tag_name} placeholder=" " type="text" />
                            <label className={error.tag_name && 'label-error'}>{error.tag_name ? intl.formatMessage({ id: "title_error" }) : intl.formatMessage({ id: "title" })}</label>
                        </div>

                        <div className="form-group-border label-active active mt-4 mb-4">
                            <AiOutlineFileDone />
                            <textarea cols="20" onInput={e => setTagDescription(e.target.value)} value={tag_description} placeholder=" "></textarea>
                            <label className={error.tag_description && 'label-error'}>{error.tag_description ? error.tag_description : intl.formatMessage({ id: "description" })}</label>
                        </div>

                        <button onClick={e => { addItemFromModal() }} className="btn btn-outline-primary" type="button"><AiOutlinePlus /> <span>{intl.formatMessage({ id: "add" })}</span></button>
                    </div>
                </Modal>
            }
        </>
    );
};

export default AddTag;