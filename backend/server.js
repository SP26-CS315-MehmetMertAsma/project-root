const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let orders = [
  { id: 1, table: 1, item: "Chicken Shawarma", price: 12.99 },
  { id: 2, table: 2, item: "Falafel Plate", price: 10.99 },
];

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/api/orders", (req, res) => {
  res.json(orders);
});

app.post("/api/orders", (req, res) => {
  const { table, item, price } = req.body;

  if (!table || !item || price === undefined) {
    return res.status(400).json({ error: "table, item, and price are required" });
  }

  const newOrder = {
    id: orders.length ? orders[orders.length - 1].id + 1 : 1,
    table: Number(table),
    item: String(item),
    price: Number(price),
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
});

if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;