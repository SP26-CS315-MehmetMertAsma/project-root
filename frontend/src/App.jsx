import { useEffect, useState } from "react";

const API_BASE = "http://localhost:3000";

function App() {
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    tableNumber: "",
    itemId: "",
    quantity: 1,
  });

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #334155",
    outline: "none",
    backgroundColor: "#0f172a",
    color: "white",
    boxSizing: "border-box",
  };

  const loadTables = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/tables`);
      const data = await res.json();
      setTables(data);
    } catch (err) {
      console.error("Error fetching tables:", err);
    }
  };

  const loadMenu = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/menu`);
      const data = await res.json();
      setMenuItems(data);
    } catch (err) {
      console.error("Error fetching menu:", err);
    }
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
    loadTables();
    loadMenu();
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
          tableNumber: Number(form.tableNumber),
          itemId: Number(form.itemId),
          quantity: Number(form.quantity),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Create order failed:", errorData);
        return;
      }

      await res.json();

      setForm({
        tableNumber: "",
        itemId: "",
        quantity: 1,
      });

      loadOrders();
      loadTables();
    } catch (err) {
      console.error("Error creating order:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/api/orders/${id}`, {
        method: "DELETE",
      });

      loadOrders();
      loadTables();
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "30px",
      }}
    >
      <div
        style={{
          width: "700px",
          background: "#1e293b",
          padding: "30px",
          borderRadius: "12px",
          border: "1px solid #334155",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#f8fafc",
          }}
        >
          Restaurant Orders
        </h1>

        <form onSubmit={handleSubmit}>
          <select
            name="tableNumber"
            value={form.tableNumber}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select table</option>
            {tables.map((table) => (
              <option key={table.tableNumber} value={table.tableNumber}>
                {table.label}
              </option>
            ))}
          </select>

          <select
            name="itemId"
            value={form.itemId}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select menu item</option>
            {menuItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} - ${item.price.toFixed(2)}
              </option>
            ))}
          </select>

          <input
            name="quantity"
            type="number"
            min="1"
            value={form.quantity}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Quantity"
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#16a34a",
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

        <div style={{ marginTop: "30px" }}>
          <h2 style={{ marginBottom: "12px", color: "#f8fafc" }}>Orders</h2>

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
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong style={{ color: "#f8fafc" }}>
                    Table {order.tableNumber}
                  </strong>
                  <div style={{ marginTop: "4px", color: "#e2e8f0" }}>
                    {order.item}
                  </div>
                  <div style={{ marginTop: "4px", color: "#cbd5e1" }}>
                    Qty: {order.quantity}
                  </div>
                  <div style={{ marginTop: "4px", color: "#cbd5e1" }}>
                    ${(Number(order.price) * Number(order.quantity)).toFixed(2)}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(order.id)}
                  style={{
                    backgroundColor: "#ef4444",
                    border: "none",
                    color: "white",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        <div style={{ marginTop: "30px" }}>
          <h2 style={{ marginBottom: "12px", color: "#f8fafc" }}>
            Table Summary
          </h2>

          {tables.map((table) => (
            <div
              key={table.tableNumber}
              style={{
                background: "#334155",
                padding: "10px 12px",
                borderRadius: "8px",
                marginBottom: "8px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>{table.label}</span>
              <span>
                {table.orderCount} orders | ${Number(table.total).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;