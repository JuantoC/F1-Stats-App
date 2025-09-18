import express from "express";
import pool from "../helpers/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        let query = "SELECT * FROM tracks";
        const { id, country, name } = req.query;
        const conditions = [];
        const values = [];

        if (id) { conditions.push("id = ?"); values.push(id); }
        if (country) { conditions.push("country = ?"); values.push(country); }
        if (name) { conditions.push("name LIKE ?"); values.push(`%${name}%`); }

        if (conditions.length > 0) query += " WHERE " + conditions.join(" AND ");

        const [rows] = await pool.query(query, values);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

router.post("/", async (req, res) => {
    const { country, name, length } = req.body;
    try {
        const [result] = await pool.execute(
            "INSERT INTO tracks (country, name, length) VALUES (?, ?, ?)",
            [country, name, length]
        );
        res.status(201).json({ id: result.insertId, message: "Track created" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { country, name, length } = req.body;
    try {
        await pool.execute(
            "UPDATE tracks SET country=?, name=?, length=? WHERE id=?",
            [country, name, length, id]
        );
        res.json({ message: "Track updated" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [del] = await pool.execute("DELETE FROM tracks WHERE id=?", [id]);
        if (del.affectedRows === 0) return res.status(404).json({ message: "Not found" });
        res.json({ message: "Track deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

export default router;
