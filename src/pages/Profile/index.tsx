import { User, Heart } from "lucide-react";
import { useUserStore } from "../../store/userStore";

export default function Profile() {
  const { currentUser, setCurrentUser } = useUserStore();

  return (
    <div className="animate-fade-in flex h-[500px] w-[340px] flex-col items-center justify-center rounded-[32px] border border-white/5 bg-[#12080a]/60 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.8)] backdrop-blur-3xl">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-500/10 text-pink-400">
        <User size={32} />
      </div>

      <h3 className="text-base font-semibold text-white/90">Ai đang dùng app thế nhỉ? 🤔</h3>
      <p className="mt-1 mb-8 text-[12px] text-white/40">
        Hiện tại: <span className="font-medium text-pink-400">{currentUser === "Phuc" ? "Phúc ❤️" : "Linh 💖"}</span>
      </p>

      {/* NÚT CHỌN USER */}
      <div className="w-full space-y-3">
        <button
          onClick={() => setCurrentUser("Phuc")}
          className={`flex w-full items-center justify-between rounded-2xl border p-4 transition-all ${
            currentUser === "Phuc"
              ? "border-pink-500/50 bg-pink-500/10 text-white"
              : "border-white/5 bg-white/5 text-white/60 hover:border-white/10"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fcd34d] text-xs font-bold text-black">P</div>
            <span className="text-sm font-medium">Mình là Phúc</span>
          </div>
          {currentUser === "Phuc" && <Heart size={14} className="fill-pink-400 text-pink-400" />}
        </button>

        <button
          onClick={() => setCurrentUser("Linh")}
          className={`flex w-full items-center justify-between rounded-2xl border p-4 transition-all ${
            currentUser === "Linh"
              ? "border-pink-500/50 bg-pink-500/10 text-white"
              : "border-white/5 bg-white/5 text-white/60 hover:border-white/10"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-400 text-xs font-bold text-black">L</div>
            <span className="text-sm font-medium">Mình là Linh</span>
          </div>
          {currentUser === "Linh" && <Heart size={14} className="fill-pink-400 text-pink-400" />}
        </button>
      </div>
    </div>
  );
}
