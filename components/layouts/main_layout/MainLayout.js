import Head from "next/head";
import MainHeader from "./MainHeader";
import MainFooter from "./MainFooter";



const MainLayout = props => (
  <>
      <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"/>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" />
        <title>{props.title}</title>
      </Head>
      <MainHeader />
      <div>
        {props.children}
      </div>
      <MainFooter />
  </>
);

export default MainLayout;