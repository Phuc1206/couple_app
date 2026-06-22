import { CheckCircle2 } from "lucide-react";
interface TodoProgressCardProps {
  todos: any[];
}
const TodoProgressCard = ({ todos }: TodoProgressCardProps) => {
  const totalTodos = todos.length;
  const completedTodos = todos.filter((t) => t.completed).length;
  const progressPercent = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  return (
    <>
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
    </>
  );
};

export default TodoProgressCard;
