import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useSelector } from "react-redux";

export default function Dashboard() {
    const user = useSelector((state) => state.authUser.authUser);
    
    return (
        <DashboardLayout title="Dashboard">
            {user.first_name}
        </DashboardLayout>
    );
}