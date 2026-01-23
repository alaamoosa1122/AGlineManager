import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DataContext } from "../context/DataContext";

function Designs() {
  const { designs, fetchOrders } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState("");
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
              {isAdmin && (
                <button
                  onClick={() => handleDeleteDesign(d._id)}
                  style={styles.deleteBtn}
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
};

export default Designs;
