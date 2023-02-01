import Header from "./Header";
import ThemeChanger from "../ui/ThemeChanger";
import Locales from "../ui/Locales";
import Link from "next/link";

export default function MainLayout(props) {
  return (
    <>
      <Header title={props.title} />
      <div className="bg-active px-2">
        <div className="custom-container">
          <div className="flex items-center justify-between py-6">
            <h2 className="mb-0"><Link href={'/'}>Course App</Link></h2>
            <ThemeChanger />
            <Locales />
            <div className="flex">
              <Link href={'/login'}>Sign in</Link>
              <Link href={'/registration'}>Sign up</Link>
            </div>
          </div>
        </div>
      </div>
      {props.children}
    </>
  );
}