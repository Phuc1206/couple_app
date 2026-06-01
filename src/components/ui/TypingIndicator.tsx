export default function TypingIndicator() {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-2xl border border-white/5 bg-[#2a1b1d]/40 px-4 py-3 shadow-md">
      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60 [animation-delay:-0.3s]" />
      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60 [animation-delay:-0.15s]" />
      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60" />
    </div>
  );
}
