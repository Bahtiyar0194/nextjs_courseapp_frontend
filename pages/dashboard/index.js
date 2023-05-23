import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useSelector } from "react-redux";

export default function Dashboard() {
    const user = useSelector((state) => state.authUser.user);
    const school = useSelector((state) => state.school.school_data);
    
    return (
        <DashboardLayout title="Dashboard">
            {user.first_name}
            {school.school_name}
        </DashboardLayout>
    );
}