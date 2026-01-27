import { useEffect, useState } from "react";

function Customers() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editForm, setEditForm] = useState({});

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

  const handleEditClick = (order) => {
    setEditingCustomer(order._id);
    setEditForm({
      customerName: order.customerName,
      phone: order.phone,
      abayaCode: order.abayaCode,
    });
  };

  const handleEditSave = async () => {
    try {
      const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
      const res = await fetch(`${baseUrl}/api/orders/${editingCustomer}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        await fetchOrders();
        setEditingCustomer(null);
        setEditForm({});
      } else {
        alert("Failed to update customer");
      }
    } catch (err) {
      console.error("Failed to update customer:", err);
      alert("Failed to update customer");
    }
  };

  const handleEditCancel = () => {
    setEditingCustomer(null);
    setEditForm({});
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
              <th style={styles.th}>Actions</th>
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
                  <td style={styles.td}>
                    <button
                      onClick={() => handleEditClick(o)}
                      style={styles.editBtn}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteOrder(o._id)}
                        style={styles.deleteBtn}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingCustomer && (
        <div style={styles.modalOverlay} onClick={handleEditCancel}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Edit Customer</h2>
            <div style={styles.modalForm}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Customer Name</label>
                <input
                  type="text"
                  value={editForm.customerName}
                  onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Phone</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Abaya Code</label>
                <input
                  type="text"
                  value={editForm.abayaCode}
                  onChange={(e) => setEditForm({ ...editForm, abayaCode: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.modalActions}>
                <button onClick={handleEditSave} style={styles.saveBtn}>
                  Save Changes
                </button>
                <button onClick={handleEditCancel} style={styles.cancelBtn}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
  editBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    padding: "5px",
    marginRight: "8px",
    borderRadius: "5px",
    transition: "background 0.2s",
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
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    borderRadius: "20px",
    padding: "40px",
    maxWidth: "500px",
    width: "90%",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  modalTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#2c2c54",
    marginBottom: "30px",
    textAlign: "center",
  },
  modalForm: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#555",
    marginBottom: "8px",
  },
  input: {
    padding: "12px",
    fontSize: "15px",
    borderRadius: "10px",
    border: "1px solid #eee",
    background: "#fcfcfc",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  },
  modalActions: {
    display: "flex",
    gap: "15px",
    marginTop: "10px",
  },
  saveBtn: {
    flex: 1,
    padding: "14px",
    fontSize: "16px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    boxShadow: "0 5px 15px rgba(255, 117, 140, 0.2)",
    transition: "transform 0.2s",
  },
  cancelBtn: {
    flex: 1,
    padding: "14px",
    fontSize: "16px",
    borderRadius: "12px",
    border: "1px solid #eee",
    background: "#fff",
    color: "#666",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s",
  },
};

export default Customers;
