import { useEffect, useState } from "react";

const API_BASE = "http://localhost:3000";

function App() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    table: "",
    item: "",
    price: "",
  });

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "none",
    outline: "none"
  };

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

      const newOrder = await res.json();
      setOrders((prev) => [...prev, newOrder]);
      setForm({ table: "", item: "", price: "" });
    } catch (err) {
      console.error("Error creating order:", err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "500px",
          background: "#1e293b",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          🍽 Restaurant Orders
        </h1>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <input
            name="table"
            type="number"
            placeholder="Table number"
            value={form.table}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="item"
            type="text"
            placeholder="Menu item"
            value={form.item}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            style={inputStyle}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#22c55e",
              border: "none",
              borderRadius: "6px",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Add Order
          </button>
        </form>

        {/* ORDERS LIST */}
        <div style={{ marginTop: "20px" }}>
          {orders.length === 0 ? (
            <p style={{ textAlign: "center", opacity: 0.7 }}>
              No orders yet. Add one above.
            </p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                style={{
                  background: "#334155",
                  padding: "12px",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              >
                <strong>Table {order.table}</strong>
                <div>{order.item}</div>
                <div>${order.price}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;