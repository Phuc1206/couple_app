/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useUserStore } from "../../store/userStore";
import { listenTodos, ITodo } from "../../firebase/todo.service";
import { listenHomeData, updateWidgetText, updateMyMood, updateSpecialDays, IHomeData, ISpecialDay } from "../../firebase/home.service";
import { calculateLoveDays, calculateLoveTimeDetailed } from "../../utils/dateUtils";
import { Sparkles, X, BookOpen } from "lucide-react";
import { getDiary, saveDiary, formatDate } from "../../firebase/diary.service";
import { useNavigate } from "react-router-dom";
import { anniversaryDate, emotionMap, needMap, reasonMap } from "../../constant/variable";
import { saveEmotionSignal, subscribeEmotionSignal } from "../../firebase/emotion.service";
import LoveCounterCard from "./components/LoveCounterCard";
import MoodCard from "./components/MoodCard";
import WidgetCard from "./components/WidgetCard";
import TodoProgressCard from "./components/TodoProgressCard";
import SpecialDaysCard from "./components/SpecialDaysCard";

export default function Home() {
  const navigate = useNavigate();
  const currentUser = useUserStore((state) => state.currentUser);
  const partner: "Phuc" | "Linh" = currentUser === "Phuc" ? "Linh" : "Phuc";

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
  const [selectedDiaryDate, setSelectedDiaryDate] = useState(formatDate());
  const [isDiarySaved, setIsDiarySaved] = useState(false);

  // 🚀 STATE QUẢN LÝ MENU CHỌN TÂM TRẠNG

  const [emotion, setEmotion] = useState("");
  const [reasons, setReasons] = useState<string[]>([]);
  const [needs, setNeeds] = useState<string[]>([]);
  const [level, setLevel] = useState<1 | 2 | 3>(2);
  const [message, setMessage] = useState("");
  const [signal, setSignal] = useState<any>();
  const [isSignalOpen, setIsSignalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeEmotionSignal(
      partner,

      (data) => {
        setSignal(data);
      }
    );

    return unsubscribe;
  }, [partner]);

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
      const data = await getDiary(currentUser, selectedDiaryDate);

      if (data) {
        setDiaryNote(data.note);
        setDiaryLove(data.whatILove);
        setIsDiarySaved(true);
      } else {
        setDiaryNote("");
        setDiaryLove("");
        setIsDiarySaved(false);
      }
    };

    loadDiary();
  }, [currentUser, selectedDiaryDate]);
  useEffect(() => {
    const unsubTodos = listenTodos((data) => setTodos(data));
    const unsubHome = listenHomeData((data) => {
      setHomeData(data);

      if (!isEditingWidget) {
        setWidgetInput(data.widgetText);
      }
    });

    return () => {
      unsubTodos();
      unsubHome();
    };
  }, [isEditingWidget]);
  const handleSaveDiary = async () => {
    await saveDiary(currentUser, selectedDiaryDate, {
      mood: myStatus?.mood || "🥰 Bình thường",
      note: diaryNote,
      whatILove: diaryLove
    });
    setIsDiarySaved(true);
    alert("Đã lưu lại khoảnh khắc hôm nay! ❤️");
  };

  const partnerStatus = homeData ? (partner === "Phuc" ? homeData.phucStatus : homeData.linhStatus) : null;
  const myStatus = homeData ? (currentUser === "Phuc" ? homeData.phucStatus : homeData.linhStatus) : null;

  const handleSaveWidget = async () => {
    await updateWidgetText(widgetInput, currentUser);
    setIsEditingWidget(false);
  };

  const handleSelectMood = async (selectedMood: string) => {
    await updateMyMood(currentUser, selectedMood);
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
  const handleSaveSignal = async () => {
    await saveEmotionSignal(currentUser, {
      emotion,
      reasons,
      needs,
      level,
      message,
      updatedAt: ""
    });

    setSignal({
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
  const toggleView = () => {
    if (viewMode === "days") {
      setViewMode("seconds");
    } else {
      setViewMode("days");
    }
  };
  return (
    <div className="relative flex h-[500px] w-[340px] items-center justify-center">
      <div className="flex h-full min-h-0 w-full scrollbar-none flex-col space-y-4 overflow-y-auto pr-1 select-none">
        {/* 1. BỘ ĐẾM NGÀY YÊU NHAU */}
        <LoveCounterCard viewMode={viewMode} setViewMode={toggleView} loveTime={loveTime} loveTimeDetailed={loveTimeDetailed} />

        {/* 2. TRẠNG THÁI ĐỐI PHƯƠNG & BẢN THÂN */}
        <MoodCard partner={partner} partnerStatus={partnerStatus} myStatus={myStatus} onSelectMood={handleSelectMood} />
        {/* 3. WIDGET ĐÔI REALTIME */}
        <WidgetCard
          data={homeData}
          isEditingWidget={isEditingWidget}
          setIsEditingWidget={setIsEditingWidget}
          widgetInput={widgetInput}
          setWidgetInput={setWidgetInput}
          onSaveWidget={handleSaveWidget}
        />
        {/* 4. TIẾN ĐỘ TODO LIST */}
        <TodoProgressCard todos={todos} />
        {/* 5. DANH SÁCH CÁC NGÀY ĐẶC BIỆT */}
        <SpecialDaysCard homeData={homeData} setIsModalOpen={setIsModalOpen} onDeleteSpecialDay={handleDeleteSpecialDay} />
        {/* 6. THÔNG BÁO ĐẶC BIỆT */}
        <div className="mb-4 rounded-3xl border border-white/5 bg-gradient-to-br from-pink-500/5 to-purple-500/5 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">🤍 Điều em muốn anh biết</h3>

            <button
              onClick={() => {
                setEmotion(signal?.emotion || "");
                setReasons(signal?.reasons || []);
                setNeeds(signal?.needs || []);
                setLevel(signal?.level || 2);
                setMessage(signal?.message || "");

                setIsSignalOpen(true);
              }}
            >
              Chỉnh sửa
            </button>
          </div>

          {signal ? (
            <>
              <p className="mt-3 text-lg font-semibold">{emotionMap[signal.emotion]}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {signal.reasons?.map((r: string) => (
                  <span key={r} className="rounded-full bg-white/5 px-2 py-1 text-[10px]">
                    {reasonMap[r]}
                  </span>
                ))}
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {signal.needs?.map((n: string) => (
                  <span key={n} className="rounded-full bg-pink-500/10 px-2 py-1 text-[10px] text-pink-300">
                    {needMap[n]}
                  </span>
                ))}
              </div>

              {signal.message && (
                <div className="mt-3 rounded-xl bg-black/20 p-3">
                  <p className="text-xs text-white/70 italic">"{signal.message}"</p>
                </div>
              )}

              <p className="mt-3 text-[10px] text-white/30">🕒 {new Date(signal.updatedAt).toLocaleTimeString()}</p>
            </>
          ) : (
            <div className="mt-3">
              <p className="text-xs text-white/50">Hôm nay người ấy chưa gửi tín hiệu nào ✨</p>
            </div>
          )}
        </div>
        {/* 7. WIDGET NHẬT KÝ NHANH HÔM NAY */}
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
      {isSignalOpen && (
        <div className="fixed inset-0 z-50 mb-32 flex items-end bg-black/60">
          <div className="w-full rounded-t-3xl bg-[#171717] p-5">
            <h2 className="mb-4 text-lg font-bold">🤍 Điều em muốn anh biết</h2>
            <div className="grid grid-cols-3 gap-2">
              {[
                ["STRESS", "😮‍💨"],

                ["SAD", "😔"],

                ["EXHAUSTED", "😩"],

                ["SICK", "🤒"],

                ["ANXIOUS", "😰"]
              ].map(([v, e]) => (
                <button
                  key={v}
                  onClick={() => setEmotion(v)}
                  className={`rounded-2xl p-3 ${emotion === v ? "border border-pink-400 bg-pink-500/20" : "bg-white/5"} `}
                >
                  {e}
                </button>
              ))}
            </div>
            <p className="mt-4 mb-2 text-sm">Nguyên nhân</p>

            <div className="flex flex-wrap gap-2">
              {Object.entries(reasonMap).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => {
                    setReasons((prev) => (prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]));
                  }}
                  className={`rounded-full px-3 py-1 text-xs ${reasons.includes(key) ? "bg-pink-500 text-black" : "bg-white/5"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="mt-4 mb-2 text-sm">Điều em cần</p>

            <div className="flex flex-wrap gap-2">
              {Object.entries(needMap).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => {
                    setNeeds((prev) => (prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]));
                  }}
                  className={`rounded-full px-3 py-1 text-xs ${needs.includes(key) ? "bg-pink-500 text-black" : "bg-white/5"}`}
                >
                  {label}
                </button>
              ))}
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Muốn nhắn gì không?"
              className="mt-4 w-full rounded-xl bg-black/30 p-3"
            />
            <button onClick={handleSaveSignal} disabled={!emotion} className="mt-4 w-full rounded-2xl bg-pink-500 py-3 disabled:opacity-30">
              Lưu tín hiệu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
