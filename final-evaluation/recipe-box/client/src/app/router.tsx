import { createBrowserRouter } from "react-router-dom";
import { Dashboard } from "../features/dashboard/components/Dashboard";
import { RecipeList } from "../features/recipes/components/RecipeList";
import { RecipeDetail } from "../features/recipes/components/RecipeDetail";
import { RecipeForm } from "../features/recipes/components/RecipeForm";
import { FavoritesPage } from "../features/favorites/components/FavoritesPage";
import { NotFound } from "../shared/components/NotFound";
import { ErrorBoundary } from "../shared/components/ErrorBoundary";
import { App } from "../App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "recipes",
        element: <RecipeList />,
      },
      {
        path: "recipes/new",
        element: <RecipeForm />,
      },
      {
        path: "recipes/:id",
        element: <RecipeDetail />,
      },
      {
        path: "recipes/:id/edit",
        element: <RecipeForm />,
      },
      {
        path: "favorites",
        element: <FavoritesPage />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
