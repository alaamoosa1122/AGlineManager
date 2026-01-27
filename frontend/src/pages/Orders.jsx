import { useContext, useState, useEffect } from "react";
import { DataContext } from "../context/DataContext";
import { useNavigate } from "react-router-dom";

function Orders() {
  const { orders, fetchOrders, updateOrder } = useContext(DataContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);
  const [editForm, setEditForm] = useState({});

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
      const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
      const res = await fetch(`${baseUrl}/api/orders/${id}`, {
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

  const handleEditClick = (order) => {
    setEditingOrder(order._id);
    setEditForm({
      customerName: order.customerName,
      phone: order.phone,
      abayaCode: order.abayaCode,
      length: order.length,
      width: order.width,
      sleeveLength: order.sleeveLength,
      deliveryLocation: order.deliveryLocation,
      price: order.price,
      deposit: order.deposit || 0,
      notes: order.notes || "",
    });
  };

  const handleEditSave = async () => {
    const success = await updateOrder(editingOrder, editForm);
    if (success) {
      setEditingOrder(null);
      setEditForm({});
    } else {
      alert("Failed to update order");
    }
  };

  const handleEditCancel = () => {
    setEditingOrder(null);
    setEditForm({});
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

      <button
        onClick={() => navigate("/add-order")}
        style={styles.addButton}
      >
        +
      </button>

      {/* Edit Modal */}
      {editingOrder && (
        <div style={styles.modalOverlay} onClick={handleEditCancel}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Edit Order</h2>
            <div style={styles.modalForm}>
              <div style={styles.formRow}>
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
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Abaya Code</label>
                  <input
                    type="text"
                    value={editForm.abayaCode}
                    onChange={(e) => setEditForm({ ...editForm, abayaCode: e.target.value })}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Delivery Location</label>
                  <input
                    type="text"
                    value={editForm.deliveryLocation}
                    onChange={(e) => setEditForm({ ...editForm, deliveryLocation: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Length</label>
                  <input
                    type="text"
                    value={editForm.length}
                    onChange={(e) => setEditForm({ ...editForm, length: e.target.value })}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Width</label>
                  <input
                    type="text"
                    value={editForm.width}
                    onChange={(e) => setEditForm({ ...editForm, width: e.target.value })}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Sleeve Length</label>
                  <input
                    type="text"
                    value={editForm.sleeveLength}
                    onChange={(e) => setEditForm({ ...editForm, sleeveLength: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Price (OMR)</label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Deposit (OMR)</label>
                  <input
                    type="number"
                    value={editForm.deposit}
                    onChange={(e) => setEditForm({ ...editForm, deposit: parseFloat(e.target.value) })}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Notes</label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  style={{ ...styles.input, minHeight: "80px" }}
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
    maxWidth: "700px",
    width: "90%",
    maxHeight: "90vh",
    overflowY: "auto",
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
  formRow: {
    display: "flex",
    gap: "15px",
  },
  formGroup: {
    flex: 1,
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

export default Orders;
