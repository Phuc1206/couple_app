import { RouterProvider } from "react-router-dom";
import { usePresence } from "../hooks/usePresence";
import { router } from "../routes";

function App() {
  usePresence();

  return <RouterProvider router={router} />;
}

export default App;
