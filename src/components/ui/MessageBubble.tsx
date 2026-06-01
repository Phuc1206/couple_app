type Props = {
  text: string;
  isMine: boolean;
  time: string;
};

export default function MessageBubble({ text, isMine, time }: Props) {
  return (
    <div className={`flex flex-col gap-1 ${isMine ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[75%] px-4 py-3 text-[15px] leading-relaxed text-white shadow-lg backdrop-blur-md ${
          isMine
            ? `rounded-[20px] rounded-tr-[4px] bg-gradient-to-r from-[#ff9a76]/80 to-[#f96d80]/80`
            : `rounded-[20px] rounded-tl-[4px] border border-white/5 bg-[#2a1b1d]/60`
        } `}
      >
        {text}
      </div>

      {/* Hiển thị thời gian nhắn nhỏ ở dưới */}
      <span className="px-1 text-[11px] text-white/30">{time}</span>
    </div>
  );
}
