import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (res.ok) {
                // حفظ دور اليوزر في localStorage
                localStorage.setItem("user", JSON.stringify(data));
                if (data.role === "admin") {
                    navigate("/dashboard");
                } else {
                    navigate("/customers");
                }
            } else {
                setError(data.message || "Invalid credentials");
            }
        } catch (err) {
            alert("Server error: " + err.message);
            console.error(err);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.loginCard}>
                <div style={styles.header}>
                    <h1 style={styles.logo}>AGline</h1>
                    <p style={styles.subtitle}>Abaya Management System</p>
                </div>

                <form onSubmit={handleLogin} style={styles.form}>
                    <h2 style={styles.title}>Welcome Back</h2>

                    {error && <p style={styles.error}>{error}</p>}

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>

                    <button type="submit" style={styles.button}>
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8f9fe",
        fontFamily: "'Poppins', sans-serif",
    },
    loginCard: {
        backgroundColor: "#fff",
        padding: "50px",
        borderRadius: "30px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
        width: "450px",
        textAlign: "center",
    },
    header: {
        marginBottom: "40px",
    },
    logo: {
        fontSize: "36px",
        fontWeight: "800",
        color: "#ff758c",
        margin: 0,
        letterSpacing: "2px",
    },
    subtitle: {
        color: "#888",
        fontSize: "14px",
        marginTop: "5px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
    },
    title: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#2c2c54",
        marginBottom: "30px",
        textAlign: "center",
    },
    inputGroup: {
        marginBottom: "20px",
    },
    label: {
        display: "block",
        fontSize: "14px",
        fontWeight: "600",
        color: "#555",
        marginBottom: "8px",
    },
    input: {
        width: "100%",
        padding: "14px",
        fontSize: "15px",
        borderRadius: "12px",
        border: "1px solid #eee",
        background: "#fcfcfc",
        outline: "none",
        transition: "border-color 0.2s",
    },
    button: {
        padding: "16px",
        fontSize: "16px",
        borderRadius: "12px",
        border: "none",
        background: "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "600",
        marginTop: "10px",
        boxShadow: "0 10px 20px rgba(255, 117, 140, 0.2)",
        transition: "transform 0.2s",
    },
    error: {
        color: "#ff4d4d",
        backgroundColor: "rgba(255, 77, 77, 0.1)",
        padding: "10px",
        borderRadius: "8px",
        fontSize: "13px",
        marginBottom: "20px",
        textAlign: "center",
        fontWeight: "500",
    },
};

export default Login;
