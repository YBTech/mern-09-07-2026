import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <h1 className={styles.logo}>RecipeBox</h1>
        <div className={styles.links}>
          <NavLink 
            to="/" 
            className={({ isActive }: { isActive: boolean }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
            end
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/recipes" 
            className={({ isActive }: { isActive: boolean }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
          >
            Recipes
          </NavLink>
          <NavLink 
            to="/favorites" 
            className={({ isActive }: { isActive: boolean }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
          >
            Favorites
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
