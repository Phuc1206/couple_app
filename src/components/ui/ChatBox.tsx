import { useState, useEffect, useRef } from "react";
import { Image, Smile, Send, Phone, Video, Info } from "lucide-react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { useMessages } from "../../hooks/useMessages";
import dayjs from "dayjs";
import { useUserStore } from "../../store/userStore";

export default function ChatBox() {
  const currentUser = useUserStore((state) => state.currentUser);

  const { messages, sendMessage } = useMessages(currentUser);
  const [value, setValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!value.trim()) return;
    sendMessage(value);
    setValue("");
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[40px] border border-white/5 bg-[#12080a]/60 shadow-[0_24px_80px_rgba(0,0,0,0.8)] backdrop-blur-3xl">
      {/* HEADER: Thông tin của Phúc & Linh */}
      <div className="flex items-center justify-between border-b border-white/5 p-5 pt-7">
        <div className="flex items-center gap-3">
          {/* Avatar đôi lồng nhau góc cạnh tròn */}
          <div className="relative flex h-8 w-14 items-center">
            <div className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#12080a] bg-[#fcd34d] text-xs font-bold text-black">
              P
            </div>
            <div className="absolute left-5 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#12080a] bg-[#f472b6] text-xs font-bold text-black">
              L
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white/90">Phúc & Linh</h3>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
              <span className="text-[11px] text-white/40">online • typing</span>
            </div>
          </div>
        </div>

        {/* Các nút cuộc gọi góc phải */}
        <div className="flex items-center gap-2">
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/70 hover:bg-white/10">
            <Phone size={14} />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/70 hover:bg-white/10">
            <Video size={14} />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/70 hover:bg-white/10">
            <Info size={14} />
          </button>
        </div>
      </div>

      {/* MID: Danh sách tin nhắn */}
      <div className="flex-1 scrollbar-none overflow-y-auto p-4">
        {Object.entries(
          messages.reduce(
            (acc, msg) => {
              const date =
                msg.timestamp instanceof Date
                  ? msg.timestamp
                  : msg.timestamp?.seconds
                    ? new Date(msg.timestamp.seconds * 1000)
                    : new Date();

              const dateKey = dayjs(date).format("YYYY-MM-DD");

              if (!acc[dateKey]) {
                acc[dateKey] = [];
              }

              acc[dateKey].push({
                ...msg,
                parsedDate: date
              });

              return acc;
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {} as Record<string, any[]>
          )
        ).map(([date, msgs]) => {
          const formattedDate = dayjs(date).isSame(dayjs(), "day")
            ? "Hôm nay"
            : dayjs(date).isSame(dayjs().subtract(1, "day"), "day")
              ? "Hôm qua"
              : dayjs(date).format("DD/MM/YYYY");

          return (
            <div key={date} className="space-y-4">
              {/* Header ngày */}
              <div className="my-4 flex justify-center">
                <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-medium tracking-[1px] text-white/30">
                  {formattedDate}
                </span>
              </div>

              {/* Messages */}
              {msgs.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  text={msg.content}
                  isMine={msg.sender === currentUser}
                  time={dayjs(msg.parsedDate).format("HH:mm")}
                />
              ))}
            </div>
          );
        })}

        {/* Typing */}
        <div className="pt-2">
          <TypingIndicator />
        </div>

        {/* Auto scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* BOTTOM: Thanh gõ tin nhắn siêu đẹp */}
      <div className="p-4 pb-6">
        <div className="flex items-center gap-2 rounded-3xl border border-white/5 bg-white/5 p-2 pl-4 shadow-inner backdrop-blur-xl">
          <button className="text-white/40 transition-colors hover:text-white/80">
            <Image size={18} />
          </button>
          <button className="mr-1 text-white/40 transition-colors hover:text-white/80">
            <Smile size={18} />
          </button>

          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Write something sweet..."
            className="flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-white/30"
          />

          <button
            onClick={handleSend}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fca5a5] text-black shadow-md transition-all active:scale-95"
          >
            <Send size={14} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
