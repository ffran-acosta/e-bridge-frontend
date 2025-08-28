import { AuthProvider } from "@/providers/AuthProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "E-Bridge",
    description: "Login & Register",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es" className="h-full">
            <body className="min-h-screen antialiased">
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
