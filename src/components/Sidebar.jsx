export default function Sidebar({
  activePage,
  onPageChange,
  user,
  isSidebarOpen,
  onCloseSidebar,
}) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      roles: ["admin", "user"],
    },
    {
      id: "users",
      label: "Users",
      roles: ["admin"],
    },
    {
      id: "reports",
      label: "Reports",
      roles: ["admin"],
    },
    {
      id: "settings",
      label: "Settings",
      roles: ["admin", "user"],
    },
  ];

  const allowedMenuItems = menuItems.filter((item) =>
    item.roles.includes(user.role),
  );

  function handleMenuClick(pageId) {
    onPageChange(pageId);

    if (onCloseSidebar) {
      onCloseSidebar();
    }
  }

  return (
    <aside className={isSidebarOpen ? "sidebar sidebar-open" : "sidebar"}>
      <h2 className="sidebar-logo">MyDashboard</h2>

      <nav className="sidebar-menu">
        {allowedMenuItems.map((item) => (
          <button
            key={item.id}
            className={
              activePage === item.id ? "menu-item active" : "menu-item"
            }
            onClick={() => handleMenuClick(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
