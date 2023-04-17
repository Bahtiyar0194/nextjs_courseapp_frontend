import Link from "next/link";
const MainNavigationMenu = ({className}) => {
    return (
        <>
            <Link className={className} href={'/'}>Решения</Link>
            <Link className={className} href={'/'}>Функционал</Link>
            <Link className={className} href={'/'}>Тарифы</Link>
            <Link className={className} href={'/'}>О WebTeach</Link>
        </>
    )
}

export default MainNavigationMenu;