// import AdminDashboard from '@/components/dashboard/admin/AdminDashboard';

// export default function AdminPage() {
//     return <AdminDashboard />;
// }

import { AuthGuard } from "@/components/auth/AuthGuard";

export default function AdminPage() {
    return (
        <AuthGuard allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
            <div>DASHBOARD - ADMIN</div>
        </AuthGuard>
    );
}