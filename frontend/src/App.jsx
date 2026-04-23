import { useEffect, useState } from "react";

const API_BASE = "http://localhost:3000";

function App() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    table: "",
    item: "",
    price: "",
  });

  const loadOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: Number(form.table),
          item: form.item,
          price: Number(form.price),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create order");
      }

      const newOrder = await res.json();
      setOrders((prev) => [...prev, newOrder]);
      setForm({ table: "", item: "", price: "" });
    } catch (err) {
      console.error("Error creating order:", err);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Restaurant Orders</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          name="table"
          type="number"
          placeholder="Table number"
          value={form.table}
          onChange={handleChange}
        />
        <input
          name="item"
          type="text"
          placeholder="Menu item"
          value={form.item}
          onChange={handleChange}
          style={{ marginLeft: "10px" }}
        />
        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          style={{ marginLeft: "10px" }}
        />
        <button type="submit" style={{ marginLeft: "10px" }}>
          Add Order
        </button>
      </form>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              Table {order.table} - {order.item} - ${order.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;