import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataContext";

/* ولايات سلطنة عُمان */
const omanLocations = [
  "استلام من المنزل",
  "مسقط - مطرح",
  "مسقط - بوشر",
  "مسقط - السيب",
  "مسقط - العامرات",
  "مسقط - قريات",
  "ظفار - صلالة",
  "ظفار - طاقة",
  "ظفار - مرباط",
  "شمال الباطنة - صحار",
  "شمال الباطنة - صحم",
  "جنوب الباطنة - بركاء",
  "الداخلية - نزوى",
  "الداخلية - بهلاء",
  "شمال الشرقية - إبراء",
  "جنوب الشرقية - صور",
  "الظاهرة - عبري",
  "البريمي - البريمي",
  "الوسطى - الدقم",
  "مسندم - خصب",
];

/* أكواد العبايات */
const lengths = Array.from({ length: 16 }, (_, i) => 47 + i);
const widths = Array.from({ length: 15 }, (_, i) => 18 + i);
const sleeves = Array.from({ length: 10 }, (_, i) => 25 + i);
const priceOptions = [10, 15, 20, 25, 30, 35, 40];

function AddOrder() {
  const { fetchOrders, designs } = useContext(DataContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    abayaCode: "",
    length: "",
    width: "",
    sleeveLength: "",
    deliveryLocation: "",
    notes: "",
    price: "",
    deposit: "",
    status: "New",
    createdAt: new Date().toISOString().split("T")[0],
  });

  const submitOrder = async (e) => {
    e.preventDefault();
    try {
      const orderToSend = {
        ...form,
        createdAt: new Date(form.createdAt).toISOString(),
      };
      const baseUrl = import.meta.env.VITE_API_URL.replace(/\/$/, "");
      const res = await fetch(`${baseUrl}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderToSend),
      });
      if (!res.ok) throw new Error("Failed to add order");

      setForm({
        customerName: "",
        phone: "",
        abayaCode: "",
        length: "",
        width: "",
        sleeveLength: "",
        deliveryLocation: "",
        notes: "",
        price: "",
        deposit: "",
        status: "New",
        createdAt: new Date().toISOString().split("T")[0],
      });

      fetchOrders();
      navigate("/orders");
    } catch (err) {
      alert("Error adding order");
      console.error(err);
    }
  };

  return (
    <div style={styles.outerContainer}>
      <div style={styles.container}>
        {/* سهم الرجوع */}
        <div style={styles.back} onClick={() => navigate("/orders")}>
          ← Back to Orders
        </div>

        <h2 style={styles.title}>Add New Order</h2>
        <form onSubmit={submitOrder} style={styles.form}>
          {/* اسم العميل */}
          <input
            style={styles.input}
            placeholder="Customer Name"
            value={form.customerName}
            onChange={(e) =>
              setForm({ ...form, customerName: e.target.value })
            }
            required
          />

          {/* رقم الهاتف */}
          <input
            style={styles.input}
            placeholder="Phone (8 digits)"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })
            }
            maxLength={8}
            pattern="[0-9]{8}"
            required
          />

          {/* كود العباية */}
          <input
            style={styles.input}
            list="abaya-codes"
            placeholder="Abaya Code"
            value={form.abayaCode}
            onChange={(e) =>
              setForm({ ...form, abayaCode: e.target.value })
            }
            required
          />
          <datalist id="abaya-codes">
            {[...new Set(designs.map((d) => d.code))].map((code) => (
              <option key={code} value={code} />
            ))}
          </datalist>

          <div style={styles.row}>
            {/* طول العباية */}
            <input
              style={{ ...styles.input, flex: 1 }}
              list="length-options"
              placeholder="Length"
              value={form.length}
              onChange={(e) => setForm({ ...form, length: e.target.value })}
              required
            />
            <datalist id="length-options">
              {lengths.map((len) => (
                <option key={len} value={len} />
              ))}
            </datalist>

            {/* العرض */}
            <input
              style={{ ...styles.input, flex: 1 }}
              list="width-options"
              placeholder="Width"
              value={form.width}
              onChange={(e) => setForm({ ...form, width: e.target.value })}
              required
            />
            <datalist id="width-options">
              {widths.map((w) => (
                <option key={w} value={w} />
              ))}
            </datalist>

            {/* طول الكم */}
            <input
              style={{ ...styles.input, flex: 1 }}
              list="sleeve-options"
              placeholder="Sleeve"
              value={form.sleeveLength}
              onChange={(e) => setForm({ ...form, sleeveLength: e.target.value })}
              required
            />
            <datalist id="sleeve-options">
              {sleeves.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>

          {/* موقع التوصيل */}
          <input
            style={styles.input}
            list="oman-locations"
            placeholder="Delivery Location"
            value={form.deliveryLocation}
            onChange={(e) =>
              setForm({ ...form, deliveryLocation: e.target.value })
            }
            required
          />
          <datalist id="oman-locations">
            {omanLocations.map((loc) => (
              <option key={loc} value={loc} />
            ))}
          </datalist>

          <div style={styles.row}>
            {/* السعر */}
            <input
              style={{ ...styles.input, flex: 1 }}
              list="price-options"
              placeholder="Price (OMR)"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
            <datalist id="price-options">
              {priceOptions.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>

            {/* العربون المدفوع */}
            <input
              style={{ ...styles.input, flex: 1 }}
              placeholder="Deposit (OMR)"
              type="number"
              value={form.deposit}
              onChange={(e) => setForm({ ...form, deposit: e.target.value })}
            />
          </div>

          {/* تاريخ الطلب */}
          <input
            style={styles.input}
            type="date"
            placeholder="Order Date"
            value={form.createdAt}
            onChange={(e) => setForm({ ...form, createdAt: e.target.value })}
            required
          />

          {/* ملاحظات */}
          <textarea
            style={styles.textarea}
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />

          <button style={styles.button}>Create Order</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  outerContainer: {
    padding: "40px 20px",
    fontFamily: "'Poppins', sans-serif",
  },
  container: {
    maxWidth: "550px",
    margin: "0 auto",
    padding: "40px",
    borderRadius: "25px",
    backgroundColor: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  },
  back: {
    cursor: "pointer",
    marginBottom: "25px",
    color: "#ff758c",
    fontWeight: "600",
    fontSize: "14px",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    fontWeight: "700",
    color: "#2c2c54",
    fontSize: "24px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  row: {
    display: "flex",
    gap: "15px",
  },
  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #eee",
    fontSize: "14px",
    background: "#fcfcfc",
    outline: "none",
    transition: "border-color 0.2s",
  },
  textarea: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #eee",
    minHeight: "100px",
    fontSize: "14px",
    background: "#fcfcfc",
    outline: "none",
    fontFamily: "inherit",
  },
  button: {
    padding: "16px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(255, 117, 140, 0.2)",
    marginTop: "10px",
  },
};

export default AddOrder;
