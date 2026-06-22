/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useUserStore } from "../../store/userStore";
import { listenTodos, ITodo } from "../../firebase/todo.service";
import { listenHomeData, updateWidgetText, updateMyMood, updateSpecialDays, IHomeData, ISpecialDay } from "../../firebase/home.service";
import { calculateLoveDays, calculateLoveTimeDetailed } from "../../utils/dateUtils";
import { formatDate, getDiary, saveDiary } from "../../firebase/diary.service";
import { anniversaryDate } from "../../constant/variable";
import { saveEmotionSignal, subscribeEmotionSignal } from "../../firebase/emotion.service";
import LoveCounterCard from "./components/LoveCounterCard";
import MoodCard from "./components/MoodCard";
import WidgetCard from "./components/WidgetCard";
import TodoProgressCard from "./components/TodoProgressCard";
import SpecialDaysCard from "./components/SpecialDaysCard";
import DiaryCard from "./components/DiaryCard";
import SpecialDayModal from "./components/SpecialDayModal";
import LoveSOSCard from "./components/LoveSOSCard";
import LoveSOSModal from "./components/LoveSOSModal";

export default function Home() {
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
    const unsubscribe = subscribeEmotionSignal(currentUser, (data) => {
      setSignal(data);
    });
    return unsubscribe;
  }, [currentUser]);

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
        <LoveSOSCard partner={partner} signal={signal} onOpen={() => setIsSignalOpen(true)} />

        {/* 7. WIDGET NHẬT KÝ NHANH HÔM NAY */}
        <DiaryCard
          selectedDiaryDate={selectedDiaryDate}
          setSelectedDiaryDate={setSelectedDiaryDate}
          onSaveDiary={handleSaveDiary}
          diaryLove={diaryLove}
          setDiaryLove={setDiaryLove}
          diaryNote={diaryNote}
          setDiaryNote={setDiaryNote}
          isDiarySaved={isDiarySaved}
          setIsDiarySaved={setIsDiarySaved}
        />
      </div>
      {/* LỚP PHỦ GLASSMORPHISM MODAL THÊM NGÀY */}
      {isModalOpen && (
        <SpecialDayModal
          setIsModalOpen={setIsModalOpen}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          newDate={newDate}
          setNewDate={setNewDate}
          newType={newType}
          setNewType={setNewType}
          onAddSpecialDay={handleAddSpecialDay}
        />
      )}
      {isSignalOpen && (
        <LoveSOSModal
          onSave={handleSaveSignal}
          open={isSignalOpen}
          onClose={() => setIsSignalOpen(false)}
          emotion={emotion}
          setEmotion={setEmotion}
          needs={needs}
          setNeeds={setNeeds}
          message={message}
          setMessage={setMessage}
        />
      )}
    </div>
  );
}
