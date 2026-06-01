import { useEffect, useState } from "react";
import { useUserStore } from "../../store/userStore";
import { addTodo, deleteTodo, ITodo, listenTodos, toggleTodoComplete } from "../../firebase/todo.service";
import { Calendar, Check, Plus, Trash2 } from "lucide-react";

const Todo = () => {
  const currentUser = useUserStore((state) => state.currentUser);

  const [todos, setTodos] = useState<ITodo[]>([]);
  const [inputValue, setInputValue] = useState("");

  // Đồng bộ realtime dữ liệu từ Firebase về app
  useEffect(() => {
    const unsub = listenTodos((data) => {
      setTodos(data);
    });
    return () => unsub();
  }, []);

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    addTodo(inputValue, currentUser);
    setInputValue("");
  };

  return (
    /* Khung ngoài w-[340px] h-[500px] khít khịt lòng cửa sổ Electron giống như hộp chat */
    <div className="flex h-[500px] w-[340px] flex-col overflow-hidden rounded-[32px] border border-white/5 bg-[#12080a]/60 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.8)] backdrop-blur-3xl">
      {/* HEADER TÍNH NĂNG */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-500/20 text-pink-400">
          <Calendar size={16} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white/90">Our Love Plans 📝</h3>
          <p className="text-[11px] text-white/40">Cùng Phúc & Linh hoàn thành nhé</p>
        </div>
      </div>

      {/* INPUT THÊM CÔNG VIỆC MỚI */}
      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/5 bg-white/5 p-1.5 pl-3 transition-all focus-within:border-pink-500/30">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Thêm việc muốn làm cùng nhau..."
          className="flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-white/20"
        />
        <button
          onClick={handleAdd}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-400/80 text-black shadow-md transition-all hover:bg-pink-400 active:scale-95"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* BODY: DANH SÁCH TO-DO (Bật cuộn chuột nội bộ mượt mà giống ChatBox) */}
      <div className="mt-4 min-h-0 flex-1 scrollbar-none space-y-2.5 overflow-y-auto pr-1">
        {todos.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center pt-10 text-center">
            <span className="text-2xl">✨</span>
            <p className="mt-2 text-[12px] text-white/30">Chưa có kế hoạch nào được tạo.</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center justify-between rounded-2xl border p-3.5 transition-all duration-300 ${
                todo.completed ? "border-white/5 bg-white/[0.02] opacity-40" : "border-white/5 bg-white/5 shadow-sm hover:border-white/10"
              }`}
            >
              <div className="flex flex-1 items-center gap-3 pr-2">
                {/* NÚT TÍCH CHỌN HOÀN THÀNH (CUSTOM CHECKBOX) */}
                <button
                  onClick={() => toggleTodoComplete(todo.id!, todo.completed)}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                    todo.completed ? "border-pink-400 bg-pink-400 text-black" : "border-white/20 bg-transparent hover:border-white/40"
                  }`}
                >
                  {todo.completed && <Check size={12} strokeWidth={3} />}
                </button>

                {/* NỘI DUNG TEXT VIỆC CẦN LÀM */}
                <div className="flex flex-col">
                  <span
                    className={`text-[13px] leading-tight font-medium text-white/90 transition-all ${
                      todo.completed ? "text-white/40 line-through" : ""
                    }`}
                  >
                    {todo.title}
                  </span>
                  {/* Tag nhỏ hiển thị ai là người tạo ra note này */}
                  <span className="mt-0.5 text-[9px] tracking-wider text-white/20 uppercase">
                    By: {todo.createdBy === "Phuc" ? "Phúc ❤️" : "Linh 💖"}
                  </span>
                </div>
              </div>

              {/* NÚT XÓA NOTE */}
              <button onClick={() => deleteTodo(todo.id!)} className="p-1 text-white/20 transition-colors hover:text-red-400/80">
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Todo;
