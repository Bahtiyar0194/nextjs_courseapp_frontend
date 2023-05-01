import { IoGridOutline, IoList } from "react-icons/io5";
import { useIntl } from "react-intl";

const ContentViewTypeButtons = ({ contentViewType, setContentViewType }) => {
    const intl = useIntl();

    return (
        contentViewType === 'grid'
            ?
            <button title={intl.formatMessage({ id: "show_as_a_list" })} onClick={() => setContentViewType('list')} className="btn btn-outline-primary">
                <IoList />
            </button>
            :
            contentViewType === 'list'
                ?
                <button title={intl.formatMessage({ id: "show_as_a_table" })} onClick={() => setContentViewType('grid')} className="btn btn-outline-primary">
                    <IoGridOutline />
                </button>
                : ''
    );
};

export default ContentViewTypeButtons;