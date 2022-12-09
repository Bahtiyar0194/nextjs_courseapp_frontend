import ThemeChanger from "../../ui/ThemeChanger";
const MainHeader = () => (
    <div className="custom-container">
        <div className="flex items-center justify-between py-4">
            <h2 className="mb-0">Todo List</h2>
            <ThemeChanger />
        </div>
    </div>
);

export default MainHeader;