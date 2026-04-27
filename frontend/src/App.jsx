import { useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:3000";

function App() {
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedTableNumber, setSelectedTableNumber] = useState(null);

  const money = (value) => `$${Number(value || 0).toFixed(2)}`;

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

  const addOrder = async (item) => {
    if (!selectedTableNumber) return;

    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableNumber: Number(selectedTableNumber),
          itemId: Number(item.id),
          quantity: 1,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Create order failed:", errorData);
        return;
      }

      await res.json();
      await Promise.all([loadOrders(), loadTables()]);
    } catch (err) {
      console.error("Error creating order:", err);
    }
  };

  const deleteOrder = async (id) => {
    try {
      await fetch(`${API_BASE}/api/orders/${id}`, {
        method: "DELETE",
      });

      await Promise.all([loadOrders(), loadTables()]);
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  const clearTable = async (tableNumber) => {
    try {
      await fetch(`${API_BASE}/api/tables/${tableNumber}/orders`, {
        method: "DELETE",
      });

      await Promise.all([loadOrders(), loadTables()]);
    } catch (err) {
      console.error("Error clearing table:", err);
    }
  };

  useEffect(() => {
    loadTables();
    loadMenu();
    loadOrders();
  }, []);

  const selectedTable = useMemo(
    () => tables.find((table) => table.tableNumber === selectedTableNumber) || null,
    [tables, selectedTableNumber]
  );

  const selectedTableOrders = useMemo(
    () => orders.filter((order) => order.tableNumber === selectedTableNumber),
    [orders, selectedTableNumber]
  );

  const activeTablesCount = useMemo(
    () => tables.filter((table) => table.orderCount > 0).length,
    [tables]
  );

  const totalOpenRevenue = useMemo(
    () => tables.reduce((sum, table) => sum + Number(table.total || 0), 0),
    [tables]
  );

  const cardStyle = {
    backgroundColor: "#1f2937",
    border: "1px solid #374151",
    borderRadius: "12px",
    padding: "14px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0b1220, #111827)",
        color: "#f8fafc",
        padding: "22px",
        fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <header
          style={{
            ...cardStyle,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: "28px" }}>Restaurant POS</h1>
            <p style={{ margin: "6px 0 0", color: "#94a3b8" }}>
              Table-based order management system
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <div
              style={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "10px",
                padding: "10px 14px",
              }}
            >
              Active Tables: <strong>{activeTablesCount}</strong>
            </div>
            <div
              style={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "10px",
                padding: "10px 14px",
              }}
            >
              Open Revenue: <strong>{money(totalOpenRevenue)}</strong>
            </div>
          </div>
        </header>

        <main
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
            alignItems: "start",
          }}
        >
          <section style={cardStyle}>
            <h2 style={{ marginTop: 0, marginBottom: "14px" }}>Tables</h2>
            <div style={{ display: "grid", gap: "10px" }}>
              {tables.map((table) => {
                const isSelected = selectedTableNumber === table.tableNumber;
                const isActive = table.orderCount > 0;

                return (
                  <button
                    key={table.tableNumber}
                    onClick={() => setSelectedTableNumber(table.tableNumber)}
                    style={{
                      textAlign: "left",
                      width: "100%",
                      borderRadius: "10px",
                      padding: "12px",
                      border: isSelected ? "2px solid #22c55e" : "1px solid #334155",
                      background: isSelected ? "#0f172a" : "#111827",
                      color: "#e2e8f0",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <strong>Table {table.tableNumber}</strong>
                      <span
                        style={{
                          color: isActive ? "#22c55e" : "#94a3b8",
                          fontWeight: 600,
                        }}
                      >
                        {isActive ? "Active" : "Available"}
                      </span>
                    </div>
                    <div style={{ marginTop: "8px", color: "#cbd5e1", fontSize: "14px" }}>
                      {table.orderCount} orders • {money(table.total)}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section style={cardStyle}>
            <h2 style={{ marginTop: 0, marginBottom: "14px" }}>Menu</h2>
            {!selectedTableNumber && (
              <div
                style={{
                  marginBottom: "12px",
                  padding: "10px 12px",
                  background: "#3f1d1d",
                  border: "1px solid #7f1d1d",
                  color: "#fecaca",
                  borderRadius: "8px",
                }}
              >
                Select a table first.
              </div>
            )}
            <div style={{ display: "grid", gap: "10px" }}>
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => addOrder(item)}
                  disabled={!selectedTableNumber}
                  style={{
                    textAlign: "left",
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #334155",
                    background: !selectedTableNumber ? "#1f2937" : "#0f172a",
                    color: "#f8fafc",
                    cursor: !selectedTableNumber ? "not-allowed" : "pointer",
                    opacity: !selectedTableNumber ? 0.65 : 1,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong>{item.name}</strong>
                    <span style={{ color: "#86efac", fontWeight: 700 }}>
                      {money(item.price)}
                    </span>
                  </div>
                  <div style={{ marginTop: "6px", color: "#94a3b8", fontSize: "14px" }}>
                    {item.category}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section style={cardStyle}>
            <h2 style={{ marginTop: 0, marginBottom: "14px" }}>
              {selectedTable ? `Table ${selectedTable.tableNumber} Orders` : "Selected Table"}
            </h2>

            {!selectedTable && (
              <p style={{ margin: 0, color: "#94a3b8" }}>
                Select a table from the left to view and manage its orders.
              </p>
            )}

            {selectedTable && (
              <>
                <div style={{ display: "grid", gap: "10px" }}>
                  {selectedTableOrders.length === 0 ? (
                    <p style={{ margin: 0, color: "#94a3b8" }}>No orders for this table yet.</p>
                  ) : (
                    selectedTableOrders.map((order) => {
                      const lineTotal = Number(order.price) * Number(order.quantity);
                      return (
                        <div
                          key={order.id}
                          style={{
                            background: "#111827",
                            border: "1px solid #334155",
                            borderRadius: "10px",
                            padding: "10px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600 }}>{order.item}</div>
                            <div style={{ color: "#94a3b8", fontSize: "14px", marginTop: "4px" }}>
                              Qty: {order.quantity} • {money(lineTotal)}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteOrder(order.id)}
                            style={{
                              border: "none",
                              background: "#ef4444",
                              color: "white",
                              borderRadius: "8px",
                              padding: "7px 10px",
                              cursor: "pointer",
                              fontWeight: 700,
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                <div
                  style={{
                    marginTop: "16px",
                    paddingTop: "14px",
                    borderTop: "1px solid #334155",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <strong style={{ fontSize: "18px" }}>
                    Total: {money(selectedTable.total)}
                  </strong>

                  <button
                    onClick={() => clearTable(selectedTable.tableNumber)}
                    disabled={selectedTable.orderCount === 0}
                    style={{
                      border: "none",
                      background: selectedTable.orderCount === 0 ? "#475569" : "#dc2626",
                      color: "white",
                      borderRadius: "8px",
                      padding: "9px 14px",
                      cursor: selectedTable.orderCount === 0 ? "not-allowed" : "pointer",
                      fontWeight: 700,
                    }}
                  >
                    Close Table
                  </button>
                </div>
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;