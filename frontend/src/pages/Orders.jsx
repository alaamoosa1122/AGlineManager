import { useContext, useState, useEffect } from "react";
import { DataContext } from "../context/DataContext";
import { useNavigate } from "react-router-dom";

function Orders() {
  const { orders, fetchOrders } = useContext(DataContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // لا نحتاج orderStatuses إذا كان هناك isDelivered موجود
  const getStatus = (order) => {
    if (order.isDelivered) return "تم الاستلام";

    if (!order.createdAt) return "New";
    const createdDate = new Date(order.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));

    if (diffDays <= 2) return "New";
    if (diffDays >= 3 && diffDays <= 13) return "In Progress";
    return "Delayed";
  };

  // ستايل الحالة
  const statusStyle = (status) => {
    switch (status) {
      case "New":
        return {
          backgroundColor: "#e0f7fa",
          color: "#006064",
          fontWeight: "600",
          padding: "6px 12px",
          borderRadius: "8px",
          textAlign: "center",
        };
      case "In Progress":
        return {
          backgroundColor: "#fff3e0",
          color: "#e65100",
          fontWeight: "600",
          padding: "6px 12px",
          borderRadius: "8px",
          textAlign: "center",
        };
      case "Delayed":
        return {
          backgroundColor: "#ffebee",
          color: "#c62828",
          fontWeight: "600",
          padding: "6px 12px",
          borderRadius: "8px",
          textAlign: "center",
        };
      case "تم الاستلام":
        return {
          backgroundColor: "#e8f5e9",
          color: "#2e7d32",
          fontWeight: "600",
          padding: "6px 12px",
          borderRadius: "8px",
          textAlign: "center",
        };
      default:
        return {};
    }
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchOrders();
      } else {
        alert("Failed to delete order");
      }
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Orders</h1>

      <div style={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search by customer, code, or location..."
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
              <th style={styles.th}>Abaya</th>
              <th style={styles.th}>Size (L/W/S)</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Deposit</th>
              <th style={styles.th}>Notes</th>
              <th style={styles.th}>Status</th>
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
                  o.abayaCode?.toLowerCase().includes(term) ||
                  o.deliveryLocation?.toLowerCase().includes(term)
                );
              })
              .map((o) => (
                <tr key={o._id} style={styles.tr}>
                  <td style={styles.td}>{o.customerName}</td>
                  <td style={styles.td}>{o.phone}</td>
                  <td style={styles.td}>{o.abayaCode}</td>
                  <td style={styles.td}>{o.length} / {o.width} / {o.sleeveLength}</td>
                  <td style={styles.td}>{o.deliveryLocation}</td>
                  <td style={styles.td}>{o.price} OMR</td>
                  <td style={styles.td}>{o.deposit ? `${o.deposit} OMR` : "-"}</td>
                  <td style={styles.td}>{o.notes || "-"}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      ...statusStyle(getStatus(o))
                    }}>
                      {getStatus(o)}
                    </span>
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

      <button
        onClick={() => navigate("/add-order")}
        style={styles.addButton}
      >
        +
      </button>
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
    maxWidth: "1100px",
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
  },
  tableWrapper: {
    background: "#fff",
    padding: "20px",
    borderRadius: "20px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
    overflowX: "auto",
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
  statusBadge: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block",
  },
  addButton: {
    position: "fixed",
    bottom: "40px",
    right: "40px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    fontSize: "30px",
    background: "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(255, 117, 140, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s",
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

export default Orders;
