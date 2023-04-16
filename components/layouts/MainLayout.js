import Header from "./Header";
import Locales from "../ui/Locales";
import Link from "next/link";
import { AiOutlineUser, AiOutlineUserAdd } from "react-icons/ai";
import { useIntl } from "react-intl";
import { useSelector, useDispatch } from "react-redux";
import { authenticate } from "../../store/slices/userSlice";
import { useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import ThemeChanger from "../ui/ThemeChanger";
import DefaultLogo from "../ui/Logo";

export default function MainLayout(props) {
  const intl = useIntl();
  const user = useSelector((state) => state.authUser.user);

  const dispatch = useDispatch();
  useEffect(() => {
    if (typeof window !== undefined) {
      async function getMe() {
        await axios.get('auth/me')
          .then(response => {
            dispatch(authenticate(response.data.user));
          }).catch(err => {
            if (err.response) {
              if (err.response.status == 401) {
                dispatch(authenticate([]));
                Cookies.remove('token');
              }
            }
          });
      }
      getMe();
    }
  }, []);

  return (
    <>
      <Header title={props.title} />
      <div className="main__header border-b-active">
        <div className="bg-active">
          <div className="custom-container">
            <div className="flex items-center justify-between py-6">
              <DefaultLogo />
              <div className="flex gap-x-10 gap-y-2 font-medium">
                <Link href={'/'}>Главная</Link>
                <Link href={'/'}>Решения</Link>
                <Link href={'/'}>Функционал</Link>
                <Link href={'/'}>Тарифы</Link>
              </div>
              <div className="btn-wrap-lg items-center">
                <Locales />
                <ThemeChanger />
                {user?.user_id
                  ?
                  <Link className="btn btn-outline-primary" href={'/dashboard'}><AiOutlineUser /><span>{user?.first_name}</span></Link>
                  :
                  <>
                    <Link className="btn long btn-light" href={'/login'}><AiOutlineUser /><span>{intl.formatMessage({ id: "page.login.button" })}</span></Link>
                    <Link className="btn long btn-outline-primary" href={'/registration'}><AiOutlineUserAdd /><span>{intl.formatMessage({ id: "page.registration.title" })}</span></Link>
                  </>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      {props.children}
    </>
  );
}