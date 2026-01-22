import { createContext, useEffect, useState } from "react";

export const DataContext = createContext();

export function DataProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [sales, setSales] = useState({ total: 0, profit: 0 });

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const fetchDesigns = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/designs`);
      const data = await res.json();
      setDesigns(data);
    } catch (err) {
      console.error("Failed to fetch designs:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchDesigns();
  }, []);

  // Calculate derived data whenever orders change
  useEffect(() => {
    if (orders.length > 0) {
      // Unique customers
      const uniqueCustomers = [...new Set(orders.map(o => o.customerName))];
      setCustomers(uniqueCustomers);

      // Sales totals
      const total = orders.reduce((sum, o) => {
        return sum + (o.isDelivered ? (o.price || 0) : (o.deposit || 0));
      }, 0);

      // Real profit calculation
      const profit = orders.reduce((sum, o) => {
        if (!o.isDelivered) return sum;
        const design = designs.find(d => d.code === o.abayaCode);
        if (!design) return sum;
        return sum + ((o.price || 0) - (design.costPrice || 0));
      }, 0);

      setSales({ total, profit });
    }
  }, [orders, designs]);

  return (
    <DataContext.Provider
      value={{ orders, designs, customers, sales, fetchOrders }}
    >
      {children}
    </DataContext.Provider>
  );
}
