import { useIntl } from "react-intl";

const Pagination = ({ items, setItems }) => {
    const intl = useIntl();

    return (
        <div className="col-span-12">
            <div className="pagination">
                {items.current_page > 1 && <button
                    onClick={() => setItems(items.first_page_url)}
                    className={'btn btn-square btn-sm btn-light'}
                    title={intl.formatMessage({ id: "pagination.first_page_title" })}>&#171;</button>}

                {items.links?.map((link, index) => (
                    link.url &&
                    <button
                        key={index}
                        onClick={() => setItems(link.url)}
                        className={'btn btn-square btn-sm ' + (link.active === true ? 'btn-outline-primary disabled' : 'btn-light')}
                        title={
                            link.label === 'pagination.previous' ? intl.formatMessage({ id: "pagination.previous_page_title" }) :
                                link.label === 'pagination.next' ? intl.formatMessage({ id: "pagination.next_page_title" }) :
                                    link.label
                        }
                    >
                        {
                            link.label === 'pagination.previous' ? <>&#8249;</> :
                                link.label === 'pagination.next' ? <>&#8250;</> :
                                    link.label
                        }
                    </button>
                ))}

                {items.last_page > items.current_page && <button
                    onClick={() => setItems(items.last_page_url)}
                    className={'btn btn-square btn-sm btn-light'}
                    title={intl.formatMessage({ id: "pagination.last_page_title" })}>&#187;</button>}
            </div>
        </div>
    );
};

export default Pagination;