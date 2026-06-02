/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import { useUserStore } from "../../store/userStore";
import { listenTodos, ITodo } from "../../firebase/todo.service";
import { listenHomeData, updateWidgetText, updateMyMood, updateSpecialDays, IHomeData, ISpecialDay } from "../../firebase/home.service";
import { calculateLoveDays, calculateLoveTimeDetailed, getCountdown } from "../../utils/dateUtils";
import { Heart, CheckCircle2, Sparkles, Smile, Cake, Plane, CalendarDays, Plus, X } from "lucide-react";
import { getTodayDiary, saveTodayDiary } from "../../firebase/diary.service";

export default function Home() {
  const currentUser = useUserStore((state) => state.currentUser);
  const partner: "Phuc" | "Linh" = currentUser === "Phuc" ? "Linh" : "Phuc";

  const anniversaryDate = "2026-03-29";
  const [loveTime, setLoveTime] = useState(calculateLoveDays(anniversaryDate));

  const [todos, setTodos] = useState<ITodo[]>([]);
  const [homeData, setHomeData] = useState<IHomeData | null>(null);
  const [widgetInput, setWidgetInput] = useState("");
  const [isEditingWidget, setIsEditingWidget] = useState(false);

  // CÁC STATE CHO MODAL THÊM NGÀY ĐẶC BIỆT
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newType, setNewType] = useState<"anniversary" | "birthday" | "valentine" | "travel">("anniversary");

  // State quản lý chế độ xem thời gian yêu nhau
  const [viewMode, setViewMode] = useState<"days" | "seconds">("days");
  const [loveTimeDetailed, setLoveTimeDetailed] = useState(calculateLoveTimeDetailed(anniversaryDate));

  const [diaryNote, setDiaryNote] = useState("");
  const [diaryLove, setDiaryLove] = useState("");
  const [isDiarySaved, setIsDiarySaved] = useState(false);

  // 🚀 STATE QUẢN LÝ MENU CHỌN TÂM TRẠNG
  const [isMoodOpen, setIsMoodOpen] = useState(false);
  const moodMenuRef = useRef<HTMLDivElement>(null);

  // Danh sách các tâm trạng siêu dễ thương để chọn
  const moodList = [
    "🥰 Hạnh phúc",
    "💖 Nhớ người iu",
    "🤪 Nghịch ngợm",
    "😴 Buồn ngủ",
    "🐱 Đang dỗi",
    "🍽️ Đang đói bụng",
    "🔥 Đang tập trung",
    "🥺 Cần ôm ôm"
  ];

  // LOGIC TỰ ĐỘNG ĐỔI INTERVAL THEO CHẾ ĐỘ XEM
  useEffect(() => {
    setLoveTime(calculateLoveDays(anniversaryDate));
    setLoveTimeDetailed(calculateLoveTimeDetailed(anniversaryDate));

    const intervalTime = viewMode === "seconds" ? 1000 : 60000;

    const timer = setInterval(() => {
      if (viewMode === "seconds") {
        setLoveTimeDetailed(calculateLoveTimeDetailed(anniversaryDate));
      } else {
        setLoveTime(calculateLoveDays(anniversaryDate));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [viewMode, anniversaryDate]);
  // Tự động load lại xem hôm nay mình đã viết nhật ký chưa
  useEffect(() => {
    const loadDiary = async () => {
      const todayData = await getTodayDiary(currentUser);
      if (todayData) {
        setDiaryNote(todayData.note);
        setDiaryLove(todayData.whatILove);
        setIsDiarySaved(true);
      }
    };
    loadDiary();
  }, [currentUser]);
  const handleSaveDiary = async () => {
    await saveTodayDiary(currentUser, {
      mood: myStatus?.mood || "🥰 Bình thường", // Lấy luôn cái tâm trạng Phúc vừa chọn ở trên
      note: diaryNote,
      whatILove: diaryLove
    });
    setIsDiarySaved(true);
    alert("Đã lưu lại khoảnh khắc hôm nay! ❤️");
  };
  useEffect(() => {
    const unsubTodos = listenTodos((data) => setTodos(data));
    const unsubHome = listenHomeData((data) => {
      setHomeData(data);
      setWidgetInput(data.widgetText);
    });
    return () => {
      unsubTodos();
      unsubHome();
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moodMenuRef.current && !moodMenuRef.current.contains(event.target as Node)) {
        setIsMoodOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalTodos = todos.length;
  const completedTodos = todos.filter((t) => t.completed).length;
  const progressPercent = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  const partnerStatus = homeData ? (partner === "Phuc" ? homeData.phucStatus : homeData.linhStatus) : null;
  const myStatus = homeData ? (currentUser === "Phuc" ? homeData.phucStatus : homeData.linhStatus) : null;

  const handleSaveWidget = async () => {
    await updateWidgetText(widgetInput, currentUser);
    setIsEditingWidget(false);
  };

  const handleSelectMood = async (selectedMood: string) => {
    await updateMyMood(currentUser, selectedMood);
    setIsMoodOpen(false); // Chọn xong tự đóng menu
  };

  const getDayConfig = (type: "anniversary" | "birthday" | "valentine" | "travel") => {
    switch (type) {
      case "anniversary":
        return { icon: <Heart size={14} className="fill-pink-400/20" />, colorClass: "text-pink-400 bg-pink-500/10 border-pink-500/10" };
      case "birthday":
        return { icon: <Cake size={14} />, colorClass: "text-amber-300 bg-amber-500/10 border-amber-500/10" };
      case "valentine":
        return { icon: <Heart size={14} className="fill-red-400/30" />, colorClass: "text-red-400 bg-red-500/10 border-red-500/10" };
      case "travel":
        return { icon: <Plane size={14} />, colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/10" };
      default:
        return { icon: <CalendarDays size={14} />, colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/10" };
    }
  };

  const handleAddSpecialDay = async () => {
    if (!newTitle.trim() || !newDate) return;

    const newDay: ISpecialDay = {
      id: crypto.randomUUID(),
      title: newTitle,
      date: newDate,
      type: newType
    };

    const currentDays = homeData?.specialDays || [];
    const updatedDays = [...currentDays, newDay];

    await updateSpecialDays(updatedDays);

    setNewTitle("");
    setNewDate("");
    setNewType("anniversary");
    setIsModalOpen(false);
  };

  const handleDeleteSpecialDay = async (idToXoa: string) => {
    const currentDays = homeData?.specialDays || [];
    const updatedDays = currentDays.filter((day) => day.id !== idToXoa);
    await updateSpecialDays(updatedDays);
  };

  return (
    <div className="relative flex h-[500px] w-[340px] items-center justify-center">
      {/* NỘI DUNG CHÍNH CỦA HOME */}
      <div className="flex h-full min-h-0 w-full scrollbar-none flex-col space-y-4 overflow-y-auto pr-1 select-none">
        {/* 1. BỘ ĐẾM NGÀY YÊU NHAU */}
        <button
          onClick={() => setViewMode(viewMode === "days" ? "seconds" : "days")}
          className="group relative flex w-full flex-col items-center justify-center rounded-[32px] border border-white/5 bg-gradient-to-b from-pink-500/10 to-transparent p-6 text-center shadow-md backdrop-blur-xl transition-all duration-300 hover:border-pink-500/20 active:scale-[0.99]"
        >
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-pink-500/20 text-pink-400 transition-transform duration-500 group-hover:scale-110">
            <Heart size={28} className="animate-pulse fill-pink-500/40" />
          </div>

          {viewMode === "days" ? (
            <div className="animate-fade-in w-full">
              <h2 className="mt-3 bg-gradient-to-r from-pink-300 via-rose-300 to-amber-200 bg-clip-text text-2xl font-black tracking-wider text-transparent">
                {loveTime.totalDays} NGÀY
              </h2>
              <p className="mt-1 text-[11px] font-medium tracking-[1px] text-white/40 uppercase">
                {loveTime.years > 0 && `${loveTime.years} năm `}
                {loveTime.months > 0 && `${loveTime.months} tháng `}
                {loveTime.days} ngày bên nhau
              </p>
            </div>
          ) : (
            <div className="animate-fade-in w-full">
              <h2 className="mt-3 bg-gradient-to-r from-pink-200 via-rose-300 to-amber-200 bg-clip-text font-mono text-xl font-black tracking-wide text-transparent">
                {loveTimeDetailed.displayHours}h {loveTimeDetailed.displayMinutes}m{" "}
                <span className="inline-block min-w-[28px] text-left text-pink-400">
                  {String(loveTimeDetailed.displaySeconds).padStart(2, "0")}s
                </span>
              </h2>
              <p className="mt-1 truncate px-2 font-mono text-[10px] tracking-[0.5px] text-white/30">
                Tương đương: {loveTimeDetailed.totalSeconds.toLocaleString()} giây yêu nhau
              </p>
            </div>
          )}

          <span className="absolute bottom-2 text-[8px] tracking-wider text-white/10 uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Click để đổi chế độ xem 🔄
          </span>
        </button>

        {/* 2. TRẠNG THÁI ĐỐI PHƯƠNG & BẢN THÂN (CÓ MENU CHỌN TÂM TRẠNG) */}
        <div className="relative grid grid-cols-2 gap-3">
          {/* Ô hiển thị trạng thái của đối phương */}
          <div className="flex flex-col rounded-2xl border border-white/5 bg-white/5 p-3">
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${partnerStatus?.online ? "animate-pulse bg-green-400 shadow-[0_0_8px_#4ade80]" : "bg-white/20"}`}
              />
              <span className="text-[11px] font-bold text-white/60">{partner === "Phuc" ? "Phúc" : "Linh"} đang:</span>
            </div>
            <span className="mt-1.5 truncate text-[13px] font-semibold text-pink-300">{partnerStatus?.mood || "✨ Đang yêu"}</span>
          </div>

          {/* Ô chọn tâm trạng của bản thân */}
          <div className="relative" ref={moodMenuRef}>
            <button
              onClick={() => setIsMoodOpen(!isMoodOpen)}
              className={`flex h-full w-full flex-col rounded-2xl border bg-white/5 p-3 text-left transition-all hover:bg-white/[0.08] active:scale-95 ${
                isMoodOpen ? "border-pink-500/30 bg-pink-500/5 shadow-lg" : "border-white/5"
              }`}
            >
              <div className="flex items-center gap-1.5 text-[11px] text-white/40">
                <Smile size={12} className={isMoodOpen ? "text-pink-400" : ""} />
                <span>Tâm trạng của bạn:</span>
              </div>
              <span className="mt-1.5 truncate text-[13px] font-semibold text-amber-200">{myStatus?.mood || "🥰 Đặt trạng thái"}</span>
            </button>

            {/* 🚀 DROP-DOWN MENU CHỌN TÂM TRẠNG CUSTOM GLASSMORPHISM */}
            {isMoodOpen && (
              <div className="animate-fade-in absolute bottom-full left-0 z-40 mb-2 max-h-[170px] w-[155px] scrollbar-none overflow-y-auto rounded-xl border border-white/10 bg-[#160c0ebd]/95 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                <div className="mb-1 border-b border-white/5 px-2 py-1 text-[9px] font-bold tracking-wider text-white/30 uppercase">
                  Hôm nay thế nào?
                </div>
                <div className="space-y-0.5">
                  {moodList.map((moodItem) => (
                    <button
                      key={moodItem}
                      onClick={() => handleSelectMood(moodItem)}
                      className={`w-full rounded-lg px-2 py-1.5 text-left text-[12px] font-medium text-white/80 transition-colors hover:bg-pink-500/10 hover:text-pink-400 ${
                        myStatus?.mood === moodItem ? "bg-white/5 font-bold text-amber-200" : ""
                      }`}
                    >
                      {moodItem}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. WIDGET ĐÔI REALTIME */}
        <div className="flex flex-col rounded-2xl border border-white/5 bg-[#2a1b1d]/40 p-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/40">
              <Sparkles size={12} className="text-pink-400" />
              <span>Góc nhắn gửi ngọt ngào 💭</span>
            </div>
            {isEditingWidget ? (
              <button onClick={handleSaveWidget} className="text-[10px] font-bold text-pink-400 hover:underline">
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

        {/* 4. TIẾN ĐỘ TODO LIST */}
        <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
            <CheckCircle2 size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-semibold text-white/80">Kế hoạch chung</span>
              <span className="font-bold text-amber-300">
                {completedTodos}/{totalTodos} việc
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                style={{ width: `${progressPercent}%` }}
                className="h-full bg-gradient-to-r from-amber-400 to-pink-400 transition-all duration-500 ease-out"
              />
            </div>
          </div>
        </div>

        {/* 5. DANH SÁCH CÁC NGÀY ĐẶC BIỆT */}
        <div className="flex flex-col rounded-2xl border border-white/5 bg-white/[0.02] p-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/40">
              <CalendarDays size={12} className="text-pink-400" />
              <span>Mốc thời gian mong đợi ⏳</span>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex h-5 w-5 items-center justify-center rounded-md bg-white/5 text-white/60 transition-all hover:bg-pink-500/20 hover:text-pink-400 active:scale-95"
            >
              <Plus size={12} />
            </button>
          </div>

          <div className="mt-3 max-h-[160px] scrollbar-none space-y-2 overflow-y-auto">
            {homeData?.specialDays && homeData.specialDays.length > 0 ? (
              homeData.specialDays.map((day) => {
                const config = getDayConfig(day.type);
                const isRecurring = day.type !== "travel";
                const countdownText = getCountdown(day.date, isRecurring);

                return (
                  <div
                    key={day.id}
                    className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-2.5 transition-all hover:border-white/10"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${config.colorClass}`}>
                        {config.icon}
                      </div>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-[12px] font-medium text-white/90">{day.title}</span>
                        <span className="text-[9px] text-white/30">
                          {new Date(day.date).toLocaleDateString("vi-VN", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${config.colorClass.split(" ")[0]} ${config.colorClass.split(" ")[1]}`}
                      >
                        {countdownText}
                      </span>
                      <button
                        onClick={() => handleDeleteSpecialDay(day.id)}
                        className="rounded-md p-1 text-white/20 opacity-0 transition-all group-hover:opacity-100 hover:text-red-400"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="py-2 text-center text-[11px] text-white/20">Chưa cài đặt ngày đặc biệt nào.</p>
            )}
          </div>
        </div>
        {/* 🚀 6. WIDGET NHẬT KÝ NHANH HÔM NAY */}
        <div className="flex flex-col rounded-2xl border border-white/5 bg-gradient-to-br from-amber-500/[0.03] to-pink-500/[0.03] p-4 shadow-md">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/40">
              <Sparkles size={12} className="text-amber-300" />
              <span>Nhật ký khoảnh khắc hôm nay 📖</span>
            </div>
            {isDiarySaved && <span className="rounded bg-green-500/10 px-1.5 py-0.5 text-[9px] font-bold text-green-400">Đã ghi sổ</span>}
          </div>

          <div className="mt-3 space-y-2.5">
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
                onClick={handleSaveDiary}
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
      </div>

      {/* LỚP PHỦ GLASSMORPHISM MODAL THÊM NGÀY */}
      {isModalOpen && (
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
                onClick={handleAddSpecialDay}
                disabled={!newTitle.trim() || !newDate}
                className="flex-1 rounded-xl bg-pink-500/80 p-2 text-[12px] font-bold text-black transition-all hover:bg-pink-500 disabled:opacity-40"
              >
                Tạo Ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
