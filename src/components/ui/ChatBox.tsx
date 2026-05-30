import { useState } from "react";

import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

import { useMessages } from "../../hooks/useMessages";

export default function ChatBox() {
	const { text, sendMessage } = useMessages();

	const [value, setValue] = useState("");

	return (
		<div
			className="
        w-[340px]
        h-[540px]
        rounded-[32px]
        bg-white/10
        border
        border-white/10
        backdrop-blur-2xl
        shadow-2xl
        flex
        flex-col
        overflow-hidden
		
      "
		>
			{/* HEADER */}
			<div
				className="
          p-5
          border-b
          border-white/10
          flex
          items-center
          gap-3
        "
			>
				<div
					className="
            w-3
            h-3
            rounded-full
            bg-green-400
            animate-pulse
          "
				/>

				<div className="text-white">Together 💌</div>
			</div>

			{/* MESSAGES */}
			<div
				className="
          flex-1
          p-4
          flex
          flex-col
          gap-3
          overflow-y-auto
        "
			>
				{text && <MessageBubble text={text} isMine />}

				<TypingIndicator />
			</div>

			{/* INPUT */}
			<div className="p-4">
				<input
					value={value}
					onChange={(e) => setValue(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							sendMessage(value);
							setValue("");
						}
					}}
					placeholder="Message..."
					className="
            w-full
            px-4
            py-3
            rounded-2xl
            bg-black/20
            border
            border-white/10
            text-white
            outline-none
            placeholder:text-white/40
          "
				/>
			</div>
		</div>
	);
}
