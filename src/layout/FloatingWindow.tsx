import { Outlet } from "react-router-dom";
import BottomNav from "../components/common/BottomNav";

export default function FloatingWindow() {
  return (
    <div className="relative h-screen w-screen overflow-hidden text-white">
      <div className="drag bg-black/0.01 absolute top-0 right-0 left-0 z-50 flex h-12 items-center justify-between px-4">
        <div className="pointer-events-auto h-full w-20" />
        <span className="font-sans text-[11px] font-medium tracking-[2px] text-white/30 select-none">MY LOVE</span>
        <div className="w-20" />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,120,160,0.12),transparent_45%)]" />

      <div className="relative z-10 h-full scrollbar-none px-5 pt-14 pb-32">
        <div className="mx-auto flex min-h-full w-full max-w-[400px] flex-col">
          <Outlet />
        </div>
      </div>

      <div className="no-drag pointer-events-none absolute right-0 bottom-6 left-0 z-50 flex justify-center">
        <div className="pointer-events-auto">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
