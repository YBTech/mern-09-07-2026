import styles from './RecipeFilter.module.css';

interface RecipeFilterProps {
  search: string;
  cuisine: string;
  difficulty: string;
  isVegetarian: string;
  sortBy: string;
  sortOrder: string;
  onSearchChange: (value: string) => void;
  onCuisineChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onVegetarianChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onSortOrderChange: (value: string) => void;
}

export function RecipeFilter({
  search,
  cuisine,
  difficulty,
  isVegetarian,
  sortBy,
  sortOrder,
  onSearchChange,
  onCuisineChange,
  onDifficultyChange,
  onVegetarianChange,
  onSortByChange,
  onSortOrderChange,
}: RecipeFilterProps) {
  return (
    <div className={styles.filters}>
      <input
        type="text"
        placeholder="Search recipes..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className={styles.search}
      />
      
      <select value={cuisine} onChange={(e) => onCuisineChange(e.target.value)} className={styles.select}>
        <option value="">All Cuisines</option>
        <option value="Chinese">Chinese</option>
        <option value="Japanese">Japanese</option>
        <option value="Italian">Italian</option>
        <option value="Mexican">Mexican</option>
        <option value="American">American</option>
        <option value="Indian">Indian</option>
        <option value="French">French</option>
        <option value="Thai">Thai</option>
        <option value="Other">Other</option>
      </select>

      <select value={difficulty} onChange={(e) => onDifficultyChange(e.target.value)} className={styles.select}>
        <option value="">All Difficulties</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <select value={isVegetarian} onChange={(e) => onVegetarianChange(e.target.value)} className={styles.select}>
        <option value="">All Recipes</option>
        <option value="true">Vegetarian Only</option>
        <option value="false">Non-Vegetarian</option>
      </select>

      <select value={sortBy} onChange={(e) => onSortByChange(e.target.value)} className={styles.select}>
        <option value="createdAt">Sort by Date</option>
        <option value="prepTimeMinutes">Sort by Prep Time</option>
        <option value="title">Sort by Title</option>
      </select>

      <select value={sortOrder} onChange={(e) => onSortOrderChange(e.target.value)} className={styles.select}>
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>
    </div>
  );
}
