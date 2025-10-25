export default function Login({onNavigate}: {onNavigate: (path: string) => void}) {
  return (
    <div className="container">
      <h1>Login Page</h1>
      <p>Please enter your credentials to log in.</p>
    </div>
  );
}