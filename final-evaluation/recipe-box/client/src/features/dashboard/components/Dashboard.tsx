import { StatsPanel } from "./StatsPanel";
import { FeaturedRecipes } from "./FeaturedRecipes";
import styles from "./Dashboard.module.css";

export function Dashboard() {
  // 🔴 TODO:
  // 1. Fetch GET /stats using fetch and GET /stats/featured using axios (base URL: http://localhost:4000/api)
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
