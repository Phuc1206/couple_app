import { useMessages } from "../../hooks/useMessages";

export default function ChatBox() {
	const { text, sendMessage } = useMessages();
	// return <div> Chat123123box</div>;

	return (
		<div
			className="
	      w-[320px]
	      rounded-3xl
	      bg-white/10
	      border
	      border-white/20
	      p-6
	      shadow-2xl
	    "
		>
			<div className="text-white text-xl mb-4">Together 💌</div>

			<input
				value={text}
				onChange={(e) => sendMessage(e.target.value)}
				placeholder="Type something..."
				className="
	        w-full
	        p-3
	        rounded-2xl
	        bg-white/10
	        text-white
	        outline-none
	        border
	        border-white/20
	      "
			/>
		</div>
	);
}
