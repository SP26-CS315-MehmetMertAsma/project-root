import { useEffect, useState } from 'react';

function App() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error('Error fetching orders:', err));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Restaurant Orders</h1>

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