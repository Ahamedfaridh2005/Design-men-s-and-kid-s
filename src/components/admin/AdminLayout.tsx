import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart, Package, ShoppingBag, Archive, FileText,
  Users, CornerUpLeft, MessageSquare, Tag, TrendingUp
} from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();

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
        { name: "Inventory", path: "/admin/inventory", icon: Archive },
        { name: "Invoices", path: "/admin/invoices", icon: FileText }
      ]
    },
    {
      title: "CUSTOMERS",
      items: [
        { name: "Customers", path: "/admin/customers", icon: Users },
        { name: "Returns", path: "/admin/returns", icon: CornerUpLeft },
        { name: "Issue Tickets", path: "/admin/issues", icon: MessageSquare }
      ]
    },
    {
      title: "MARKETING",
      items: [
        { name: "Discounts", path: "/admin/discounts", icon: Tag },
        { name: "Reports", path: "/admin/reports", icon: TrendingUp }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf9f6] flex">
      {/* Sidebar */}
      <aside className="w-[200px] bg-[#1a1a1a] text-white flex-shrink-0 min-h-screen border-r border-[#2a2a2a] flex flex-col">
        <div className="p-6 border-b border-[#2a2a2a]">
          <Link to="/" className="font-heading text-sm font-bold tracking-widest block hover:text-gray-300 transition-colors">Design mens and kids</Link>
          <span className="text-[9px] font-heading tracking-[0.2em] text-muted-foreground uppercase opacity-70">Admin</span>
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
      <main className="flex-1 p-10 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}
