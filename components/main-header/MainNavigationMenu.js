import Link from "next/link";
const MainNavigationMenu = ({className}) => {
    return (
        <>
            <Link className={'font-medium ' + className} href={'/'}>Решения</Link>
            <Link className={'font-medium ' + className} href={'/'}>Функционал</Link>
            <Link className={'font-medium ' + className} href={'/'}>Тарифы</Link>
            <Link className={'font-medium ' + className} href={'/'}>О WebTeach</Link>
        </>
    )
}

export default MainNavigationMenu;