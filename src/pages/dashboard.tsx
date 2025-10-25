export default function Dashboard({onNavigate}: {onNavigate: (path: string) => void}) {
  return (
    <div className="container">
      <h1>Dashboard Page</h1>
      <p>Welcome to your dashboard!</p>
    </div>
  );
}