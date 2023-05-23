import { AiOutlineCloseCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { useIntl } from "react-intl";
const AddTag = ({ items, setItems, className, tagClass, tagInputId, label }) => {
    const intl = useIntl();

    const addItem = () => {
        let tag_input = document.querySelector('#'+ tagInputId);
        if (tag_input.value != '') {
            document.querySelector('#'+ tagInputId).classList.remove('border-danger');
            items = [...items, {
                'item_id': items.length + 1,
                'item_value': tag_input.value
            }];
            setItems(items);
            tag_input.value = '';
        }
        else{
            document.querySelector('#'+ tagInputId).classList.add('border-danger');
            document.querySelector('#'+ tagInputId).focus();
        }
    }

    const deleteItem = (item_id) => {
        let newArr = items.filter(deleteItem => deleteItem.item_id !== item_id);
        setItems(newArr);
    }

    return (
        <>
            <div className={"tag-wrap " + className}>
                {
                    items.length > 0 &&
                    items?.map(item => (
                        <div key={item.item_id} className={'tag ' + tagClass}>
                            <span className='mr-1'>{item.item_value}</span>
                            <button title={intl.formatMessage({ id: "delete" })} onClick={e => deleteItem(item.item_id)} className='text-inactive text-base' type='button'><AiOutlineCloseCircle /></button>
                        </div>
                    ))
                }
                <div className='flex gap-2'>
                    <input id={tagInputId} className='border border-corp rounded-lg px-2 w-full text-sm' type="text" placeholder={intl.formatMessage({ id: "textModal.write_here" }) + '...'} />
                    <button onClick={e => addItem()} className='btn btn-sm btn-light' type='button'><AiOutlinePlusCircle/></button>
                </div>
            </div>
            <label>{intl.formatMessage({ id: label })}</label>
        </>
    );
};

export default AddTag;