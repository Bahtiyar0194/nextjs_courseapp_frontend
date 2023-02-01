import { MdOutlineClose } from "react-icons/md";
const Modal = ({ show, onClose, modal_title, modal_size, children }) => {
    const closeModal = (e) => {
        e.preventDefault();
        onClose();
    };
    
    return (
        <div id="modal" className={'modal-backdrop' + (show === true ? ' show' : '')}>
            <div className={'modal ' + modal_size}>
                <div className="modal-header">
                    <h3 className="mb-0">{modal_title}</h3>
                    <span onClick={closeModal} className="modal-close-button"><MdOutlineClose/></span>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;