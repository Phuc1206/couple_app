import { Heart } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  viewMode: "days" | "seconds";
  setViewMode: () => void;

  loveTime: any;
  loveTimeDetailed: any;
}
const LoveCounterCard = ({ viewMode, setViewMode, loveTime, loveTimeDetailed }: Props) => {
  return (
    <>
      <button
        onClick={setViewMode}
        className="group relative flex w-full flex-col items-center justify-center rounded-[32px] border border-white/5 bg-gradient-to-b from-pink-500/10 to-transparent p-6 text-center shadow-md backdrop-blur-xl transition-all duration-300 hover:border-pink-500/20 active:scale-[0.99]"
      >
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-pink-500/20 text-pink-400 transition-transform duration-500 group-hover:scale-110">
          <Heart size={28} className="animate-pulse fill-pink-500/40" />
        </div>

        {viewMode === "days" ? (
          <div className="animate-fade-in w-full">
            <h2 className="mt-3 bg-gradient-to-r from-pink-300 via-rose-300 to-amber-200 bg-clip-text text-2xl font-black tracking-wider text-transparent">
              {loveTime.totalDays} NGÀY
            </h2>
            <p className="mt-1 text-[11px] font-medium tracking-[1px] text-white/40 uppercase">
              {loveTime.years > 0 && `${loveTime.years} năm `}
              {loveTime.months > 0 && `${loveTime.months} tháng `}
              {loveTime.days} ngày bên nhau
            </p>
          </div>
        ) : (
          <div className="animate-fade-in w-full">
            <h2 className="mt-3 bg-gradient-to-r from-pink-200 via-rose-300 to-amber-200 bg-clip-text font-mono text-xl font-black tracking-wide text-transparent">
              {loveTimeDetailed.displayHours}h {loveTimeDetailed.displayMinutes}m{" "}
              <span className="inline-block min-w-[28px] text-left text-pink-400">
                {String(loveTimeDetailed.displaySeconds).padStart(2, "0")}s
              </span>
            </h2>
            <p className="mt-1 truncate px-2 font-mono text-[10px] tracking-[0.5px] text-white/30">
              Tương đương: {loveTimeDetailed.totalSeconds.toLocaleString()} giây yêu nhau
            </p>
          </div>
        )}

        <span className="absolute bottom-2 text-[8px] tracking-wider text-white/10 uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Click để đổi chế độ xem 🔄
        </span>
      </button>
    </>
  );
};

export default LoveCounterCard;
