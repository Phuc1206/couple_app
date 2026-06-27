import { Siren } from "lucide-react";
import { emotionMap, needMap, reasonMap } from "../../../constant/variable";
import { formatSignalTime } from "../../../utils/dateUtils";

interface Props {
  partner: string;
  mySignal?: any;
  partnerSignal?: any;

  onOpen: () => void;
  onClear: () => void;
}

const LoveSOSCard = ({ partner, mySignal, partnerSignal, onOpen, onClear }: Props) => {
  const hasMySignal = !!mySignal;
  const hasPartnerSignal = !!partnerSignal;

  return (
    <div
      className={`relative rounded-3xl border p-4 backdrop-blur-xl transition-all ${
        hasMySignal ? "border-red-500/20 bg-red-500/5" : "border-white/5 bg-white/[0.03]"
      }`}
    >
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-red-500/10 blur-3xl" />

      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <Siren size={14} className="text-red-400" />

          <span className="text-[11px] font-semibold tracking-[3px] text-red-300/60 uppercase">LOVE SOS</span>
        </div>

        <button
          onClick={hasMySignal ? onClear : onOpen}
          className={`mt-4 flex h-24 w-24 items-center justify-center rounded-full text-xl font-black transition-all ${
            hasMySignal
              ? "bg-emerald-500 text-white shadow-[0_0_40px_rgba(16,185,129,0.6)]"
              : "bg-red-500 text-white shadow-[0_0_40px_rgba(239,68,68,0.5)]"
          }`}
        >
          {hasMySignal ? "OK" : "SOS"}
        </button>

        <p className="mt-3 text-center text-[11px] text-white/40">
          {hasMySignal ? "Nhấn khi bạn đã ổn hơn" : "Nhấn khi bạn muốn phát ra tín hiệu"}
        </p>
      </div>

      {/* Mình đang SOS */}
      {hasMySignal && (
        <div className="mt-5 rounded-2xl border border-red-500/10 bg-black/20 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-2xl">
              {emotionMap[mySignal.emotion]?.split(" ")[0]}
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-white">🤍 Bạn đang phát tín hiệu SOS</p>

              <p className="mt-1 text-xs text-white/50">Bạn đang cảm thấy {emotionMap[mySignal.emotion]}</p>
            </div>
          </div>

          {mySignal.message && (
            <div className="mt-4 rounded-xl bg-white/5 p-3">
              <p className="text-xs text-white/80 italic">"{mySignal.message}"</p>
            </div>
          )}
          {mySignal.reasons?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {mySignal.reasons.map((r: string) => (
                <span key={r} className="rounded-full bg-white/5 px-3 py-1 text-[11px] text-white/70">
                  {reasonMap[r]}
                </span>
              ))}
            </div>
          )}
          {mySignal.needs?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {mySignal.needs.map((n: string) => (
                <span key={n} className="rounded-full bg-pink-500/10 px-3 py-1 text-[11px] text-pink-300">
                  {needMap[n]}
                </span>
              ))}
            </div>
          )}

          <p className="mt-4 text-[11px] text-white/30">{formatSignalTime(mySignal.updatedAt)}</p>
        </div>
      )}

      {/* Đối phương đang SOS */}
      {!hasMySignal && hasPartnerSignal && (
        <div className="mt-5 rounded-2xl border border-pink-500/10 bg-black/20 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-500/10 text-2xl">
              {emotionMap[partnerSignal.emotion]?.split(" ")[0]}
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-white">🥺 {partner === "Phuc" ? "Phúc" : "Linh"} đang cần bạn</p>

              <p className="mt-1 text-xs text-white/50">Người ấy đang cảm thấy {emotionMap[partnerSignal.emotion]}</p>
            </div>
          </div>
          {/* Nguyên nhân */}

          {partnerSignal.reasons?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {partnerSignal.reasons.map((r: string) => (
                <span key={r} className="rounded-full bg-white/5 px-3 py-1 text-[11px] text-white/70">
                  {reasonMap[r]}
                </span>
              ))}
            </div>
          )}
          {/* Người ấy cần gì */}

          {partnerSignal.needs?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {partnerSignal.needs.map((n: string) => (
                <span key={n} className="rounded-full bg-pink-500/10 px-3 py-1 text-[11px] text-pink-300">
                  {needMap[n]}
                </span>
              ))}
            </div>
          )}

          {/* Tin nhắn */}

          {partnerSignal.message && (
            <div className="mt-4 rounded-xl bg-white/5 p-3">
              <p className="text-xs text-white/80 italic">"{partnerSignal.message}"</p>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <p className="text-[11px] text-white/30">{formatSignalTime(partnerSignal.updatedAt)}</p>
          </div>
        </div>
      )}

      {!hasMySignal && !hasPartnerSignal && (
        <div className="mt-5 rounded-2xl bg-black/20 p-4">
          <p className="text-center text-xs text-white/50">🌙 Mọi thứ vẫn tuyệt cà là vời</p>
        </div>
      )}
    </div>
  );
};

export default LoveSOSCard;
