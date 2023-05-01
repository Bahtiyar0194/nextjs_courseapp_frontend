import API_URL from '../../config/api';
import { Player } from 'video-react';
import "../../node_modules/video-react/dist/video-react.css";
import ReactAudioPlayer from 'react-audio-player';

const PreviewFileModal = ({ file }) => {
    return (
        <div className="modal-body mt-4">
            {file.file_type_id == 1 &&
                <Player playsInline src={API_URL + '/media/video/' + file.file_id} />
            }

            {file.file_type_id == 2 &&
                <iframe width="100%" height="100%" src={file.file_target}></iframe>
            }

            {file.file_type_id == 3 &&
                <ReactAudioPlayer width="100%" src={API_URL + '/media/audio/' + file.file_id} controls />
            }

            {file.file_type_id == 4 &&
                <img src={API_URL + '/media/image/' + file.file_id} />
            }
        </div>
    );
};

export default PreviewFileModal;