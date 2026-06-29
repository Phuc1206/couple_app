import { ArrowLeft, Heart, Siren } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import { useEffect, useState } from "react";
import { clearEmotionSignal, listenEmotionSignal, saveEmotionSignal } from "../../firebase/emotion.service";
import LoveSOSCard from "../Home/components/LoveSOSCard";
import LoveSOSModal from "../Home/components/LoveSOSModal";

const Sos = () => {
  const navigate = useNavigate();
  const currentUser = useUserStore((state) => state.currentUser);

  const [loading, setLoading] = useState(true);
  const [signals, setSignals] = useState<any>(null);
  const [isSignalOpen, setIsSignalOpen] = useState(false);

  const [emotion, setEmotion] = useState("");
  const [reasons, setReasons] = useState<string[]>([]);
  const [needs, setNeeds] = useState<string[]>([]);
  const [level, setLevel] = useState<1 | 2 | 3>(2);
  const [message, setMessage] = useState("");

  const partner = currentUser === "Phuc" ? "Linh" : "Phuc";

  const mySignal = currentUser === "Phuc" ? signals?.phucSignal : signals?.linhSignal;

  const partnerSignal = currentUser === "Phuc" ? signals?.linhSignal : signals?.phucSignal;

  useEffect(() => {
    const unsub = listenEmotionSignal((data) => {
      setSignals(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleDeleteEmotion = async () => {
    await clearEmotionSignal(currentUser);
  };

  const handleSaveSignal = async () => {
    await saveEmotionSignal(currentUser, {
      emotion,
      reasons,
      needs,
      level,
      message,
      updatedAt: new Date().toISOString()
    });

    setEmotion("");
    setReasons([]);
    setNeeds([]);
    setLevel(2);
    setMessage("");

    setIsSignalOpen(false);
  };

  const hasNoSignal = !mySignal && !partnerSignal;

  return (
    <>
      <div className="animate-fade-in relative flex h-[500px] w-[340px] flex-col bg-[#160c0e] p-2 text-white select-none">
        {/* HEADER */}
        <div className="mb-3 flex items-center gap-2 border-b border-white/5 pb-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg p-1 text-white/40 transition-all hover:bg-white/5 hover:text-white active:scale-95"
          >
            <ArrowLeft size={16} />
          </button>

          <div className="flex items-center gap-1.5">
            <Siren size={16} className="text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.4)]" />
            <span className="text-[14px] font-bold tracking-wide">LOVE SOS</span>
          </div>
        </div>

        {/* BODY */}
        <div className="flex h-full min-h-0 w-full scrollbar-none flex-col space-y-4 overflow-y-auto pr-1">
          {/* LOADING */}
          {loading && (
            <div className="flex h-full flex-col items-center justify-center text-[12px] text-white/30">
              <Heart size={18} className="mb-2 animate-spin text-pink-400" />
              Đang kết nối cảm xúc của hai bạn...
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && hasNoSignal && (
            <div className="flex flex-col items-center justify-center py-8 text-center text-white/30">
              <Siren size={22} className="mb-2 animate-pulse text-pink-400/60" />

              <div className="text-sm font-medium text-white/40">Chưa có tín hiệu nào</div>

              <div className="mb-4 text-[11px] text-white/20">Gửi cảm xúc đầu tiên cho người ấy 💕</div>

              {/* CTA BUTTON */}
              <button
                onClick={() => setIsSignalOpen(true)}
                className="rounded-full border border-pink-400/30 bg-pink-500/20 px-4 py-2 text-[12px] font-medium text-pink-300 transition-all hover:bg-pink-500/30 active:scale-95"
              >
                💌 Gửi tín hiệu SOS
              </button>
            </div>
          )}

          {/* CARD */}
          {!loading && !hasNoSignal && (
            <div className="flex flex-col gap-3">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 shadow-lg backdrop-blur-md">
                <LoveSOSCard
                  partner={partner}
                  partnerSignal={partnerSignal}
                  mySignal={mySignal}
                  onOpen={() => setIsSignalOpen(true)}
                  onClear={handleDeleteEmotion}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {isSignalOpen && (
        <LoveSOSModal
          reasons={reasons}
          setReasons={setReasons}
          onSave={handleSaveSignal}
          open={isSignalOpen}
          onClose={() => setIsSignalOpen(false)}
          emotion={emotion}
          setEmotion={setEmotion}
          needs={needs}
          setNeeds={setNeeds}
          message={message}
          setMessage={setMessage}
        />
      )}
    </>
  );
};

export default Sos;
