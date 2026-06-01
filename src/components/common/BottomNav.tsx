import { Home, Image, MessageCircle, User, ListTodo } from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

const items = [
  {
    icon: Home,
    label: "HOME",
    path: "/"
  },
  {
    icon: Image,
    label: "MEMORIES",
    path: "/memories"
  },
  {
    icon: MessageCircle,
    label: "CHAT",
    path: "/chat"
  },
  {
    icon: ListTodo,
    label: "TODO",
    path: "/todo"
  },
  {
    icon: User,
    label: "YOU",
    path: "/profile"
  }
];

export default function BottomNav() {
  const navigate = useNavigate();

  const location = useLocation();

  return (
    <div className="flex w-full justify-center">
      <div className="relative flex w-[360px] items-center justify-between rounded-[40px] border border-white/10 bg-white/5 px-6 py-5 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-3xl before:pointer-events-none before:absolute before:inset-0 before:rounded-[40px] before:bg-gradient-to-br before:from-white/10 before:to-transparent">
        {items.map((item, index) => {
          const Icon = item.icon;

          const isActive = location.pathname === item.path;

          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="group no-drag relative flex flex-col items-center gap-2 transition-all duration-300"
            >
              <Icon
                size={20}
                className={`transition-all duration-300 ${
                  isActive ? `scale-110 text-white` : `text-white/45 group-hover:scale-105 group-hover:text-white/80`
                } `}
              />

              <span
                className={`text-[10px] font-light tracking-[2px] transition-all duration-300 ${
                  isActive ? `text-white` : `text-white/45 group-hover:text-white/80`
                } `}
              >
                {item.label}
              </span>

              {/* ACTIVE DOT */}

              {isActive && (
                <div className="absolute -bottom-3 h-2 w-2 animate-pulse rounded-full bg-pink-400 shadow-[0_0_12px_rgba(244,114,182,0.9)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
