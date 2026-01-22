import { useContext } from "react";
import { DataContext } from "../context/DataContext";

function Dashboard() {
    const { orders = [], customers = [], designs = [], sales = {} } = useContext(DataContext);

    // ============================
    // إحصائيات أساسية
    // ============================
    const totalOrders = orders.length;
    const totalCustomers = customers.length;
    const totalDesigns = designs.length;
    const totalSales = sales.total || 0;
    const totalProfit = sales.profit || 0;

    // الزبون الأكثر طلبًا
    const mostActiveCustomer = (() => {
        if (!orders.length) return "-";
        const count = {};
        orders.forEach(o => count[o.customerName] = (count[o.customerName] || 0) + 1);
        return Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];
    })();

    // التصميم الأكثر طلبًا
    const mostOrderedDesign = (() => {
        if (!orders.length) return "-";
        const count = {};
        orders.forEach(o => count[o.abayaCode] = (count[o.abayaCode] || 0) + 1);
        return Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];
    })();

    const topDesignObj = designs.find(d => d.code === mostOrderedDesign);

    // المبيعات الشهرية
    const monthlySales = (() => {
        const monthly = {};
        orders.forEach(o => {
            const month = new Date(o.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
            monthly[month] = (monthly[month] || 0) + o.price;
        });
        return monthly;
    })();

    const months = Object.keys(monthlySales);
    const monthValues = Object.values(monthlySales);

    // آخر 5 طلبات
    const recentOrders = orders.slice(-5).reverse();

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>AGline abaya</h1>

            {/* ================= Top Info ================= */}
            <div style={styles.topCards}>
                <div style={styles.featureCard}>
                    <h3 style={styles.cardTitle}>الزبون المفضل</h3>
                    <p style={styles.cardValue}>{mostActiveCustomer}</p>
                </div>
                <div style={styles.featureCard}>
                    <h3 style={styles.cardTitle}>التصميم الأكثر طلبًا</h3>
                    <p style={styles.cardValue}>{mostOrderedDesign}</p>
                    {topDesignObj && topDesignObj.image && (
                        <img src={topDesignObj.image} alt={mostOrderedDesign} style={styles.topDesignImage} />
                    )}
                </div>
            </div>

            {/* ================= Stats Cards ================= */}
            <div style={styles.cardsContainer}>
                <div style={styles.card}>
                    <div style={styles.cardIcon}>📦</div>
                    <div>
                        <h3 style={styles.cardTitle}>Total Orders</h3>
                        <p style={styles.cardValue}>{totalOrders}</p>
                    </div>
                </div>
                <div style={styles.card}>
                    <div style={styles.cardIcon}>👥</div>
                    <div>
                        <h3 style={styles.cardTitle}>Total Customers</h3>
                        <p style={styles.cardValue}>{totalCustomers}</p>
                    </div>
                </div>
                <div style={styles.card}>
                    <div style={styles.cardIcon}>👗</div>
                    <div>
                        <h3 style={styles.cardTitle}>Total Designs</h3>
                        <p style={styles.cardValue}>{totalDesigns}</p>
                    </div>
                </div>
                <div style={styles.card}>
                    <div style={styles.cardIcon}>💰</div>
                    <div>
                        <h3 style={styles.cardTitle}>Total Sales</h3>
                        <p style={styles.cardValue}>{totalSales} OMR</p>
                        <small style={styles.cardSub}>Profit: {totalProfit} OMR</small>
                    </div>
                </div>
            </div>

            {/* ================= Monthly Sales Chart ================= */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Monthly Sales</h2>
                <div style={styles.monthlyChart}>
                    {months.length ? months.map((m, i) => (
                        <div key={m} style={styles.monthBarContainer}>
                            <div
                                style={{
                                    ...styles.monthBar,
                                    height: `${(monthValues[i] / Math.max(...monthValues)) * 100}%`
                                }}
                                title={`${monthValues[i]} OMR`}
                            />
                            <span style={styles.monthLabel}>{m}</span>
                        </div>
                    )) : <p style={{ color: "#aaa" }}>No sales data yet</p>}
                </div>
            </div>

            {/* ================= Recent Orders ================= */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Recent Orders</h2>
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Customer</th>
                                <th style={styles.th}>Abaya</th>
                                <th style={styles.th}>Price</th>
                                <th style={styles.th}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map(o => (
                                <tr key={o._id} style={styles.tr}>
                                    <td style={styles.td}>{o.customerName}</td>
                                    <td style={styles.td}>{o.abayaCode}</td>
                                    <td style={styles.td}>{o.price} OMR</td>
                                    <td style={styles.td}>
                                        <span style={{
                                            ...styles.statusBadge,
                                            backgroundColor: o.status === "تم الاستلام" ? "rgba(46, 204, 113, 0.1)" : "rgba(255, 105, 180, 0.1)",
                                            color: o.status === "تم الاستلام" ? "#2ecc71" : "#ff69b4"
                                        }}>
                                            {o.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ================== Styles ==================
const styles = {
    container: {
        padding: "40px",
        fontFamily: "'Poppins', sans-serif",
        color: "#333",
    },
    title: {
        fontSize: "32px",
        fontWeight: "700",
        color: "#2c2c54", // Dark purple
        marginBottom: "40px",
        letterSpacing: "1px",
        textAlign: "center",
    },
    topCards: {
        display: "flex",
        gap: "30px",
        justifyContent: "center",
        flexWrap: "wrap",
        marginBottom: "40px",
    },
    featureCard: {
        flex: "1 1 300px",
        padding: "30px",
        borderRadius: "20px",
        textAlign: "center",
        background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)", // Soft pink gradient
        color: "#fff",
        boxShadow: "0 10px 20px rgba(255, 154, 158, 0.3)",
        transition: "transform 0.3s ease",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    topDesignImage: {
        width: "120px",
        height: "120px",
        objectFit: "cover",
        borderRadius: "15px",
        marginTop: "15px",
        border: "3px solid rgba(255,255,255,0.5)",
        boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
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
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        border: "1px solid #f0f0f0",
    },
    cardIcon: {
        width: "50px",
        height: "50px",
        borderRadius: "15px",
        background: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)", // Purple/Pink gradient
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
    cardSub: {
        display: "block",
        marginTop: "5px",
        color: "#2ecc71",
        fontSize: "12px",
        fontWeight: "600",
    },
    section: {
        marginBottom: "40px",
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
    monthlyChart: {
        display: "flex",
        alignItems: "flex-end",
        gap: "20px",
        height: "250px",
        padding: "20px 0",
    },
    monthBarContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "40px",
        height: "100%",
        justifyContent: "flex-end",
    },
    monthBar: {
        width: "100%",
        background: "linear-gradient(to top, #ff758c 0%, #ff7eb3 100%)", // Pink gradient
        borderRadius: "10px",
        transition: "height 0.5s ease",
    },
    monthLabel: {
        marginTop: "10px",
        fontSize: "12px",
        color: "#888",
        textAlign: "center",
    },
    tableWrapper: {
        overflowX: "auto",
    },
    table: {
        width: "100%",
        borderCollapse: "separate",
        borderSpacing: "0 15px",
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
        padding: "8px 15px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
    },
};

export default Dashboard;
