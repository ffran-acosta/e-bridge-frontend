import type { Metadata } from "next";
import Providers from "./providers";

export const metadata: Metadata = {
    title: "E-Bridge",
    description: "Login & Register",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es" className="h-full">
            <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
