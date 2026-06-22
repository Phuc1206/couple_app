import { Siren } from "lucide-react";
import { emotionMap, needMap } from "../../../constant/variable";
import { formatSignalTime } from "../../../utils/dateUtils";

interface Props {
  partner: string;
  signal?: any;

  onOpen: () => void;
}

const LoveSOSCard = ({ partner, signal, onOpen }: Props) => {
  const hasSignal = !!signal;

  return (
    <div
      className={`relative rounded-3xl border p-4 backdrop-blur-xl transition-all ${
        hasSignal ? "border-red-500/20 bg-red-500/5" : "border-white/5 bg-white/[0.03]"
      } `}
    >
      {/* glow */}
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-red-500/10 blur-3xl" />

      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <Siren size={14} className="text-red-400" />

          <span className="text-[11px] font-semibold tracking-[3px] text-red-300/60 uppercase">LOVE SOS</span>
        </div>

        <button
          onClick={() => onOpen()}
          className={`mt-4 flex h-24 w-24 items-center justify-center rounded-full text-xl font-black transition-all ${
            hasSignal
              ? `animate-pulse bg-red-500 text-white shadow-[0_0_40px_rgba(239,68,68,0.6)]`
              : `bg-red-500/90 text-white shadow-[0_0_25px_rgba(239,68,68,0.3)]`
          } `}
        >
          SOS
        </button>

        <p className="mt-3 text-center text-[11px] text-white/40">Nhấn khi bạn muốn phát ra tín hiệu</p>
      </div>

      {hasSignal ? (
        <div className="mt-5 rounded-2xl border border-red-500/10 bg-black/20 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-2xl">
              {emotionMap[signal.emotion]?.split(" ")[0]}
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-white">🤍 Một mẩu cảm xúc vừa được gửi đến bạn</p>

              <p className="mt-1 text-xs text-white/50">
                {partner === "Phuc" ? "Phúc" : "Linh"} đang cảm thấy {emotionMap[signal.emotion]}
              </p>
            </div>
          </div>

          {signal.message && (
            <div className="mt-4 rounded-xl bg-white/5 p-3">
              <p className="text-xs text-white/80 italic">"{signal.message}"</p>
            </div>
          )}

          {signal.needs?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {signal.needs.map((n: string) => (
                <span key={n} className="rounded-full bg-pink-500/10 px-3 py-1 text-[11px] text-pink-300">
                  {needMap[n]}
                </span>
              ))}
            </div>
          )}

          <p className="mt-4 text-[11px] text-white/30">{formatSignalTime(signal.updatedAt)}</p>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl bg-black/20 p-4">
          <p className="text-center text-xs text-white/50">🌙 Hôm nay {partner === "Phuc" ? "Phúc" : "Linh"} vẫn ổn</p>
        </div>
      )}
    </div>
  );
};

export default LoveSOSCard;
