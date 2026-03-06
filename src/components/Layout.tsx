import React from "react";
import BottomNav from "./BottomNav";

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showNav = true }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 w-full max-w-lg mx-auto relative">
        {children}
      </div>
      {showNav && <BottomNav />}
    </div>
  );
};

export default Layout;
