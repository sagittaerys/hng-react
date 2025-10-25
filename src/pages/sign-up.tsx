import { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/header";


interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function SignUp({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validateInputs() {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) newErrors.name = "Full name is required.";
    if (!email.trim()) newErrors.email = "Email address is required.";
    else if (!emailRegex.test(email)) newErrors.email = "Please enter a valid email address.";

    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 8) newErrors.password = "Password must be at least 8 characters.";

    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password.";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: string;
  }

  function handleSignup(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!validateInputs()) return;

    setIsLoading(true);
    setSuccessMessage("");

    try {
      const users = JSON.parse(localStorage.getItem("ticketapp_users") || "[]") as User[];
      const existingUser = users.find((u: User) => u.email === email);

      if (existingUser) {
        setErrors({ email: "Email already exists. Please sign in instead." });
        setIsLoading(false);
        return;
      }

      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem("ticketapp_users", JSON.stringify(users));

      setSuccessMessage("Account created successfully! Redirecting to dashboard...");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setErrors({});

      setTimeout(() => onNavigate("/dashboard"), 2000);
    } catch (err) {
      console.error("Unexpected error:", err);
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <NavBar onNavigate={onNavigate} />
    
    <section style={{
      maxWidth: "28rem",
      margin: "2.5rem auto",
      padding: "1.5rem",
      borderRadius: "0.5rem",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    }}>
      <h2 style={{
        fontSize: "2rem",
        color: "#a78bfa",
        fontWeight: "900",
        textAlign: "center",
        marginBottom: "1.5rem"
      }}>
        Create Account
      </h2>

      {errors.general && (
        <div style={{
          color: "#dc2626",
          border: "1px solid #fca5a5",
          backgroundColor: "#fee2e2",
          textAlign: "center",
          padding: "0.5rem",
          borderRadius: "0.375rem",
          fontSize: "0.875rem",
          marginBottom: "0.75rem"
        }}>
          {errors.general}
        </div>
      )}

      {successMessage && (
        <div style={{
          color: "#059669",
          border: "1px solid #6ee7b7",
          backgroundColor: "#d1fae5",
          textAlign: "center",
          padding: "0.5rem",
          borderRadius: "0.375rem",
          fontSize: "0.875rem",
          marginBottom: "0.75rem"
        }}>
          {successMessage}
        </div>
      )}

      <div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="name" style={{
            display: "block",
            marginBottom: "0.5rem",
            color: "#a78bfa",
            fontSize: "0.875rem",
            fontWeight: "500"
          }}>
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "0.625rem",
              border: errors.name ? "1px solid #a78bfa" : "1px solid #d1d5db",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              outline: "none"
            }}
            onFocus={(e) => e.target.style.borderColor = "#a78bfa"}
            onBlur={(e) => e.target.style.borderColor = errors.name ? "#a78bfa" : "#d1d5db"}
          />
          {errors.name && (
            <p style={{ color: "#a78bfa", fontSize: "0.75rem", marginTop: "0.25rem" }}>
              {errors.name}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="email" style={{
            display: "block",
            marginBottom: "0.5rem",
            color: "#a78bfa",
            fontSize: "0.875rem",
            fontWeight: "500"
          }}>
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "0.625rem",
              border: errors.email ? "1px solid #a78bfa" : "1px solid #d1d5db",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              outline: "none"
            }}
            onFocus={(e) => e.target.style.borderColor = "#a78bfa"}
            onBlur={(e) => e.target.style.borderColor = errors.email ? "#a78bfa" : "#d1d5db"}
          />
          {errors.email && (
            <p style={{ color: "#a78bfa", fontSize: "0.75rem", marginTop: "0.25rem" }}>
              {errors.email}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="password" style={{
            display: "block",
            marginBottom: "0.5rem",
            color: "#a78bfa",
            fontSize: "0.875rem",
            fontWeight: "500"
          }}>
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password (8+ characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "0.625rem",
              border: errors.password ? "1px solid #a78bfa" : "1px solid #d1d5db",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              outline: "none"
            }}
            onFocus={(e) => e.target.style.borderColor = "#a78bfa"}
            onBlur={(e) => e.target.style.borderColor = errors.password ? "#a78bfa" : "#d1d5db"}
          />
          {errors.password && (
            <p style={{ color: "#a78bfa", fontSize: "0.75rem", marginTop: "0.25rem" }}>
              {errors.password}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="confirmPassword" style={{
            display: "block",
            marginBottom: "0.5rem",
            color: "#a78bfa",
            fontSize: "0.875rem",
            fontWeight: "500"
          }}>
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "0.625rem",
              border: errors.confirmPassword ? "1px solid #a78bfa" : "1px solid #d1d5db",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              outline: "none"
            }}
            onFocus={(e) => e.target.style.borderColor = "#a78bfa"}
            onBlur={(e) => e.target.style.borderColor = errors.confirmPassword ? "#a78bfa" : "#d1d5db"}
          />
          {errors.confirmPassword && (
            <p style={{ color: "#a78bfa", fontSize: "0.75rem", marginTop: "0.25rem" }}>
              {errors.confirmPassword}
            </p>
          )}
        </div>


        <button
          type="button"
          className="sign-up-btn"
          onClick={handleSignup}
          disabled={isLoading}
          style={{
            
          }}
        
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>


        {/* solved */}

        <div className="login-route">
          <p>Already have an account?</p>    
        
        <Link className="linking" to="/login" >
          Sign In
        </Link>
        
      </div>
    </div>
           
           
           
      </section>
  </div>
      
  );
}
