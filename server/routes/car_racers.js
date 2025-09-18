import express from "express";
import pool from "../helpers/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        let query = "SELECT * FROM car_racers";
        const { id, name, country } = req.query;
        const conditions = [];
        const values = [];

        if (id) { conditions.push("id = ?"); values.push(id); }
        if (name) { conditions.push("name LIKE ?"); values.push(`%${name}%`); }
        if (country) { conditions.push("country = ?"); values.push(country); }

        if (conditions.length > 0) query += " WHERE " + conditions.join(" AND ");

        const [rows] = await pool.query(query, values);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

router.post("/", async (req, res) => {
    const { name, age, country } = req.body;
    try {
        const [result] = await pool.execute(
            "INSERT INTO car_racers (name, age, country) VALUES (?, ?, ?)",
            [name, age, country]
        );
        res.status(201).json({ id: result.insertId, message: "Racer created" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, age, country } = req.body;
    try {
        await pool.execute(
            "UPDATE car_racers SET name=?, age=?, country=? WHERE id=?",
            [name, age, country, id]
        );
        res.json({ message: "Racer updated" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [del] = await pool.execute("DELETE FROM car_racers WHERE id=?", [id]);
        if (del.affectedRows === 0) return res.status(404).json({ message: "Not found" });
        res.json({ message: "Racer deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

export default router;
