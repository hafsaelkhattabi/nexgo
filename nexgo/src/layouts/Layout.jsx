import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { cn } from "../lib/utils";

const Layout = ({ children, className }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className={cn("flex-1 overflow-auto p-6", className)}>
          <div className="mx-auto w-full max-w-7xl animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
