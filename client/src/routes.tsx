import { createRootRoute, createRoute, createRouter, Outlet } from "@tanstack/react-router";
import { Index } from "./Index";
import { PublicHeader } from "./components/PublicHeader";
import { PublicFooter } from "./components/PublicFooter";

//root routes
const rootRoutePublic = createRootRoute({
    component: () => (
        <div className="max-w-screen-2xl mx-auto flex flex-col justify-center w-full">
            <PublicHeader/>
            <main className="mx-2"><Outlet/></main>
            <PublicFooter/>
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
