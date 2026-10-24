export interface DashboardStats {
  totalRecipes: number;
  avgPrepTime: number;
  cuisineDistribution: Array<{
    cuisine: string;
    count: number;
    percentage: number;
  }>;
}
