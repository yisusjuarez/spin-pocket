import type { Metadata } from "next";
import { Navbar } from "@/components/navbar/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spin Pocket",
  description: "Mini wallet app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 font-sans antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
