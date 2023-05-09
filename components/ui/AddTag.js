import { AiOutlineCloseCircle } from "react-icons/ai";
const AddTag = ({ items, setItems, className, tagClass, intl }) => {

    const addItem = () => {
        let tag_input = document.querySelector('#add-tag-input');
        if (tag_input.value != '') {
            items = [...items, {
                'item_id': items.length + 1,
                'item_value': tag_input.value
            }];
            setItems(items);
            tag_input.value = '';
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
                            <button onClick={e => deleteItem(item.item_id)} className='text-active text-base' type='button'><AiOutlineCloseCircle /></button>
                        </div>
                    ))
                }
                <div className='flex gap-2'>
                    <input id="add-tag-input" className='border-active rounded-lg px-2 w-36 text-sm' type="text" placeholder={intl.formatMessage({ id: "textModal.write_here" }) + '...'} />
                    <button onClick={e => addItem()} className='btn btn-sm btn-outline-primary' type='button'>{intl.formatMessage({ id: "lesson.add" })}</button>
                </div>
            </div>
            <label>{intl.formatMessage({ id: "page.my_courses.form.what_skills_will_this_course_provide" })}</label>
        </>
    );
};

export default AddTag;