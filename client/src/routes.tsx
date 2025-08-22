import { createRootRoute, createRoute, createRouter, Outlet } from "@tanstack/react-router";
import { Index } from "./Index";

//root routes
const rootRoutePublic = createRootRoute({
    component: () => (
        <div>
            <header>Publik header</header>
            <main><Outlet/></main>
            <footer>Publik footer</footer>
        </div>
    )
});

//TODO implementera admin-route
// const rootRouteAdmin = createRootRoute({
//     component: () => (
//         <div>
//             <header>Admin header</header>
//             <aside>Admin sidebar</aside>
//             <main><Outlet/></main>
//         </div>
//     )
// });

//child routes

const homeRoute = createRoute({
    getParentRoute: () => rootRoutePublic,
    path:"/",
    component: Index,
});

//route tree
const routeTree = rootRoutePublic.addChildren([
    homeRoute
]);
export const router = createRouter({ routeTree });
