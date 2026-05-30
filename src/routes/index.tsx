import { createHashRouter } from "react-router-dom";

import FloatingWindow from "../layout/FloatingWindow";

import Home from "../pages/Home";
import Chat from "../pages/Chat";
import Memories from "../pages/Memories";
import Map from "../pages/Map";
import Error from "../pages/Error";

export const router = createHashRouter([
	{
		path: "/",

		element: <FloatingWindow />,
		errorElement: <Error />,

		children: [
			{
				index: true,

				element: <Home />,
			},

			{
				path: "chat",

				element: <Chat />,
			},
			{
				path: "memories",
				element: <Memories />,
			},
			{
				path: "map",
				element: <Map />,
			},
			{
				path: "profile",
				element: <div>Profile</div>,
			},
			{
				path: "*",
				element: <div>404</div>,
			},
		],
	},
]);
