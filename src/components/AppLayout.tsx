import { useState } from "react";
import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import SettingsDrawer from "./SettingsDrawer";

const AppLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isFullscreenReading, setIsFullscreenReading] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      <SettingsDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
      <main className={`flex-1 overflow-y-auto ${isFullscreenReading ? "" : "bottom-nav-safe"}`}>
        <Outlet context={{ openDrawer: () => setDrawerOpen(true), setIsFullscreenReading }} />
      </main>
      {!isFullscreenReading && <BottomNav onSettingsClick={() => setDrawerOpen(true)} />}
    </div>
  );
};

export default AppLayout;
