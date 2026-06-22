import { Smile } from "lucide-react";
import { moodList } from "../../../constant/variable";
import { useEffect, useRef, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  partner: "Phuc" | "Linh";
  partnerStatus: any;
  myStatus: any;
  onSelectMood: (mood: string) => void;
}
const MoodCard = ({ partner, partnerStatus, myStatus, onSelectMood }: Props) => {
  const moodMenuRef = useRef<HTMLDivElement>(null);

  const [isMoodOpen, setIsMoodOpen] = useState(false);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moodMenuRef.current && !moodMenuRef.current.contains(event.target as Node)) {
        setIsMoodOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="relative grid grid-cols-2 gap-3">
        <div className="flex flex-col rounded-2xl border border-white/5 bg-white/5 p-3">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${partnerStatus?.online ? "animate-pulse bg-green-400 shadow-[0_0_8px_#4ade80]" : "bg-white/20"}`}
            />
            <span className="text-[11px] font-bold text-white/60">{partner === "Phuc" ? "Phúc" : "Linh"} đang:</span>
          </div>
          <span className="mt-1.5 truncate text-[13px] font-semibold text-pink-300">{partnerStatus?.mood || "✨ Đang yêu"}</span>
        </div>

        <div className="relative" ref={moodMenuRef}>
          <button
            onClick={() => setIsMoodOpen(!isMoodOpen)}
            className={`flex h-full w-full flex-col rounded-2xl border bg-white/5 p-3 text-left transition-all hover:bg-white/[0.08] active:scale-95 ${
              isMoodOpen ? "border-pink-500/30 bg-pink-500/5 shadow-lg" : "border-white/5"
            }`}
          >
            <div className="flex items-center gap-1.5 text-[11px] text-white/40">
              <Smile size={12} className={isMoodOpen ? "text-pink-400" : ""} />
              <span>Tâm trạng của bạn:</span>
            </div>
            <span className="mt-1.5 truncate text-[13px] font-semibold text-amber-200">{myStatus?.mood || "🥰 Đặt trạng thái"}</span>
          </button>

          {isMoodOpen && (
            <div className="animate-fade-in absolute bottom-full left-0 z-40 mb-2 max-h-[170px] w-[155px] scrollbar-none overflow-y-auto rounded-xl border border-white/10 bg-[#160c0ebd]/95 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl">
              <div className="mb-1 border-b border-white/5 px-2 py-1 text-[9px] font-bold tracking-wider text-white/30 uppercase">
                Hôm nay thế nào?
              </div>
              <div className="space-y-0.5">
                {moodList.map((moodItem) => (
                  <button
                    key={moodItem}
                    onClick={() => {
                      setIsMoodOpen(false);
                      onSelectMood(moodItem);
                    }}
                    className={`w-full rounded-lg px-2 py-1.5 text-left text-[12px] font-medium text-white/80 transition-colors hover:bg-pink-500/10 hover:text-pink-400 ${
                      myStatus?.mood === moodItem ? "bg-white/5 font-bold text-amber-200" : ""
                    }`}
                  >
                    {moodItem}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default MoodCard;
