import { Sparkles } from "lucide-react";

interface Props {
  data: any;
  isEditingWidget: boolean;
  setIsEditingWidget: (value: boolean) => void;
  widgetInput: any;
  setWidgetInput: (value: any) => void;
  onSaveWidget: (data: any) => void;
}
const WidgetCard = ({ data: homeData, isEditingWidget, setIsEditingWidget, widgetInput, setWidgetInput, onSaveWidget }: Props) => {
  return (
    <>
      <div className="flex flex-col rounded-2xl border border-white/5 bg-[#2a1b1d]/40 p-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/40">
            <Sparkles size={12} className="text-pink-400" />
            <span>Góc nhắn gửi ngọt ngào 💭</span>
          </div>
          {isEditingWidget ? (
            <button
              onClick={() => {
                setIsEditingWidget(false);
                onSaveWidget(widgetInput);
              }}
              className="text-[10px] font-bold text-pink-400 hover:underline"
            >
              Xong
            </button>
          ) : (
            <button onClick={() => setIsEditingWidget(true)} className="text-[10px] font-bold text-white/30 hover:text-white/60">
              Sửa
            </button>
          )}
        </div>
        <div className="mt-3">
          {isEditingWidget ? (
            <textarea
              value={widgetInput}
              onChange={(e) => setWidgetInput(e.target.value)}
              maxLength={100}
              rows={2}
              className="w-full resize-none rounded-xl border border-white/10 bg-black/20 p-2 text-[13px] text-white outline-none placeholder:text-white/20"
              placeholder="Viết gì đó cho người iu thấy đi..."
            />
          ) : (
            <p className="text-[13px] leading-relaxed whitespace-pre-wrap text-white/80 italic">
              "{homeData?.widgetText || "Hãy viết những lời ngọt ngào tại đây..."}"
            </p>
          )}
          {homeData?.widgetUpdatedBy && (
            <span className="mt-2 block text-right text-[9px] tracking-wider text-white/20 uppercase">
              Cập nhật bởi: {homeData.widgetUpdatedBy === "Phuc" ? "Phúc" : "Linh"}
            </span>
          )}
        </div>
      </div>
    </>
  );
};
export default WidgetCard;
