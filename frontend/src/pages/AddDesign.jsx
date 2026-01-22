import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddDesign() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    code: "",
    costPrice: "",
    sellingPrice: "",
    notes: "",
    image: "", // رابط الصورة
  });

  const [imageFile, setImageFile] = useState(null); // لتخزين الصورة قبل التحميل

  // عند اختيار صورة
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    // إنشاء رابط مؤقت لعرض الصورة قبل الرفع
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result });
    };
    if (file) reader.readAsDataURL(file);
  };

  const submitDesign = async (e) => {
    e.preventDefault();

    try {
      const baseUrl = import.meta.env.VITE_API_URL.replace(/\/$/, "");
      const res = await fetch(`${baseUrl}/api/designs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add design");
      }

      // إعادة ضبط النموذج
      setForm({ code: "", costPrice: "", sellingPrice: "", notes: "", image: "" });
      setImageFile(null);

      // إعادة التوجيه لصفحة التصاميم
      navigate("/designs");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div style={styles.outerContainer}>
      <div style={styles.container}>
        {/* سهم الرجوع */}
        <div style={styles.back} onClick={() => navigate("/designs")}>
          ← Back to Designs
        </div>

        <h2 style={styles.title}>Add New Design</h2>
        <form onSubmit={submitDesign} style={styles.form}>
          {/* صورة العباية */}
          <div style={styles.imageUpload}>
            <label style={styles.uploadLabel}>
              {form.image ? "Change Image" : "Upload Abaya Image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
            {form.image && (
              <img
                src={form.image}
                alt="Abaya Preview"
                style={styles.preview}
              />
            )}
          </div>

          {/* كود العباية */}
          <input
            style={styles.input}
            placeholder="Abaya Code"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            required
          />

          <div style={styles.row}>
            {/* سعر التكلفة */}
            <input
              style={{ ...styles.input, flex: 1 }}
              type="number"
              placeholder="Cost Price (OMR)"
              value={form.costPrice}
              onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
              required
            />

            {/* سعر البيع */}
            <input
              style={{ ...styles.input, flex: 1 }}
              type="number"
              placeholder="Selling Price (OMR)"
              value={form.sellingPrice}
              onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
              required
            />
          </div>

          {/* ملاحظات */}
          <textarea
            style={styles.textarea}
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />

          <button style={styles.button}>Save Design</button>
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
    maxWidth: "500px",
    margin: "0 auto",
    padding: "40px",
    borderRadius: "25px",
    backgroundColor: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  },
  back: {
    cursor: "pointer",
    color: "#ff758c",
    marginBottom: "25px",
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
  imageUpload: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
    marginBottom: "10px",
  },
  uploadLabel: {
    padding: "10px 20px",
    background: "#f0f0f0",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#666",
    fontWeight: "500",
  },
  preview: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "15px",
    border: "1px solid #eee",
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

export default AddDesign;
