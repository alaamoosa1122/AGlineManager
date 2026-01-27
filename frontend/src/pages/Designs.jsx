import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DataContext } from "../context/DataContext";

function Designs() {
  const { designs, fetchOrders, updateDesign } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDesign, setEditingDesign] = useState(null);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 يعيد الجلب كل مرة تدخل الصفحة
  useEffect(() => {
    fetchOrders();
  }, [location]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  const handleDeleteDesign = async (id) => {
    if (!window.confirm("Are you sure you want to delete this design?")) return;
    try {
      const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
      const res = await fetch(`${baseUrl}/api/designs/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchOrders();
      } else {
        alert("Failed to delete design");
      }
    } catch (err) {
      console.error("Error deleting design:", err);
    }
  };

  const handleEditClick = (design) => {
    setEditingDesign(design._id);
    setEditForm({
      code: design.code,
      costPrice: design.costPrice,
      sellingPrice: design.sellingPrice,
      notes: design.notes || "",
      image: design.image,
    });
  };

  const handleEditSave = async () => {
    const success = await updateDesign(editingDesign, editForm);
    if (success) {
      setEditingDesign(null);
      setEditForm({});
    } else {
      alert("Failed to update design");
    }
  };

  const handleEditCancel = () => {
    setEditingDesign(null);
    setEditForm({});
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Abaya Designs</h1>

      <div style={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search by code or notes..."
          style={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={styles.cards}>
        {designs
          .filter((d) => {
            const term = searchTerm.toLowerCase();
            return (
              d.code?.toLowerCase().includes(term) ||
              d.notes?.toLowerCase().includes(term)
            );
          })
          .map((d) => (
            <div style={styles.card} key={d._id}>
              <button
                onClick={() => handleEditClick(d)}
                style={styles.editBtn}
                title="Edit"
              >
                ✏️
              </button>
              {isAdmin && (
                <button
                  onClick={() => handleDeleteDesign(d._id)}
                  style={styles.deleteBtn}
                  title="Delete"
                >
                  🗑️
                </button>
              )}
              <img
                src={d.image || "https://via.placeholder.com/150"}
                alt={d.code}
                style={styles.image}
              />
              <div style={styles.info}>
                <h3 style={styles.cardCode}>{d.code}</h3>
                {isAdmin && (
                  <div style={styles.priceRow}>
                    <span style={styles.priceLabel}>Cost:</span>
                    <span style={styles.priceValue}>{d.costPrice} OMR</span>
                  </div>
                )}
                <div style={styles.priceRow}>
                  <span style={styles.priceLabel}>Sell:</span>
                  <span style={{ ...styles.priceValue, color: "#ff758c" }}>{d.sellingPrice} OMR</span>
                </div>
                <p style={styles.notes}>{d.notes || "No notes"}</p>
              </div>
            </div>
          ))}
      </div>

      <button
        style={styles.addButton}
        onClick={() => navigate("/add-design")}
      >
        +
      </button>

      {/* Edit Modal */}
      {editingDesign && (
        <div style={styles.modalOverlay} onClick={handleEditCancel}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Edit Design</h2>
            <div style={styles.modalForm}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Design Code</label>
                <input
                  type="text"
                  value={editForm.code}
                  onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                  style={styles.input}
                />
              </div>

              {isAdmin && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Cost Price (OMR)</label>
                  <input
                    type="number"
                    value={editForm.costPrice}
                    onChange={(e) => setEditForm({ ...editForm, costPrice: parseFloat(e.target.value) })}
                    style={styles.input}
                  />
                </div>
              )}

              <div style={styles.formGroup}>
                <label style={styles.label}>Selling Price (OMR)</label>
                <input
                  type="number"
                  value={editForm.sellingPrice}
                  onChange={(e) => setEditForm({ ...editForm, sellingPrice: parseFloat(e.target.value) })}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Notes</label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  style={{ ...styles.input, minHeight: "80px" }}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Design Image</label>
                {editForm.image && (
                  <img
                    src={editForm.image}
                    alt="Preview"
                    style={styles.imagePreview}
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={styles.fileInput}
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
    maxWidth: "1200px",
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
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "30px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  card: {
    background: "#fff",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
    transition: "transform 0.3s ease",
    border: "1px solid #f0f0f0",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
  },
  info: {
    padding: "20px",
  },
  cardCode: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#2c2c54",
    marginBottom: "15px",
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontSize: "14px",
  },
  priceLabel: {
    color: "#888",
  },
  priceValue: {
    fontWeight: "600",
    color: "#333",
  },
  notes: {
    marginTop: "15px",
    fontSize: "13px",
    color: "#aaa",
    fontStyle: "italic",
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
    position: "absolute",
    top: "10px",
    left: "10px",
    background: "rgba(255, 255, 255, 0.9)",
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "16px",
    zIndex: 1,
    transition: "all 0.2s",
  },
  deleteBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "rgba(255, 255, 255, 0.8)",
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "16px",
    zIndex: 1,
    transition: "all 0.2s",
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
    maxWidth: "600px",
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
  imagePreview: {
    width: "100%",
    maxHeight: "200px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  fileInput: {
    padding: "10px",
    fontSize: "14px",
    borderRadius: "10px",
    border: "1px solid #eee",
    background: "#fcfcfc",
    cursor: "pointer",
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

export default Designs;
