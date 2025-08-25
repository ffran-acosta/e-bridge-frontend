// import DoctorDashboard from '@/components/dashboard/doctor/DoctorDashboard';

// export default function DoctorPage() {

//     return <DoctorDashboard />;
// }

import { AuthGuard } from "@/components/auth/AuthGuard";

export default function DoctorPage() {
    return (
        <AuthGuard allowedRoles={["SUPER_ADMIN", "ADMIN", "DOCTOR"]}>
            <div>DASHBOARD - DOCTOR</div>
        </AuthGuard>
    );
}