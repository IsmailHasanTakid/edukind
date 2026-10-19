import "./globals.css";
import Navbar from "@/components/navbar";

export const metadata = {
  title: "EDUKIND — AI Learning Platform",
  description: "Learn, Build, and Impact with  AI Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}