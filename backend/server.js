const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const orders = [
  { id: 1, table: 1, item: 'Chicken Shawarma', price: 12.99 },
  { id: 2, table: 2, item: 'Falafel Plate', price: 10.99 }
];

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.get('/api/orders', (req, res) => {
  res.json(orders);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});