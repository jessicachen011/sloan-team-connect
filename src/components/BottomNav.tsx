import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, MessageCircle, Search, User } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", icon: Home, path: "/home" },
  { label: "Messages", icon: MessageCircle, path: "/messages" },
  { label: "Search", icon: Search, path: "/search" },
  { label: "Profile", icon: User, path: "/profile" },
];

const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { conversations } = useApp();

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 h-[68px]">
        {navItems.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname === path || location.pathname.startsWith(path + "/");
          const isMsgs = label === "Messages";
          return (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-xl transition-all duration-150",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={isActive ? "text-primary" : ""}
                />
                {isMsgs && totalUnread > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                    {totalUnread}
                  </span>
                )}
              </div>
              <span className={cn("text-[10px] font-medium leading-none", isActive ? "text-primary" : "")}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
