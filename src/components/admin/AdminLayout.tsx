import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart, Package, ShoppingBag, Archive, FileText,
  Users, CornerUpLeft, MessageSquare, Tag, TrendingUp, Menu, X
} from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menu = [
    {
      title: "OVERVIEW",
      items: [
        { name: "Dashboard", path: "/admin/dashboard", icon: BarChart }
      ]
    },
    {
      title: "STORE",
      items: [
        { name: "Products", path: "/admin/products", icon: Package },
        { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
        { name: "Invoices", path: "/admin/invoices", icon: FileText }
      ]
    },
    {
      title: "CUSTOMERS",
      items: [
        { name: "Customers", path: "/admin/customers", icon: Users },
        { name: "Issue Tickets", path: "/admin/issues", icon: MessageSquare }
      ]
    },
    {
      title: "MARKETING",
      items: [
        { name: "Discounts", path: "/admin/discounts", icon: Tag }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf9f6] flex relative">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? "w-[240px]" : "w-0"} transition-all duration-300 overflow-hidden bg-[#1a1a1a] text-white flex-shrink-0 min-h-screen border-r border-[#2a2a2a] flex flex-col whitespace-nowrap`}>
        <div className="p-6 pr-4 border-b border-[#2a2a2a] flex items-start justify-between">
          <div className="overflow-hidden">
            <Link to="/" className="font-heading text-sm font-bold tracking-widest block hover:text-gray-300 transition-colors truncate">Designz Men's & Kid's</Link>
            <span className="text-[9px] font-heading tracking-[0.2em] text-muted-foreground uppercase opacity-70">Admin</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 rounded-md hover:bg-white/10 transition-colors flex-shrink-0 ml-2"
            title="Hide sidebar"
          >
            <X size={16} className="text-gray-400 hover:text-white" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6">
          {menu.map((section, idx) => (
            <div key={idx} className="mb-8">
              <h4 className="px-6 text-[10px] font-heading font-bold tracking-widest text-[#666666] mb-3">{section.title}</h4>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname.startsWith(item.path);
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 px-6 py-2 text-xs font-body transition-colors ${isActive
                          ? "bg-[#333333] text-white"
                          : "text-[#888888] hover:text-[#cccccc] hover:bg-[#222222]"
                          }`}
                      >
                        <item.icon size={14} className={isActive ? "text-primary" : ""} />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-[#2a2a2a]">
          <Link to="/" className="flex items-center gap-3 text-xs font-body text-[#888888] hover:text-white transition-colors">
            <CornerUpLeft size={14} className="rotate-[-90deg]" />
            <span>Return to Store</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen relative flex flex-col">
        {!isSidebarOpen && (
          <div className="flex-none p-6 pb-0 flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors bg-white border border-border shadow-sm"
              title="Show sidebar"
            >
              <Menu size={20} className="text-foreground" />
            </button>
          </div>
        )}
        <div className={`flex-1 ${!isSidebarOpen ? 'px-10 pb-10 pt-6' : 'p-10'}`}>
          {children}
        </div>
      </main>
    </div>
  );
}
