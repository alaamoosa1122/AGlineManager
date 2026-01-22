import { Link, useLocation, useNavigate } from "react-router-dom";

function Sidebar({ isOpen, toggle }) {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role || "user";

  const allMenuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊", roles: ["admin"] },
    { path: "/orders", label: "Orders", icon: "📦", roles: ["admin", "user"] },
    { path: "/customers", label: "Customers", icon: "👥", roles: ["admin", "user"] },
    { path: "/designs", label: "Designs", icon: "👗", roles: ["admin", "user"] },
    { path: "/sales", label: "Sales", icon: "💰", roles: ["admin"] },
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(role));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <aside style={{
      ...styles.sidebar,
      width: isOpen ? "250px" : "80px",
    }}>
      <div style={styles.header}>
        {isOpen && <h2 style={styles.logo}>AGline</h2>}
        <button onClick={toggle} style={styles.toggleBtn}>
          {isOpen ? "❮" : "❯"}
        </button>
      </div>

      <nav style={styles.nav}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.link,
                backgroundColor: isActive ? "rgba(255, 117, 140, 0.2)" : "transparent",
                color: isActive ? "#ff758c" : "#a4b0be",
                justifyContent: isOpen ? "flex-start" : "center",
              }}
            >
              <span style={styles.icon}>{item.icon}</span>
              {isOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div style={styles.footer}>
        <button onClick={handleLogout} style={{
          ...styles.logoutBtn,
          justifyContent: isOpen ? "flex-start" : "center",
        }}>
          <span style={styles.icon}>🚪</span>
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    height: "100vh",
    background: "linear-gradient(180deg, #2c2c54 0%, #1a1a2e 100%)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    padding: "20px 10px",
    position: "fixed",
    left: 0,
    top: 0,
    boxShadow: "4px 0 15px rgba(0,0,0,0.2)",
    transition: "width 0.3s ease",
    zIndex: 1000,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "40px",
    padding: "0 10px",
    height: "40px",
  },
  logo: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#ff758c",
    margin: 0,
    letterSpacing: "1px",
    whiteSpace: "nowrap",
  },
  toggleBtn: {
    background: "rgba(255, 255, 255, 0.1)",
    border: "none",
    color: "#fff",
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    transition: "background 0.2s",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  link: {
    textDecoration: "none",
    fontSize: "15px",
    padding: "12px",
    borderRadius: "12px",
    transition: "all 0.3s",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    whiteSpace: "nowrap",
  },
  icon: {
    fontSize: "20px",
    minWidth: "24px",
    textAlign: "center",
  },
  footer: {
    marginTop: "auto",
    padding: "20px 0",
    borderTop: "1px solid rgba(255,255,255,0.05)",
  },
  logoutBtn: {
    width: "100%",
    background: "transparent",
    border: "none",
    color: "#ff4d4d",
    padding: "12px",
    borderRadius: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    fontSize: "15px",
    fontWeight: "500",
    transition: "all 0.3s",
  },
};

export default Sidebar;
