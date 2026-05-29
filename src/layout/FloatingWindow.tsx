export default function FloatingWindow({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div
			className="
        w-screen
        h-screen
        bg-black/30
        backdrop-blur-xl
        flex
        items-center
        justify-center
      "
		>
			{children}
		</div>
	);
}
