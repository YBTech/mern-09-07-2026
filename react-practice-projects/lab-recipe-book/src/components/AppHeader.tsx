interface AppHeaderProps {
  title: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title }) => (
  <header className="app-header">
    <div className="logo">HB</div>
    <h1>{title}</h1>
  </header>
);
