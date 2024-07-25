"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar.jsx";
import { UserProvider } from "./context/UserContext.jsx";  // Add this import

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html className="h-screen" lang="en">
      <body className={inter.className}>
        <UserProvider>
          <div className="flex flex-row">
            <Navbar />
            <div className="w-screen pl-24">
              {children}
            </div>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
