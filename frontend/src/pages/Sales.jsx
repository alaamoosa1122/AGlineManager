import { useEffect, useState, useContext } from "react";
import { DataContext } from "../context/DataContext";

function Sales() {
  const { orders, designs, sales } = useContext(DataContext);
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    if (orders.length > 0) {
      const deliveredOrders = orders.filter((o) => o.isDelivered);
      const report = {};

      deliveredOrders.forEach((order) => {
        const design = designs.find((d) => d.code === order.abayaCode);
        if (design) {
          const profit = (order.price || 0) - (design.costPrice || 0);

          if (!report[order.abayaCode]) {
            report[order.abayaCode] = {
              code: order.abayaCode,
              count: 0,
              totalSales: 0,
              totalProfit: 0,
            };
          }

          report[order.abayaCode].count += 1;
          report[order.abayaCode].totalSales += order.price || 0;
          report[order.abayaCode].totalProfit += profit;
        } else {
          // Handle orders without a matching design
          const otherCode = "Other / Deleted Design";
          if (!report[otherCode]) {
            report[otherCode] = {
              code: otherCode,
              count: 0,
              totalSales: 0,
              totalProfit: 0,
            };
          }
          report[otherCode].count += 1;
          report[otherCode].totalSales += order.price || 0;
          // Profit remains 0 for unknown designs
        }
      });

      setSummary(Object.values(report));
    }
  }, [orders, designs]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Sales Dashboard</h1>

      {/* Cards */}
      <div style={styles.cardsContainer}>
        <div style={styles.card}>
          <div style={styles.cardIcon}>💰</div>
          <div>
            <h3 style={styles.cardTitle}>Total Sales</h3>
            <p style={styles.cardValue}>{sales.total} OMR</p>
          </div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardIcon}>📈</div>
          <div>
            <h3 style={styles.cardTitle}>Total Profit</h3>
            <p style={{ ...styles.cardValue, color: "#2ecc71" }}>{sales.profit} OMR</p>
          </div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardIcon}>📦</div>
          <div>
            <h3 style={styles.cardTitle}>Orders Delivered</h3>
            <p style={styles.cardValue}>{orders.filter((o) => o.isDelivered).length}</p>
          </div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardIcon}>👗</div>
          <div>
            <h3 style={styles.cardTitle}>Designs Sold</h3>
            <p style={styles.cardValue}>{summary.length}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Sales by Design</h2>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Abaya Code</th>
                <th style={styles.th}>Sold Quantity</th>
                <th style={styles.th}>Total Sales (OMR)</th>
                <th style={styles.th}>Total Profit (OMR)</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((item) => (
                <tr key={item.code} style={styles.tr}>
                  <td style={styles.td}>{item.code}</td>
                  <td style={styles.td}>{item.count}</td>
                  <td style={styles.td}>{item.totalSales}</td>
                  <td style={{ ...styles.td, color: "#2ecc71" }}>{item.totalProfit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
    marginBottom: "40px",
    textAlign: "center",
  },
  cardsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "25px",
    marginBottom: "50px",
  },
  card: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "25px",
    borderRadius: "20px",
    background: "#fff",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
    border: "1px solid #f0f0f0",
  },
  cardIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "15px",
    background: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    color: "#fff",
  },
  cardTitle: {
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "#888",
    marginBottom: "5px",
  },
  cardValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#2c2c54",
  },
  section: {
    background: "#fff",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
  },
  sectionTitle: {
    fontSize: "20px",
    marginBottom: "25px",
    color: "#2c2c54",
    fontWeight: "600",
  },
  tableWrapper: {
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
};

export default Sales;
