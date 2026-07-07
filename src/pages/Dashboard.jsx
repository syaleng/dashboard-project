import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import Users from "./Users";
import Reports from "./Reports";
import Settings from "./Settings";
import AccessDenied from "./AccessDenied";
import { users } from "../data/Users";
import { reports } from "../data/reports";

export default function Dashboard({ user, onLogout, theme, onThemeToggle }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function getSystemUsers() {
    const savedUsers = localStorage.getItem("systemUsers");

    if (savedUsers) {
      return JSON.parse(savedUsers);
    }

    return users;
  }

  function getSystemReports() {
    const savedReports = localStorage.getItem("systemReports");

    if (savedReports) {
      return JSON.parse(savedReports);
    }

    return reports;
  }

  const systemUsers = getSystemUsers();
  const systemReports = getSystemReports();

  const completedReports = systemReports.filter(
    (report) => report.status === "completed",
  ).length;

  const dashboardStats = [
    {
      id: 1,
      title: "Total Users",
      value: systemUsers.length,
      description: "Registered users",
    },
    {
      id: 2,
      title: "Total Reports",
      value: systemReports.length,
      description: "Generated reports",
    },
    {
      id: 3,
      title: "Completed Reports",
      value: completedReports,
      description: "Finished reports",
    },
    {
      id: 4,
      title: "System Status",
      value: "Good",
      description: "All services running",
    },
  ];

  function hasAccess(page) {
    const pagePermissions = {
      dashboard: ["admin", "user"],
      users: ["admin"],
      reports: ["admin"],
      settings: ["admin", "user"],
    };

    return pagePermissions[page]?.includes(user.role);
  }

  function renderPage() {
    if (!hasAccess(activePage)) {
      return <AccessDenied />;
    }

    if (activePage === "users") {
      return <Users currentUser={user} />;
    }

    if (activePage === "reports") {
      return <Reports />;
    }

    if (activePage === "settings") {
      return <Settings theme={theme} onThemeToggle={onThemeToggle} />;
    }

    return (
      <>
        <div className="welcome-card">
          <h1>Welcome to your dashboard</h1>
          <p>
            You are logged in as <strong>{user.role}</strong>. This dashboard
            includes role-based pages, theme settings, and protected access.
          </p>
        </div>

        <div className="stats-grid">
          {dashboardStats.map((stat) => (
            <StatCard
              key={stat.id}
              title={stat.title}
              value={stat.value}
              description={stat.description}
            />
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar
        activePage={activePage}
        onPageChange={setActivePage}
        user={user}
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={() => setIsSidebarOpen(false)}
      />

      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <main className="dashboard-main">
        <Navbar
          user={user}
          onLogout={onLogout}
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />

        <section className="dashboard-content">{renderPage()}</section>
      </main>
    </div>
  );
}
