
async function testLogin() {
    try {
        console.log("Testing login with admin/123456...");
        const res = await fetch("http://localhost:3001/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: "admin", password: "123456" }),
        });

        console.log("Status:", res.status);
        const text = await res.text();
        console.log("Response body:", text);

        try {
            const json = JSON.parse(text);
            console.log("Parsed JSON:", json);
        } catch (e) {
            console.error("Failed to parse JSON:", e.message);
        }

    } catch (err) {
        console.error("Fetch error:", err);
    }
}

testLogin();
