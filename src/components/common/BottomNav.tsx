import { Home, Image, MessageCircle, Map, User } from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

const items = [
	{
		icon: Home,
		label: "HOME",
		path: "/",
	},
	{
		icon: Image,
		label: "MEMORIES",
		path: "/memories",
	},
	{
		icon: MessageCircle,
		label: "CHAT",
		path: "/chat",
	},
	{
		icon: Map,
		label: "MAP",
		path: "/map",
	},
	{
		icon: User,
		label: "YOU",
		path: "/profile",
	},
];

export default function BottomNav() {
	const navigate = useNavigate();

	const location = useLocation();

	return (
		<div className="w-full flex justify-center">
			<div
				className="
					relative
					flex
					items-center
					justify-between

					w-[360px]

					px-10
					py-5

					rounded-[40px]

					bg-white/5
					backdrop-blur-3xl

					border
					border-white/10

					shadow-[0_8px_40px_rgba(0,0,0,0.45)]

					before:absolute
					before:inset-0
					before:rounded-[40px]

					before:bg-gradient-to-br
					before:from-white/10
					before:to-transparent

					before:pointer-events-none
				"
			>
				{items.map((item, index) => {
					const Icon = item.icon;

					const isActive = location.pathname === item.path;

					return (
						<button
							key={index}
							onClick={() => navigate(item.path)}
							className="
									relative

									flex
									flex-col
									items-center
									gap-2

									group

									transition-all
									duration-300

									no-drag
								"
						>
							<Icon
								size={20}
								className={`
										transition-all
										duration-300

										${
											isActive
												? `
                          text-white
                          scale-110
                        `
												: `
                          text-white/45
                          group-hover:text-white/80
                          group-hover:scale-105
                        `
										}
									`}
							/>

							<span
								className={`
										text-[10px]

										tracking-[2px]
										font-light

										transition-all
										duration-300

										${
											isActive
												? `
                          text-white
                        `
												: `
                          text-white/45
                          group-hover:text-white/80
                        `
										}
									`}
							>
								{item.label}
							</span>

							{/* ACTIVE DOT */}

							{isActive && (
								<div
									className="
											absolute
											-bottom-3

											w-2
											h-2

											rounded-full

											bg-pink-400

											shadow-[0_0_12px_rgba(244,114,182,0.9)]

											animate-pulse
										"
								/>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
}
