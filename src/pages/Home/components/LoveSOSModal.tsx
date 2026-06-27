import { ChevronLeft, X } from "lucide-react";
import { useEffect, useState } from "react";
import { emotions, needMap, reasonMap } from "../../../constant/variable";

interface Props {
  open: boolean;
  onClose: () => void;

  emotion: string;
  setEmotion: (v: string) => void;

  reasons: string[];
  setReasons: React.Dispatch<React.SetStateAction<string[]>>;

  needs: string[];
  setNeeds: React.Dispatch<React.SetStateAction<string[]>>;

  message: string;
  setMessage: (v: string) => void;

  onSave: () => void;
}

const LoveSOSModal = ({
  open,
  onClose,

  emotion,
  setEmotion,

  reasons,
  setReasons,

  needs,
  setNeeds,

  message,
  setMessage,

  onSave
}: Props) => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!open) setStep(1);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[340px] rounded-3xl border border-white/10 bg-[#171717]/95 p-5">
        <div className="mb-5 flex items-center justify-between">
          <button onClick={() => step > 1 && setStep(step - 1)} className={`${step === 1 && "invisible"}`}>
            <ChevronLeft size={18} />
          </button>

          <h2 className="text-lg font-bold">🚨 LOVE SOS</h2>

          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* STEP 1 */}

        {step === 1 && (
          <>
            <p className="mb-4 text-sm text-white/70">Hôm nay bạn đang cảm thấy thế nào?</p>

            <div className="grid grid-cols-3 gap-3">
              {emotions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setEmotion(item.id);
                    setStep(2);
                  }}
                  className={`rounded-2xl p-4 transition ${emotion === item.id ? "bg-pink-500 text-black" : "bg-white/5"}`}
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
            <p className="mb-4 text-sm text-white/70">Điều gì làm bạn thấy như vậy?</p>

            <div className="flex flex-wrap gap-2">
              {Object.entries(reasonMap).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => {
                    setReasons((prev) => (prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]));
                  }}
                  className={`rounded-full px-3 py-2 text-xs ${reasons.includes(key) ? "bg-pink-500 text-black" : "bg-white/5"}`}
                >
                  {label as string}
                </button>
              ))}
            </div>

            <button onClick={() => setStep(3)} className="mt-6 w-full rounded-2xl bg-pink-500 py-3 text-black">
              Tiếp
            </button>
          </>
        )}

        {/* STEP 3 */}

        {step === 3 && (
          <>
            <p className="mb-4 text-sm text-white/70">Điều bạn mong người ấy làm</p>

            <div className="flex flex-wrap gap-2">
              {Object.entries(needMap).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => {
                    setNeeds((prev) => (prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]));
                  }}
                  className={`rounded-full px-3 py-2 text-xs ${needs.includes(key) ? "bg-pink-500 text-black" : "bg-white/5"}`}
                >
                  {label as string}
                </button>
              ))}
            </div>

            <button onClick={() => setStep(4)} className="mt-6 w-full rounded-2xl bg-pink-500 py-3 text-black">
              Tiếp
            </button>
          </>
        )}

        {/* STEP 4 */}

        {step === 4 && (
          <>
            <p className="mb-3 text-sm text-white/70">Muốn nhắn gì thêm không?</p>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ví dụ: Hôm nay em hơi mệt, chỉ cần anh ôm em một cái thôi."
              className="h-28 w-full rounded-2xl bg-black/30 p-4 outline-none"
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
