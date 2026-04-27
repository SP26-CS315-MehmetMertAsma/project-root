const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const tables = Array.from({ length: 12 }, (_, index) => ({
  tableNumber: index + 1,
  label: `Table ${index + 1}`,
}));

let menuItems = [
  { id: 1, name: "Chicken Shawarma", price: 12.99, category: "Wraps" },
  { id: 2, name: "Falafel Plate", price: 10.99, category: "Vegetarian" },
  { id: 3, name: "Adana Kebab", price: 14.5, category: "Turkish Grill" },
  { id: 4, name: "Iskender Kebab", price: 16.25, category: "Turkish Grill" },
  { id: 5, name: "Lahmacun", price: 8.5, category: "Turkish Flatbread" },
  { id: 6, name: "Pide (Cheese)", price: 11.5, category: "Turkish Flatbread" },
  { id: 7, name: "Mercimek Corbasi", price: 6.0, category: "Turkish Soup" },
  { id: 8, name: "Baklava", price: 5.75, category: "Dessert" },
  { id: 9, name: "Kunefe", price: 6.5, category: "Dessert" },
  { id: 10, name: "Turkish Tea", price: 2.5, category: "Drinks" },
];

let orders = [
  { id: 1, tableNumber: 1, itemId: 1, item: "Chicken Shawarma", price: 12.99, quantity: 1 },
  { id: 2, tableNumber: 2, itemId: 2, item: "Falafel Plate", price: 10.99, quantity: 1 },
];

const getNextId = (list) => (list.length ? list[list.length - 1].id + 1 : 1);

app.get("/", (req, res) => {
  res.send("Waiter backend is running");
});

app.get("/api/tables", (req, res) => {
  const tableStatus = tables.map((table) => {
    const activeOrders = orders.filter((order) => order.tableNumber === table.tableNumber);
    const total = activeOrders.reduce((sum, order) => sum + order.price * order.quantity, 0);

    return {
      ...table,
      orderCount: activeOrders.length,
      total: Number(total.toFixed(2)),
    };
  });

  res.json(tableStatus);
});

app.get("/api/menu", (req, res) => {
  res.json(menuItems);
});

app.post("/api/menu", (req, res) => {
  const { name, price, category = "Other" } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ error: "name and price are required" });
  }

  const numericPrice = Number(price);
  if (Number.isNaN(numericPrice) || numericPrice <= 0) {
    return res.status(400).json({ error: "price must be a positive number" });
  }

  const newMenuItem = {
    id: getNextId(menuItems),
    name: String(name),
    price: numericPrice,
    category: String(category),
  };

  menuItems.push(newMenuItem);
  res.status(201).json(newMenuItem);
});

app.get("/api/orders", (req, res) => {
  const { tableNumber } = req.query;

  if (tableNumber !== undefined) {
    const numericTable = Number(tableNumber);
    return res.json(orders.filter((order) => order.tableNumber === numericTable));
  }

  res.json(orders);
});

app.get("/api/tables/:tableNumber/orders", (req, res) => {
  const numericTable = Number(req.params.tableNumber);
  if (!tables.some((table) => table.tableNumber === numericTable)) {
    return res.status(404).json({ error: "Table not found" });
  }

  const tableOrders = orders.filter((order) => order.tableNumber === numericTable);
  res.json(tableOrders);
});

app.post("/api/orders", (req, res) => {
  const { tableNumber, itemId, quantity = 1, customItem, customPrice } = req.body;

  const numericTable = Number(tableNumber);
  if (!tables.some((table) => table.tableNumber === numericTable)) {
    return res.status(400).json({ error: "Valid tableNumber is required" });
  }

  const numericQuantity = Number(quantity);
  if (!Number.isInteger(numericQuantity) || numericQuantity <= 0) {
    return res.status(400).json({ error: "quantity must be a positive integer" });
  }

  let selectedItem;

  if (itemId !== undefined) {
    const numericItemId = Number(itemId);
    selectedItem = menuItems.find((item) => item.id === numericItemId);
    if (!selectedItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }
  } else if (customItem && customPrice !== undefined) {
    const numericCustomPrice = Number(customPrice);
    if (Number.isNaN(numericCustomPrice) || numericCustomPrice <= 0) {
      return res.status(400).json({ error: "customPrice must be a positive number" });
    }

    selectedItem = {
      id: null,
      name: String(customItem),
      price: numericCustomPrice,
    };
  } else {
    return res.status(400).json({
      error: "Provide either itemId (for menu item) or customItem with customPrice",
    });
  }

  const newOrder = {
    id: getNextId(orders),
    tableNumber: numericTable,
    itemId: selectedItem.id,
    item: selectedItem.name,
    price: selectedItem.price,
    quantity: numericQuantity,
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
});

app.delete("/api/orders/:id", (req, res) => {
  const id = Number(req.params.id);
  const orderExists = orders.some((order) => order.id === id);

  if (!orderExists) {
    return res.status(404).json({ error: "Order not found" });
  }

  orders = orders.filter((order) => order.id !== id);

  res.json({ message: "Order deleted successfully" });
});

app.delete("/api/tables/:tableNumber/orders", (req, res) => {
  const numericTable = Number(req.params.tableNumber);

  if (!tables.some((table) => table.tableNumber === numericTable)) {
    return res.status(404).json({ error: "Table not found" });
  }

  orders = orders.filter((order) => order.tableNumber !== numericTable);

  res.json({ message: "All orders cleared for this table" });
});

if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;