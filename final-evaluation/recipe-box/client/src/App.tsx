import { Outlet } from "react-router-dom";
// 考点: Context Provider for global state
import { FavoritesProvider } from "./features/favorites/context/FavoritesContext";
import { Navbar } from "./shared/components/Navbar";
import styles from "./app/App.module.css";

export function App() {
  // 考点: wrapping app with Context Provider
  return (
    <FavoritesProvider>
      <div className={styles.app}>
        <Navbar />
        {/* 考点: Outlet for nested routes */}
        <Outlet />
      </div>
    </FavoritesProvider>
  );
}
