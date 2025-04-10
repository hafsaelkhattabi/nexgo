import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import { CreditCard, Home, Menu, PanelRight, UtilityPole } from "lucide-react";
import MenuManagement from "./Menu"; // Import the MenuManagement component

const SidebarLink = ({ href, icon, label, active = false }) => (
  <Link
    to={href}
    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary ${active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"}`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

const Sidebar = () => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <aside
      className={`flex flex-col border-r border-border/40 bg-card/50 transition-all duration-300 ${collapsed ? "w-[70px]" : "w-[240px]"}`}
    >
      <div className="flex h-16 items-center border-b border-border/40 px-4">
        <Link to="/restaurant/dashboard" className="flex items-center gap-2">
          {!collapsed && (
            <span className="text-xl font-semibold tracking-tight">Cuisine</span>
          )}
          {collapsed && <span className="text-xl font-semibold">C</span>}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          {collapsed ? <PanelRight className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <nav className="flex-1 overflow-auto p-4">
        <div className="space-y-2">
          <SidebarLink
            href="/restaurant/dashboard"
            icon={<Home className="h-5 w-5" />}
            label="Dashboard"
            active
          />
          <SidebarLink
            href="/menu"
            icon={<UtilityPole className="h-5 w-5" />}
            label="Menu Management"
          />
          <SidebarLink
            href="/orders"
            icon={<CreditCard className="h-5 w-5" />}
            label="Orders"
          />
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
