import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useSelector } from "react-redux";

export default function Dashboard() {
    const user = useSelector((state) => state.authUser.user);
    
    return (
        <DashboardLayout title="Dashboard">
            {user.first_name}
        </DashboardLayout>
    );
}