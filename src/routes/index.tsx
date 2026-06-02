import { createHashRouter } from "react-router-dom";

import FloatingWindow from "../layout/FloatingWindow";

import Home from "../pages/Home";
import Chat from "../pages/Chat";

import Error from "../pages/Error";
import Todo from "../pages/Todo";
import Profile from "../pages/Profile";
import Diary from "../pages/Diary";

export const router = createHashRouter([
  {
    path: "/",

    element: <FloatingWindow />,
    errorElement: <Error />,

    children: [
      {
        index: true,

        element: <Home />
      },

      {
        path: "chat",

        element: <Chat />
      },
      {
        path: "diary",
        element: <Diary />
      },
      {
        path: "todo",
        element: <Todo />
      },
      {
        path: "profile",
        element: <Profile />
      },
      {
        path: "*",
        element: <div>404</div>
      }
    ]
  }
]);
