import API_URL from "../../config/api";
const UserAvatar = ({ user_avatar, className, padding }) => {
    return (
        <div className={"rounded-full border-inactive w-fit h-fit p-" + (padding ? padding : 0.5)}>
            {user_avatar
                ?
                <div style={{ 'backgroundImage': 'url(' + API_URL + '/auth/get_avatar/' + user_avatar + ')' }} className={"bg-cover bg-no-repeat bg-center rounded-full " + className}>

                </div>
                :
                <div className={"rounded-full bg-corp flex items-center justify-center text-white text-xl overflow-hidden " + className}>
                    <img className="w-2/3" src="/avatar/default.svg" />
                </div>
            }
        </div>
    );
};

export default UserAvatar;