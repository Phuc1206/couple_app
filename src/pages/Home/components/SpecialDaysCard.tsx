import { Cake, CalendarDays, Heart, Plane, Plus, X } from "lucide-react";
import { getCountdown } from "../../../utils/dateUtils";
interface Props {
  homeData: any;
  setIsModalOpen: (open: boolean) => void;
  onDeleteSpecialDay: (id: string) => void;
}
const SpecialDaysCard = ({ homeData, setIsModalOpen, onDeleteSpecialDay }: Props) => {
  const getDayConfig = (type: "anniversary" | "birthday" | "valentine" | "travel") => {
    switch (type) {
      case "anniversary":
        return { icon: <Heart size={14} className="fill-pink-400/20" />, colorClass: "text-pink-400 bg-pink-500/10 border-pink-500/10" };
      case "birthday":
        return { icon: <Cake size={14} />, colorClass: "text-amber-300 bg-amber-500/10 border-amber-500/10" };
      case "valentine":
        return { icon: <Heart size={14} className="fill-red-400/30" />, colorClass: "text-red-400 bg-red-500/10 border-red-500/10" };
      case "travel":
        return { icon: <Plane size={14} />, colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/10" };
      default:
        return { icon: <CalendarDays size={14} />, colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/10" };
    }
  };
  return (
    <>
      <div className="flex flex-col rounded-2xl border border-white/5 bg-white/[0.02] p-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/40">
            <CalendarDays size={12} className="text-pink-400" />
            <span>Mốc thời gian mong đợi ⏳</span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex h-5 w-5 items-center justify-center rounded-md bg-white/5 text-white/60 transition-all hover:bg-pink-500/20 hover:text-pink-400 active:scale-95"
          >
            <Plus size={12} />
          </button>
        </div>

        <div className="mt-3 max-h-[160px] scrollbar-none space-y-2 overflow-y-auto">
          {homeData?.specialDays && homeData.specialDays.length > 0 ? (
            homeData.specialDays.map((day: any) => {
              const config = getDayConfig(day.type);
              const isRecurring = day.type !== "travel";
              const countdownText = getCountdown(day.date, isRecurring);

              return (
                <div
                  key={day.id}
                  className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-2.5 transition-all hover:border-white/10"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2.5 pr-2">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${config.colorClass}`}>
                      {config.icon}
                    </div>
                    <div className="group/tooltip relative flex min-w-0 flex-col">
                      {/* 🚀 TOOLTIP CHỮ TỰ CHẾ BẰNG TAILWIND (SẼ HIỆN KHI HOVER) */}
                      <div className="pointer-events-none absolute top-full left-0 z-50 mb-1 max-w-[200px] scale-95 rounded-lg border border-white/10 bg-neutral-900/95 px-2 py-1 text-[10px] break-words whitespace-normal text-white/90 opacity-0 shadow-xl transition-all duration-200 group-hover/tooltip:pointer-events-auto group-hover/tooltip:scale-100 group-hover/tooltip:opacity-100">
                        {day.title}
                      </div>

                      {/* Chữ hiển thị gốc của bạn */}
                      <span className="truncate text-[12px] font-medium text-white/90">{day.title}</span>
                      <span className="text-[9px] text-white/30">
                        {new Date(day.date).toLocaleDateString("vi-VN", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${config.colorClass.split(" ")[0]} ${config.colorClass.split(" ")[1]}`}
                    >
                      {countdownText}
                    </span>
                    <div className="flex h-5 w-5 items-center justify-center">
                      <button
                        onClick={() => onDeleteSpecialDay(day.id)}
                        className="rounded-md p-1 text-white/20 opacity-0 transition-all group-hover:opacity-100 hover:text-red-400"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="py-2 text-center text-[11px] text-white/20">Chưa cài đặt ngày đặc biệt nào.</p>
          )}
        </div>
      </div>
    </>
  );
};
export default SpecialDaysCard;
