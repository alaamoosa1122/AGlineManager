
async function testToggleDelivery() {
    try {
        // 1. Create a test order
        const createRes = await fetch("http://localhost:3001/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                customerName: "Toggle Test",
                phone: "99999999",
                abayaCode: "TOGGLE-001",
                length: "50",
                width: "20",
                sleeveLength: "30",
                deliveryLocation: "Muscat",
                price: 50,
                isDelivered: false
            }),
        });
        const order = await createRes.json();
        console.log("Created order:", order._id, "isDelivered:", order.isDelivered);

        // 2. Toggle to Delivered (true)
        const toggleTrueRes = await fetch(`http://localhost:3001/api/orders/${order._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isDelivered: true }),
        });
        const updatedTrue = await toggleTrueRes.json();
        console.log("Toggled to TRUE:", updatedTrue.isDelivered, "Status:", updatedTrue.status);

        // 3. Toggle back to Not Delivered (false)
        const toggleFalseRes = await fetch(`http://localhost:3001/api/orders/${order._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isDelivered: false }),
        });
        const updatedFalse = await toggleFalseRes.json();
        console.log("Toggled to FALSE:", updatedFalse.isDelivered, "Status:", updatedFalse.status);

        // Cleanup
        await fetch(`http://localhost:3001/api/orders/${order._id}`, { method: "DELETE" });
        console.log("Cleaned up test order");

    } catch (err) {
        console.error("Test failed:", err);
    }
}

testToggleDelivery();
