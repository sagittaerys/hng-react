import { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/header";


export default function Login({onNavigate}: {onNavigate: (path: string) => void}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  function validateInputs() {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  interface User {
    id: string;
    email: string;
    password: string;
    name: string;
  }

  interface SessionToken {
    userId: string;
    email: string;
    name: string;
    loginTime: string;
    expiresAt: string;
  }

  function handleLogin(e: React.FormEvent<HTMLButtonElement>): void {
    e.preventDefault();

    if (!validateInputs()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // get users from localStorage
      const users: User[] = JSON.parse(localStorage.getItem("ticketapp_users") || "[]");
      
      // find user with matching email and password
      const user: User | undefined = users.find(u => u.email === email && u.password === password);

      if (!user) {
        setErrors({ 
          general: "Invalid credentials. Please check your email and password." 
        });
        setIsLoading(false);
        return;
      }

      // Create session token
      const sessionToken: SessionToken = {
        userId: user.id,
        email: user.email,
        name: user.name,
        loginTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };

      // store session in localStorage
      localStorage.setItem("ticketapp_session", JSON.stringify(sessionToken));

      // Show success and redirect
      setTimeout(() => {
        onNavigate("/dashboard");
      }, 500);

    } catch (err: unknown) {
      console.error("Unexpected error:", err);
      setErrors({ 
        general: "An unexpected error occurred. Please try again." 
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      

      <div className="auth-container-tall">
        <h2 className="auth-heading">Welcome Back!</h2>

        <div>
          {errors.general && (
            <div className="alert-error">{errors.general}</div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label-spaced">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`form-input ${errors.email ? 'error' : ''}`}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label-spaced">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`form-input ${errors.password ? 'error' : ''} mb-3`}
            />
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          <div className="auth-footer-spaced">
            <p className="auth-footer-text">Don't have an account?</p>

            <Link to="/sign-up" className="btn-link"
            >
              Register Here
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}