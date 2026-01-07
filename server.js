import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Aiven MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false },
    waitForConnections: true,
    connectionLimit: 10,
});

// view all rows
app.get("/menu", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM canteen_menu ORDER BY id ASC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Database error", details: err.message });
    }
});

// add row
app.post("/menu", async (req, res) => {
    const { item_name, category, price } = req.body;

    if (!item_name || !category || price === undefined) {
        return res.status(400).json({ error: "Missing item_name/category/price" });
    }

    try {
        const [result] = await pool.query(
            "INSERT INTO canteen_menu (item_name, category, price) VALUES (?, ?, ?)",
            [item_name, category, price]
        );

        res.status(201).json({
            message: "Menu item added",
            id: result.insertId,
        });
    } catch (err) {
        res.status(500).json({ error: "Database error", details: err.message });
    }
});

// update row by id
app.put("/menu/:id", async (req, res) => {
    const { id } = req.params;
    const { item_name, category, price } = req.body;

    const fields = [];
    const values = [];

    if (item_name !== undefined) {
        fields.push("item_name = ?");
        values.push(item_name);
    }
    if (category !== undefined) {
        fields.push("category = ?");
        values.push(category);
    }
    if (price !== undefined) {
        fields.push("price = ?");
        values.push(price);
    }

    if (fields.length === 0) {
        return res.status(400).json({ error: "No fields provided to update" });
    }

    values.push(id);

    try {
        const [result] = await pool.query(
            `UPDATE canteen_menu SET ${fields.join(", ")} WHERE id = ?`,
            values
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.json({ message: "Menu item updated" });
    } catch (err) {
        res.status(500).json({ error: "Database error", details: err.message });
    }
});

// delete row by id
app.delete("/menu/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query("DELETE FROM canteen_menu WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.json({ message: "Menu item deleted" });
    } catch (err) {
        res.status(500).json({ error: "Database error", details: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
