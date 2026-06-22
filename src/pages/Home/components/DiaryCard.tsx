import { BookOpen, Sparkles } from "lucide-react";
import { formatDate } from "../../../firebase/diary.service";
import { useNavigate } from "react-router-dom";

interface Props {
  selectedDiaryDate: string;
  setSelectedDiaryDate: (date: string) => void;
  diaryNote: string;
  setDiaryNote: (note: string) => void;
  diaryLove: string;
  setDiaryLove: (love: string) => void;
  isDiarySaved: boolean;
  setIsDiarySaved: (saved: boolean) => void;
  onSaveDiary: () => void;
}
const DiaryCard = ({
  selectedDiaryDate,
  setSelectedDiaryDate,
  diaryNote,
  setDiaryNote,
  diaryLove,
  setDiaryLove,
  isDiarySaved,
  setIsDiarySaved,
  onSaveDiary
}: Props) => {
  const navigate = useNavigate();

  return (
    <>
      {" "}
      <div className="flex flex-col rounded-2xl border border-white/5 bg-gradient-to-br from-amber-500/[0.03] to-pink-500/[0.03] p-4 shadow-md">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/40">
            <Sparkles size={12} className="text-amber-300" />
            <span>Nhật ký khoảnh khắc hôm nay 📖</span>
          </div>

          {/* 🚀 NÚT CHUYỂN TAB XEM LẠI SỔ KỶ NIỆM TIMELINE */}
          <button
            onClick={() => navigate("/diary")}
            className="flex items-center gap-1 rounded-md bg-pink-500/10 px-2 py-0.5 text-[10px] font-bold text-pink-400 transition-all hover:bg-pink-500/20 active:scale-95"
          >
            <BookOpen size={10} />
            <span>Xem sổ 📖</span>
          </button>
        </div>

        <div className="mt-3 space-y-2.5">
          <div className="space-y-1">
            <label className="text-[9px] font-medium text-white/30">Viết cho ngày</label>

            <input
              type="date"
              value={selectedDiaryDate}
              max={formatDate()}
              onChange={(e) => setSelectedDiaryDate(e.target.value)}
              className="w-full rounded-xl border border-white/5 bg-black/25 p-2 text-[12px] text-white outline-none"
            />
          </div>
          {/* Ô 1: Note ngắn hôm nay */}
          <div className="space-y-1">
            <label className="text-[9px] font-medium text-white/30">Hôm nay thế nào?</label>
            <input
              type="text"
              disabled={isDiarySaved}
              value={diaryNote}
              onChange={(e) => setDiaryNote(e.target.value)}
              placeholder="Ví dụ: Hôm nay em nấu mì ngon vãi... 😭"
              className="w-full rounded-xl border border-white/5 bg-black/25 p-2 text-[12px] text-white outline-none placeholder:text-white/20 disabled:opacity-60"
            />
          </div>

          {/* Ô 2: Điều thích ở đối phương hôm nay */}
          <div className="space-y-1">
            <label className="text-[9px] font-medium text-pink-300/40">Điều thích nhất ở bạn kia hôm nay? ❤️</label>
            <input
              type="text"
              disabled={isDiarySaved}
              value={diaryLove}
              onChange={(e) => setDiaryLove(e.target.value)}
              placeholder="Ví dụ: Thích lúc Linh cười lúc đón tui đi làm về"
              className="w-full rounded-xl border border-white/5 bg-black/25 p-2 text-[12px] text-white outline-none placeholder:text-white/20 disabled:opacity-60"
            />
          </div>

          {/* Nút bấm lưu */}
          {!isDiarySaved ? (
            <button
              onClick={() => onSaveDiary()}
              disabled={!diaryNote.trim() && !diaryLove.trim()}
              className="w-full rounded-xl bg-amber-400/80 p-1.5 text-[11px] font-bold text-black transition-all hover:bg-amber-400 disabled:opacity-30"
            >
              Ghi lại vào nhật ký
            </button>
          ) : (
            <button
              onClick={() => setIsDiarySaved(false)}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-1.5 text-[11px] font-medium text-white/40 transition-all hover:bg-white/10 hover:text-white/80"
            >
              Chỉnh sửa nhật ký hôm nay
            </button>
          )}
        </div>
      </div>
    </>
  );
};
export default DiaryCard;
