import { createHashRouter } from "react-router-dom";

import FloatingWindow from "../layout/FloatingWindow";

import Home from "../pages/Home";
import Chat from "../pages/Chat";
import Memories from "../pages/Memories";

import Error from "../pages/Error";
import Todo from "../pages/Todo";
import Profile from "../pages/Profile";

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
        path: "memories",
        element: <Memories />
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
