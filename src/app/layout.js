import { Suspense } from "react";
import "./globals.css";
import HideNavbar from "@/components/HideNavbar";
import Footer from "@/components/Footer"
export const metadata = {
  title: "EDUKIND — AI Learning Platform",
  description: "Learn, Build, and Impact with AI Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#050714]">
        <Suspense fallback={null}>
          <HideNavbar />
        </Suspense>
        <main className="flex-1 px-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}