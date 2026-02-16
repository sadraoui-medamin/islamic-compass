import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";
import SettingsDrawer from "./SettingsDrawer";

const AppLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      <SettingsDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
      <main className="flex-1 bottom-nav-safe">
        <Outlet context={{ openDrawer: () => setDrawerOpen(true) }} />
      </main>
      <BottomNav onSettingsClick={() => setDrawerOpen(true)} />
    </div>
  );
};

export default AppLayout;
