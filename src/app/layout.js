
import "./globals.css";
import HideNavbar from "@/components/HideNavbar";

export const metadata = {
  title: "EDUKIND — AI Learning Platform",
  description: "Learn, Build, and Impact with AI Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col">
        <HideNavbar />
        <main className="flex-1 px-12">
          {children}
        </main>
      </body>
    </html>
  );
}
