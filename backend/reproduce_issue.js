
const fetch = require('node-fetch');

async function testAddDesign() {
    const design = {
        code: "TEST001",
        costPrice: "10",
        sellingPrice: "20",
        notes: "Test note",
        image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
    };

    try {
        const res = await fetch("http://localhost:3001/api/designs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(design),
        });

        if (!res.ok) {
            const text = await res.text();
            console.log("Error:", res.status, text);
        } else {
            console.log("Success:", await res.json());
        }
    } catch (err) {
        console.error("Fetch error:", err);
    }
}

testAddDesign();
