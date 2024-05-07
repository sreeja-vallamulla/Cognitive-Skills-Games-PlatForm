import { Outlet, RouteObject, createBrowserRouter } from "react-router-dom";
import { Login } from "./Pages/Login";
import { GamePage } from "./Pages/gamepage";

const GlobalProvider = () => {
  return <Outlet />;
};

const Routes: RouteObject = {
  path: "/",
  children: [
    {
      path: "/",
      Component: Login,
    },
    {
      path: "/game",
      Component: GamePage,
    },
  ],
};

export const App = createBrowserRouter([
  {
    path: "/",
    Component: GlobalProvider,
    children: [Routes],
  },
]);
