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
import { Category } from "./routes/Category";
import { Search } from "./routes/Search";
import { News } from "./routes/News";
import { Checkout } from "./routes/Checkout";
import { Confirmation } from "./routes/Confirmation";
import { Login } from "./routes/Login";
import { Register } from "./routes/Register";
import { ProductList } from "./routes/admin/ProductList";
import { AdminHeader } from "./components/AdminHeader";
import { AdminSidebar } from "./components/AdminSidebar";
import { NewProduct } from "./routes/admin/NewProduct";
import { Favorites } from "./routes/Favorites";

//root route

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// public-route
const rootRoutePublic = createRoute({
  getParentRoute: () => rootRoute,
  id: "public",
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


// admin-route
const rootRouteAdmin = createRoute({
  getParentRoute: () => rootRoute,
  id: "admin",
  component: () => (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar/>

        <main className="flex-1 m-10">
          <Outlet />
        </main>
      </div>
    </div>
  ),
});


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
const favoritesRoute = createRoute({
  getParentRoute: () => rootRoutePublic,
  path: "/favorites",
  component: Favorites,
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
const confirmationRoute = createRoute({
  getParentRoute: () => rootRoutePublic,
  path: "/order/confirmation",
  component: Confirmation,
});
const loginRoute = createRoute({
  getParentRoute: () => rootRoutePublic,
  path: "/login",
  component: Login,
});
const registerRoute = createRoute({
  getParentRoute: () => rootRoutePublic,
  path: "/register",
  component: Register,
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

// adminsidor
const productListRoute = createRoute({
  getParentRoute: () => rootRouteAdmin,
  path: "/admin/products",
  component: ProductList,
});
const newProductRoute = createRoute({
  getParentRoute: () => rootRouteAdmin,
  path: "/admin/products/new",
  component: NewProduct,
});

//route tree
const routeTree = rootRoute.addChildren([
  rootRoutePublic.addChildren([

    homeRoute,
    productRoute,
    favoritesRoute,
    cartRoute,
    checkoutRoute,
    confirmationRoute,
    loginRoute,
    registerRoute,
    categoryRoute,
    searchRoute,
    newsRoute,
  ]),
  rootRouteAdmin.addChildren([
    productListRoute,
    newProductRoute,
  ]),
]);
export const router = createRouter({ routeTree });


