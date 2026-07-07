import { useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");

    if (savedUser) {
      return JSON.parse(savedUser);
    }

    return null;
  });

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      return savedTheme;
    }

    return "light";
  });

  function handleLogin(user) {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
  }

  function handleLogout() {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  }

  function toggleTheme() {
    setTheme((previousTheme) => {
      const newTheme = previousTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  }

  return (
    <div className={`app-theme ${theme}`}>
      {currentUser ? (
        <Dashboard
          user={currentUser}
          onLogout={handleLogout}
          theme={theme}
          onThemeToggle={toggleTheme}
        />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}
