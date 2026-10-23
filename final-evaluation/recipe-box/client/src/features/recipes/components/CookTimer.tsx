import styles from "./CookTimer.module.css";

export function CookTimer() {
  // 🔴 TODO: Implement timer with useState, useEffect, useRef for interval management and auto-focus

  return (
    <div className={styles.timer}>
      <h3>Cook Timer</h3>
      <div className={styles.controls}>
        <input
          type="number"
          min="0"
          value={0}
          onChange={() => {}}
          placeholder="Minutes"
          className={styles.input}
        />
        <button onClick={() => {}} className={styles.button}>
          Start
        </button>
        <button onClick={() => {}} className={styles.button}>
          Reset
        </button>
      </div>
      <div className={styles.display}>0:00</div>
    </div>
  );
}
