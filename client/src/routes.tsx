import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import { Index } from "./routes/Index";
import { PublicHeader } from "./components/PublicHeader";
import { PublicFooter } from "./components/PublicFooter";
import { ProductDetails } from "./routes/ProductDetails";
import { Cart } from "./routes/Cart";
import { Category } from "./routes/categories/Category";

//root routes
const rootRoutePublic = createRootRoute({
  component: () => (
    <div className="max-w-screen-2xl mx-auto flex flex-col justify-center w-full">
      <PublicHeader />
      <main className="mx-2">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  ),
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
  path: "/",
  component: Index,
});
const productRoute = createRoute({
  getParentRoute: () => rootRoutePublic,
  path: "/details", //TODO - dynamisk
  component: ProductDetails,
});
const cartRoute = createRoute({
    getParentRoute: () => rootRoutePublic,
    path: "/cart",
    component: Cart,
})
const categoryRoute = createRoute({
  getParentRoute: () => rootRoutePublic,
  path: "/categories/clothing",
  component: Category,
})

//route tree
const routeTree = rootRoutePublic.addChildren([homeRoute, productRoute, cartRoute, categoryRoute]);
export const router = createRouter({ routeTree });
