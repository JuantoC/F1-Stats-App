import express from "express";
import pool from "../helpers/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        let query = "SELECT * FROM races";
        const { id, track_id, date_start } = req.query;
        const conditions = [];
        const values = [];

        if (id) { conditions.push("id = ?"); values.push(id); }
        if (track_id) { conditions.push("track_id = ?"); values.push(track_id); }
        if (date_start) { conditions.push("date_start = ?"); values.push(date_start); }

        if (conditions.length > 0) query += " WHERE " + conditions.join(" AND ");

        const [rows] = await pool.query(query, values);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

router.post("/", async (req, res) => {
    const { track_id, date_start } = req.body;
    try {
        const [result] = await pool.execute(
            "INSERT INTO races (track_id, date_start) VALUES (?, ?)",
            [track_id, date_start]
        );
        res.status(201).json({ id: result.insertId, message: "Race created" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { track_id, date_start } = req.body;
    try {
        await pool.execute(
            "UPDATE races SET track_id=?, date_start=? WHERE id=?",
            [track_id, date_start, id]
        );
        res.json({ message: "Race updated" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [del] = await pool.execute("DELETE FROM races WHERE id=?", [id]);
        if (del.affectedRows === 0) return res.status(404).json({ message: "Not found" });
        res.json({ message: "Race deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

export default router;
