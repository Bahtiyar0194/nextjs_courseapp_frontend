import API_URL from "../../config/api";
const UserAvatar = ({ user_avatar, className }) => {
    return (
        <div className={"rounded-full flex items-center justify-center border-active " + className}>
            {user_avatar
                ?
                <div style={{ 'backgroundImage': 'url(' + API_URL + '/auth/get_avatar/' + user_avatar + ')' }} className={"bg-cover bg-no-repeat bg-center rounded-full w-full h-full"}>

                </div>
                :
                <div className={"rounded-full bg-corp flex items-center justify-center text-white text-xl w-full h-full overflow-hidden"}>
                    <img className="w-2/3" src="/avatar/default.svg" />
                </div>
            }
        </div>
    );
};

export default UserAvatar;