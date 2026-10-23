import { StatsPanel } from "./StatsPanel";
import { FeaturedRecipes } from "./FeaturedRecipes";
import styles from "./Dashboard.module.css";

export function Dashboard() {
  // 🔴 TODO:
  // 1. Fetch /api/stats using fetch, /api/stats/featured using axios (Bonus: extract the logic to dashboardApi.ts)
  // 2. Display loading state and handle errors
  // 3. Pass data to StatsPanel and FeaturedRecipes components

  return (
    <div className={styles.container}>
      <h1>Dashboard</h1>
      <StatsPanel />
      <FeaturedRecipes />
    </div>
  );
}
