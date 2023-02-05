import Header from "./Header";
export default function ErrorLayout(props) {
    return (
        <>
            <Header title={props.title} />
            <div className="bg-active">
                <div className="custom-container">
                    <div className="h-screen w-full flex items-center justify-center py-6">
                        {props.children}
                    </div>
                </div>
            </div>
        </>
    );
}