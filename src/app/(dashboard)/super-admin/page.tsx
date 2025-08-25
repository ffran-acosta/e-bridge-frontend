// import SuperAdminDashboard from '@/components/dashboard/super-admin/SuperAdminDashboard';

// export default function SuperAdminPage() {
//     return <SuperAdminDashboard />;
// }

import { AuthGuard } from "@/components/auth/AuthGuard";

export default function SuperAdminPage() {
    return (
        <AuthGuard allowedRoles={["SUPER_ADMIN"]}>
            <div>DASHBOARD - SUPER ADMIN</div>
        </AuthGuard>
    );
}