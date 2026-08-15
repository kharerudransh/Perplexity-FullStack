import { createBrowserRouter } from "react-router";
import LandingPage from "../features/auth/pages/LandingPage";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";

import Dashboard from "../features/chat/pages/Dashboard";
import Protected from "../features/auth/component/Protected.jsx";

export const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />,
    },
    {
        path:"/login",
        element:<Login />
    },
    {
        path:"/register",
        element:<Register />
    },
    {
        path: "/dashboard",
        element: <Protected><Dashboard /></Protected>,
    },
]);