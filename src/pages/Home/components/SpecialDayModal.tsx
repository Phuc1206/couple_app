import { X } from "lucide-react";

interface Props {
  setIsModalOpen: (open: boolean) => void;
  newTitle: string;
  setNewTitle: (title: string) => void;
  newDate: string;
  setNewDate: (date: string) => void;
  newType: string;
  setNewType: (type: "anniversary" | "birthday" | "valentine" | "travel") => void;
  onAddSpecialDay: () => void;
}
const SpecialDayModal = ({ setIsModalOpen, newTitle, setNewTitle, newDate, setNewDate, newType, setNewType, onAddSpecialDay }: Props) => {
  return (
    <>
      <div className="animate-fade-in absolute inset-0 z-50 flex items-center justify-center rounded-[32px] bg-black/60 p-4 backdrop-blur-md">
        <div className="w-full space-y-4 rounded-2xl border border-white/10 bg-[#160c0e]/90 p-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-[13px] font-bold text-white/90">Thêm Ngày Đặc Biệt ✨</span>
            <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white/80">
              <X size={16} />
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-semibold tracking-wider text-white/40 uppercase">Tên ngày đặc biệt</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ví dụ: Chuyến đi Phú Quốc 🌊"
              className="w-full rounded-xl border border-white/5 bg-white/5 p-2 text-[12px] text-white outline-none placeholder:text-white/30 focus:border-pink-500/30"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-semibold tracking-wider text-white/40 uppercase">Chọn ngày diễn ra</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="color-white w-full rounded-xl border border-white/5 bg-white/5 p-2 text-[12px] text-white outline-none focus:border-pink-500/30"
              style={{ colorScheme: "dark" }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-semibold tracking-wider text-white/40 uppercase">Loại sự kiện</label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as any)}
              className="w-full rounded-xl border border-white/5 bg-white/5 p-2 text-[12px] text-white outline-none focus:border-pink-500/30"
              style={{ colorScheme: "dark" }}
            >
              <option value="anniversary">❤️ Kỷ niệm yêu (Lặp lại)</option>
              <option value="birthday">🎂 Sinh nhật (Lặp lại)</option>
              <option value="valentine">💖 Valentine (Lặp lại)</option>
              <option value="travel">✈️ Chuyến đi chơi (Một lần)</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 rounded-xl bg-white/5 p-2 text-[12px] font-medium text-white/80 transition-all hover:bg-white/10"
            >
              Hủy
            </button>
            <button
              onClick={() => onAddSpecialDay()}
              disabled={!newTitle.trim() || !newDate}
              className="flex-1 rounded-xl bg-pink-500/80 p-2 text-[12px] font-bold text-black transition-all hover:bg-pink-500 disabled:opacity-40"
            >
              Tạo Ngay
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default SpecialDayModal;
