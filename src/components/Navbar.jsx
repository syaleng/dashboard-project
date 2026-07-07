import { useEffect, useState } from "react";

export default function Navbar({ user, onLogout, onToggleSidebar }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function getInitials(name) {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }

  const formattedTime = currentTime.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle-button" onClick={onToggleSidebar}>
          ☰
        </button>

        <div>
          <h2>Dashboard</h2>
          <p className="navbar-date">{formattedTime}</p>
        </div>
      </div>

      <div className="navbar-user">
        <div className="avatar-circle">{getInitials(user.name)}</div>

        <div className="profile-info">
          <strong>{user.name}</strong>
          <span>{user.email}</span>
        </div>

        <span className="user-role">{user.role}</span>

        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </div>
    </header>
  );
}
