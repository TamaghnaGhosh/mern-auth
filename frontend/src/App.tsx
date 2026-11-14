import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:8000/api/auth";

const api = axios.create({
  baseURL: API,
  withCredentials: true
});

type User = {
  name: string;
  email: string;
};

function App() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");

  const getProfile = async () => {
    try {
      const response = await api.get("/profile");
      setUser({
        name: response.data.name,
        email: response.data.email
      });
    } catch (error: unknown) {
      setUser(null);
      if (axios.isAxiosError(error)) {
        if (error.response?.status !== 401) {
          setMessage(error.response?.data?.message ?? "Failed to load profile");
        }
      } else {
        setMessage("An unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const login = async () => {
    try {
      const response = await api.post("/login", { email, password });
      setMessage(response.data.message);
      await getProfile();
      setPassword("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message ?? "Something went wrong");
      } else {
        setMessage("An unexpected error occurred");
      }
    }
  };

  const register = async () => {
    try {
      const response = await api.post("/register", { name, email, password });
      setMessage(response.data.message);
      setName("");
      setEmail("");
      setPassword("");
      setMode("login");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message ?? "Something went wrong");
      } else {
        setMessage("An unexpected error occurred");
      }
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
      setUser(null);
      setMessage("Logged out");
      setPassword("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message ?? "Logout failed");
      } else {
        setMessage("An unexpected error occurred");
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === "login") {
      await login();
      return;
    }

    await register();
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        {!user ? (
          <>
            <div className="auth-header">
              <p className="eyebrow">Welcome</p>
              <h1>{mode === "login" ? "Login" : "Register"}</h1>
            </div>

            <div className="mode-toggle" role="tablist" aria-label="Authentication mode">
              <button
                type="button"
                className={mode === "login" ? "active" : ""}
                onClick={() => setMode("login")}
              >
                Login
              </button>
              <button
                type="button"
                className={mode === "register" ? "active" : ""}
                onClick={() => setMode("register")}
              >
                Register
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {mode === "register" && (
                <label>
                  <span>Name</span>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </label>
              )}

              <label>
                <span>Email</span>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>

              <label>
                <span>Password</span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </label>

              <button type="submit" className="primary-btn">
                {mode === "login" ? "Login" : "Create account"}
              </button>
            </form>
          </>
        ) : (
          <div className="profile-card">
            <p className="eyebrow">Profile</p>
            <h2>Welcome {user.name}</h2>
            <p>{user.email}</p>
            <button type="button" className="primary-btn" onClick={logout}>
              Logout
            </button>
          </div>
        )}

        {message && <p className="status-message">{message}</p>}
      </div>
    </div>
  );
}

export default App;