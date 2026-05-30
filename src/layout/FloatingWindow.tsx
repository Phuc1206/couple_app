import { Outlet } from "react-router-dom";
import BottomNav from "../components/common/BottomNav";

export default function FloatingWindow() {
	return (
		<div
			className="
				relative
				h-screen
				w-screen
				overflow-hidden
				text-white
				drag
			"
		>
			{/* draggable area */}
			<div
				className="
					absolute
					top-0
					left-0
					right-0
					h-10
					z-50
					drag
				"
			/>

			{/* background */}
			<div
				className="
					absolute
					inset-0

					bg-[#09090b]
					drag
					before:absolute
					before:inset-0
					before:bg-[radial-gradient(circle_at_top,rgba(255,120,160,0.15),transparent_40%)]

					overflow-hidden
				"
			/>

			{/* scroll content */}
			<div
				className="
		relative
		z-10
				
		h-full
		overflow-y-auto

		px-6
		pt-16
		pb-40

		flex
		flex-col
		items-center
	"
			>
				<div
					className="
			w-full
			max-w-[900px]
				no-drag
			flex
			flex-col
			items-center
			justify-center
		"
				>
					<Outlet />
				</div>
			</div>

			{/* fixed navbar */}
			<div
				className="
					absolute
					bottom-6
					left-1/2
					z-50
					-translate-x-1/2
					no-drag
				"
			>
				<BottomNav />
			</div>
		</div>
	);
}
