type Props = {
	text: string;
	isMine?: boolean;
};

export default function MessageBubble({ text, isMine }: Props) {
	return (
		<div
			className={`
        max-w-[80%]
        px-4
        py-3
        rounded-3xl
        text-white
        text-sm
        backdrop-blur-xl
        border
        shadow-xl
        ${
					isMine
						? `
              bg-pink-500/30
              border-pink-300/20
              self-end
            `
						: `
              bg-white/10
              border-white/10
              self-start
            `
				}
      `}
		>
			{text}
		</div>
	);
}
