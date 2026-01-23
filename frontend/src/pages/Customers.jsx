import { useEffect, useState } from "react";

function Customers() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // جلب الطلبات من السيرفر
  const fetchOrders = async () => {
    try {
      const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
      const res = await fetch(`${baseUrl}/api/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  // تبديل حالة الاستلام
  const toggleDelivered = async (id, currentValue) => {
    try {
      const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
      const res = await fetch(`${baseUrl}/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDelivered: !currentValue }),
      });

      const updatedOrder = await res.json();

      setOrders((prev) =>
        prev.map((o) =>
          o._id === id
            ? { ...o, isDelivered: updatedOrder.isDelivered, status: updatedOrder.status }
            : o
        )
      );
    } catch (err) {
      console.error("Failed to update delivery status", err);
    }
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer record?")) return;
    try {
      const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
      const res = await fetch(`${baseUrl}/api/orders/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchOrders();
      } else {
        alert("Failed to delete record");
      }
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Customers</h1>

      <div style={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search by name, phone or abaya code..."
          style={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Abaya Code</th>
              <th style={styles.th}>Delivered</th>
              {isAdmin && <th style={styles.th}>Action</th>}
            </tr>
          </thead>
          <tbody>
            {orders
              .filter((o) => {
                const term = searchTerm.toLowerCase();
                return (
                  o.customerName?.toLowerCase().includes(term) ||
                  o.phone?.includes(term) ||
                  o.abayaCode?.toLowerCase().includes(term)
                );
              })
              .map((o) => (
                <tr key={o._id} style={styles.tr}>
                  <td style={styles.td}>{o.customerName}</td>
                  <td style={styles.td}>{o.phone}</td>
                  <td style={styles.td}>{o.abayaCode}</td>
                  <td style={styles.td}>
                    <input
                      type="checkbox"
                      checked={o.isDelivered}
                      onChange={() => toggleDelivered(o._id, o.isDelivered)}
                      style={styles.checkbox}
                    />
                  </td>
                  {isAdmin && (
                    <td style={styles.td}>
                      <button
                        onClick={() => handleDeleteOrder(o._id)}
                        style={styles.deleteBtn}
                      >
                        🗑️
                      </button>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    fontFamily: "'Poppins', sans-serif",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#2c2c54",
    marginBottom: "30px",
    textAlign: "center",
  },
  searchWrapper: {
    maxWidth: "900px",
    margin: "0 auto 30px auto",
    display: "flex",
    justifyContent: "center",
  },
  searchInput: {
    width: "100%",
    padding: "15px 25px",
    borderRadius: "15px",
    border: "1px solid #eee",
    fontSize: "16px",
    outline: "none",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
    fontFamily: "inherit",
    transition: "all 0.3s ease",
    "&:focus": {
      borderColor: "#ff758c",
      boxShadow: "0 5px 20px rgba(255, 117, 140, 0.1)",
    }
  },
  tableWrapper: {
    background: "#fff",
    padding: "20px",
    borderRadius: "20px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
    overflowX: "auto",
    maxWidth: "900px",
    margin: "0 auto",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 10px",
  },
  th: {
    padding: "15px",
    textAlign: "left",
    color: "#888",
    fontSize: "13px",
    fontWeight: "500",
    borderBottom: "1px solid #eee",
  },
  tr: {
    transition: "transform 0.2s",
  },
  td: {
    padding: "15px",
    color: "#333",
    background: "#fff",
    borderTop: "1px solid #f9f9f9",
    borderBottom: "1px solid #f9f9f9",
    fontSize: "14px",
    fontWeight: "500",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
    accentColor: "#ff758c",
  },
  deleteBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    padding: "5px",
    borderRadius: "5px",
    transition: "background 0.2s",
  },
};

export default Customers;
