import { useState } from "react";
import Header from "./Header";
import Locales from "../ui/Locales";
import ThemeChanger from "../ui/ThemeChanger";
import DefaultLogo from "../ui/Logo";
import MainNavigationMenu from "../main-header/MainNavigationMenu";
import AuthNavigationMenu from "../main-header/AuthNavigationMenu";
import StickyBox from "react-sticky-box";
import { useSelector, useDispatch } from "react-redux";
import { authenticate } from "../../store/slices/userSlice";
import { useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useIntl } from "react-intl";

export default function MainLayout(props) {
  const user = useSelector((state) => state.authUser.user);
  const dispatch = useDispatch();
  const [show_hide_main_menu, setShowHideMainMenu] = useState(false);
  const intl = useIntl();

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
      <StickyBox className="relative z-30">
        <div className="border-b-inactive bg-active">
          <div className="custom-container py-6">
            <div className="flex items-center justify-between">
              <DefaultLogo />

              <div className="flex max-lg:hidden gap-x-10 gap-y-2">
                <MainNavigationMenu />
              </div>
              <div className="flex max-lg:hidden gap-4 items-center">
                <Locales />
                <ThemeChanger />
                <AuthNavigationMenu user={user} />
              </div>

              <div className="hidden gap-4 max-lg:flex">
                <Locales />
                <ThemeChanger />
                <button className={'hamburger ' + (show_hide_main_menu === true && 'active')} onClick={() => setShowHideMainMenu(!show_hide_main_menu)}>
                  <span className="ham top"></span>
                  <span className="ham middle"></span>
                  <span className="ham bottom"></span>
                </button>
              </div>
            </div>

            <div className={"hidden pt-6 " + (show_hide_main_menu === true && 'max-lg:flex')}>
              <div className="flex flex-col gap-y-2 w-full">
                <MainNavigationMenu className={'text-lg pb-3 font-medium border-b-inactive'} />
                <div className="flex gap-2 pt-2">
                  <AuthNavigationMenu user={user} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </StickyBox>
      {props.children}
      <section className="bg-active border-t-inactive py-10">
        <div className="custom-container">
          <div className="custom-grid">
            <div className="col-span-12 lg:col-span-4">
              <DefaultLogo />
              <p className="text-xs text-inactive mt-2 mb-4">{intl.formatMessage({ id: "page.home.company_slogan" })}</p>
              <p className="text-inactive mt-2">© {new Date().getFullYear()} WebTeach. {intl.formatMessage({ id: "page.home.all_rights_reserved" })}</p>
            </div>
            <div className="col-span-12 lg:col-span-3">
              <div className="inline-flex flex-col gap-y-2">
                <MainNavigationMenu />
              </div>
            </div>
            <div className="col-span-12 lg:col-span-5">
              <div className="inline-flex flex-col gap-y-2">

              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}