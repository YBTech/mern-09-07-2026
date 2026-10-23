import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1 style={{ fontSize: '4rem', margin: '0' }}>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" style={{ color: '#3498db', textDecoration: 'none' }}>
        Go back home
      </Link>
    </div>
  );
}
