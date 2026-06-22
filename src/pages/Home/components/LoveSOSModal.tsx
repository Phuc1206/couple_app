import { X } from "lucide-react";
import { useState } from "react";
import { emotions, needOptions } from "../../../constant/variable";

interface Props {
  open: boolean;
  onClose: () => void;

  emotion: string;
  setEmotion: (v: string) => void;

  needs: string[];
  setNeeds: React.Dispatch<React.SetStateAction<string[]>>;

  message: string;
  setMessage: (v: string) => void;

  onSave: () => void;
}
const LoveSOSModal = ({ open, onClose, emotion, setEmotion, needs, setNeeds, message, setMessage, onSave }: Props) => {
  const [step, setStep] = useState(1);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[340px] rounded-3xl border border-white/10 bg-[#171717]/95 p-5 shadow-[0_0_50px_rgba(236,72,153,0.15)]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">🚨 LOVE SOS</h2>

          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <p className="mb-4 text-sm text-white/70">Hôm nay bạn sao rồi?</p>

            <div className="grid grid-cols-3 gap-3">
              {emotions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setEmotion(item.id);
                    setStep(2);
                  }}
                  className={`rounded-2xl p-4 transition ${emotion === item.id ? "bg-pink-500 text-black" : "bg-white/5"} `}
                >
                  <div className="text-2xl">{item.emoji}</div>

                  <p className="mt-2 text-xs">{item.label}</p>
                </button>
              ))}
            </div>
          </>
        )}

        {/* STEP 2 */}

        {step === 2 && (
          <>
            <p className="mb-4 text-sm">Điều bạn cần là gì?</p>

            <div className="flex flex-wrap gap-2">
              {needOptions.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setNeeds((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
                  }}
                  className={`rounded-full px-3 py-2 text-xs ${needs.includes(item) ? "bg-pink-500 text-black" : "bg-white/5"} `}
                >
                  {item}
                </button>
              ))}
            </div>

            <button className="mt-6 w-full rounded-2xl bg-pink-500 py-3 text-black" onClick={() => setStep(3)}>
              Tiếp
            </button>
          </>
        )}

        {/* STEP 3 */}

        {step === 3 && (
          <>
            <p className="mb-3 text-sm">Muốn nhắn gì không?</p>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="h-28 w-full rounded-2xl bg-black/30 p-4"
              placeholder="Hôm nay em hơi mệt..."
            />

            <button onClick={onSave} className="mt-5 w-full rounded-2xl bg-red-500 py-3 font-semibold">
              🚨 Gửi tín hiệu
            </button>
          </>
        )}
      </div>
    </div>
  );
};
export default LoveSOSModal;
