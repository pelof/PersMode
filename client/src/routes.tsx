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
import { Search } from "./routes/Search";
import { News } from "./routes/News";
import { Checkout } from "./routes/Checkout";

//root routes
const rootRoutePublic = createRootRoute({
  component: () => (
    <div className="max-w-screen-2xl mx-auto flex flex-col justify-center w-full min-h-screen">
      <PublicHeader />
      <main className="mx-2 flex-1">
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
  path: "/products/$slug",
  component: ProductDetails,
});
const cartRoute = createRoute({
  getParentRoute: () => rootRoutePublic,
  path: "/cart",
  component: Cart,
});
const checkoutRoute = createRoute({
  getParentRoute: () => rootRoutePublic,
  path: "/checkout",
  component: Checkout,
});
const categoryRoute = createRoute({
  getParentRoute: () => rootRoutePublic,
  path: "/categories/$category",
  component: Category,
});
const searchRoute = createRoute({
  getParentRoute: () => rootRoutePublic,
  path: "/search",
  component: Search,
});
const newsRoute = createRoute({
  getParentRoute: () => rootRoutePublic,
  path: "/news",
  component: News,
});

//route tree
const routeTree = rootRoutePublic.addChildren([
  homeRoute,
  productRoute,
  cartRoute,
  checkoutRoute,
  categoryRoute,
  searchRoute,
  newsRoute,
]);
export const router = createRouter({ routeTree });
