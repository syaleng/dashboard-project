export default function Settings({ theme, onThemeToggle }) {
  return (
    <div className="page-card settings-page">
      <h1>Settings</h1>
      <p>Manage your dashboard preferences here.</p>

      <div className="setting-row">
        <div>
          <h3>Theme Mode</h3>
          <p>
            Current theme: <strong>{theme}</strong>
          </p>
        </div>

        <button className="theme-toggle-button" onClick={onThemeToggle}>
          Switch to {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </div>
    </div>
  );
}
