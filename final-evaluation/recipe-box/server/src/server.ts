import app from './app.js';
import { seedDatabase } from './db/seed.js';

const PORT = process.env.PORT || 4000;

seedDatabase();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/api`);
});
