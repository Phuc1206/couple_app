import { useEffect, useState } from "react";

import { BookHeart, ArrowLeft, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllDiaries, IDiaryTimelineItem } from "../../firebase/diary.service";
import { useUserStore } from "../../store/userStore";

export default function Diary() {
  const navigate = useNavigate();
  const currentUser = useUserStore((state) => state.currentUser);
  const [loading, setLoading] = useState(true);
  const [diaries, setDiaries] = useState<IDiaryTimelineItem[]>([]);

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const data = await getAllDiaries();
        setDiaries(data);
      } catch (error) {
        console.error("Lỗi khi đọc sổ nhật ký:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDiaries();
  }, []);

  // Format ngày dạng "2026-03-29" thành "Ngày 29 tháng 03, 2026" cho lãng mạn
  const formatDiaryDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <div className="animate-fade-in relative flex h-[500px] w-[340px] flex-col bg-[#160c0e] p-4 text-white select-none">
      {/* 🚀 HEADER TRANG */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
        <button
          onClick={() => navigate(-1)} // Bấm quay lại trang Home cũ
          className="rounded-lg p-1 text-white/40 transition-all hover:bg-white/5 hover:text-white active:scale-95"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-1.5">
          <BookHeart size={16} className="text-pink-400" />
          <span className="text-[14px] font-bold tracking-wide">Sổ Kỷ Niệm Chúng Mình</span>
        </div>
      </div>

      {/* 🚀 DANH SÁCH DÒNG THỜI GIAN */}
      <div className="relative mt-4 min-h-0 flex-1 scrollbar-none space-y-6 overflow-y-auto pr-1">
        {loading ? (
          <div className="flex h-full items-center justify-center text-[12px] text-white/30">
            <Heart size={16} className="mr-2 animate-spin text-pink-400" />
            Đang lật mở từng trang kỷ niệm...
          </div>
        ) : diaries.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-4 text-center text-white/30">
            <BookHeart size={32} className="mb-2 text-white/10" />
            <p className="text-[12px]">Sổ kỷ niệm của hai bạn còn trống trải quá.</p>
            <p className="mt-1 text-[10px]">Hãy quay lại trang chủ ghi chép điều đầu tiên nhé!</p>
          </div>
        ) : (
          /* Trục line dọc chạy ngầm ở góc trái */
          <div className="pointer-events-none absolute top-2 bottom-2 left-[16px] w-[1px] bg-white/5" />
        )}

        {/* Vòng lặp hiển thị từng ngày */}
        {!loading &&
          diaries.map((day) => (
            <div key={day.id} className="animate-fade-in relative pl-8">
              {/* Chấm tròn phát sáng nhẹ dính trên trục thời gian */}
              <div className="absolute top-1 left-[12px] h-2 w-2 rounded-full border border-pink-500/40 bg-[#160c0e] shadow-[0_0_6px_rgba(236,72,153,0.5)]" />

              {/* Tiêu đề Ngày Tháng */}
              <span className="text-[10px] font-bold tracking-wider text-amber-200/60 uppercase">{formatDiaryDate(day.id)}</span>

              {/* Khối hiển thị nội dung lưu của hai người */}
              <div className="mt-2 space-y-2.5">
                {/* 👦 PHẦN CỦA PHÚC */}
                {day.phucData ? (
                  <div
                    className={`rounded-xl border border-white/5 bg-white/[0.02] p-2.5 ${currentUser === "Phuc" ? "border-l-2 border-l-blue-400/40" : ""}`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-blue-300">
                      <span>👦 Phúc đã ghi:</span>
                      <span className="text-[9px] font-normal text-white/20">{day.phucData.mood}</span>
                    </div>
                    <p className="mt-1 text-[12px] text-white/80 italic">"{day.phucData.note}"</p>
                    {day.phucData.whatILove && (
                      <p className="mt-1.5 flex items-start gap-1 text-[11px] text-pink-300/70">
                        <span className="shrink-0">❤️</span>
                        <span className="font-medium">{day.phucData.whatILove}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-white/5 p-2 text-center text-[10px] text-white/20 italic">
                    👦 Phúc hôm nay chưa viết trang này...
                  </div>
                )}

                {/* 👧 PHẦN CỦA LINH */}
                {day.linhData ? (
                  <div
                    className={`rounded-xl border border-white/5 bg-white/[0.02] p-2.5 ${currentUser === "Linh" ? "border-l-2 border-l-pink-400/40" : ""}`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-pink-300">
                      <span>👧 Linh đã ghi:</span>
                      <span className="text-[9px] font-normal text-white/20">{day.linhData.mood}</span>
                    </div>
                    <p className="mt-1 text-[12px] text-white/80 italic">"{day.linhData.note}"</p>
                    {day.linhData.whatILove && (
                      <p className="mt-1.5 flex items-start gap-1 text-[11px] text-pink-300/70">
                        <span className="shrink-0">❤️</span>
                        <span className="font-medium">{day.linhData.whatILove}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-white/5 p-2 text-center text-[10px] text-white/20 italic">
                    👧 Linh hôm nay chưa viết trang này...
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
