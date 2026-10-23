import styles from "./StatsPanel.module.css";

// 🔴 TODO: Accept stats prop and use its properties dynamically
export function StatsPanel() {
  return (
    <div className={styles.panel}>
      <div className={styles.card}>
        <h3>Total Recipes</h3>
        <p className={styles.number}>15</p>
      </div>

      <div className={styles.card}>
        <h3>Avg Prep Time</h3>
        <p className={styles.number}>25 min</p>
      </div>

      <div className={styles.card}>
        <h3>Cuisine Distribution</h3>
        <div className={styles.distribution}>
          <div className={styles.distributionItem}>
            <span>Italian</span>
            <span className={styles.percentage}>20%</span>
          </div>
          <div className={styles.distributionItem}>
            <span>Chinese</span>
            <span className={styles.percentage}>20%</span>
          </div>
          <div className={styles.distributionItem}>
            <span>Japanese</span>
            <span className={styles.percentage}>15%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
