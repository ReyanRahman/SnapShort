import type { Metadata } from "next";

import { AuthProvider } from "@/components/auth/auth-provider";
import { SiteHeader } from "@/components/layout/site-header";

import "./globals.css";

export const metadata: Metadata = {
  title: "SnapShort",
  description: "Shorten, track, and share links with analytics and teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#f7f4ef] text-[#111111]">
        <AuthProvider>
          <div className="min-h-screen">
            <SiteHeader />
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
