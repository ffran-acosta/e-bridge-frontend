import { AuthProvider } from "@/providers/AuthProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "e-Bridge",
    description: "Login & Register",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen antialiased">
            <AuthProvider>{children}</AuthProvider>
        </div>
    );
}
