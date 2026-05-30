export default function TypingIndicator() {
	return (
		<div className="flex gap-1 px-2">
			<div className="w-2 h-2 bg-white rounded-full animate-bounce" />
			<div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
			<div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
		</div>
	);
}
