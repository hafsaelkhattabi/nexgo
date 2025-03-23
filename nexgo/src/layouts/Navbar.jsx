import React from "react";
import { Bell, Search } from "lucide-react";

const Navbar = () => {
  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search..."
              className="h-10 w-full rounded-full bg-muted/60 pl-10 pr-4 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="rounded-full p-2 hover:bg-gray-200">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </button>
          <div className="relative">
            <div className="h-9 w-9 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-white font-bold">JD</span>
            </div>
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
