import { useState } from "react";
import { users } from "../data/Users";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function getSystemUsers() {
    const savedUsers = localStorage.getItem("systemUsers");

    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers);

      const adminExists = parsedUsers.some(
        (user) => user.email.toLowerCase() === "admin@gmail.com",
      );

      if (!adminExists) {
        return [...users, ...parsedUsers];
      }

      return parsedUsers;
    }

    return users;
  }

  function handleLogin(e) {
    e.preventDefault();

    const systemUsers = getSystemUsers();

    const enteredEmail = email.trim().toLowerCase();
    const enteredPassword = password.trim();

    const foundUser = systemUsers.find(
      (user) =>
        user.email.trim().toLowerCase() === enteredEmail &&
        user.password.trim() === enteredPassword,
    );

    if (foundUser) {
      onLogin(foundUser);
      setEmail("");
      setPassword("");
      setError("");
    } else {
      setError("Invalid email or password.");
    }
  }

  return (
    <main className="login-page">
      <span className="bg-circle circle-one"></span>
      <span className="bg-circle circle-two"></span>
      <span className="bg-circle circle-three"></span>

      <form className="login-card" onSubmit={handleLogin}>
        <h1>Welcome Back</h1>
        <p>Please login to continue to your dashboard.</p>

        {error && <div className="error-message">{error}</div>}

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-button" type="submit">
          Login
        </button>
      </form>
    </main>
  );
}
