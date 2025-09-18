import express from "express";
import pool from "../helpers/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        // Base query joining all related tables
        let query = `
            SELECT 
                r.*, 
                lr.id AS lap_id, lr.time AS lap_time, lr.pos AS lap_pos,
                rc.id AS racer_id, rc.name AS racer_name, rc.age AS racer_age, rc.country AS racer_country,
                rm.id AS manufacturer_id, rm.name AS manufacturer_name, rm.country AS manufacturer_country,
                ra.id AS race_id, ra.date_start AS race_date_start,
                t.id AS track_id, t.name AS track_name, t.country AS track_country, t.length AS track_length
            FROM results r
            LEFT JOIN laps lr ON r.id = lr.result_id
            LEFT JOIN car_racers rc ON r.car_racer_id = rc.id
            LEFT JOIN car_manufacturer rm ON r.car_manufacturer_id = rm.id
            LEFT JOIN races ra ON r.race_id = ra.id
            LEFT JOIN tracks t ON ra.track_id = t.id
        `;

        const { id, race_id, car_racer_id, car_manufacturer_id } = req.query;
        const conditions = [];
        const values = [];

        if (id && id.trim() !== "") {
            conditions.push('r.id = ?');
            values.push(id);
        }
        if (race_id && race_id.trim() !== "") {
            conditions.push('r.race_id = ?');
            values.push(race_id);
        }
        if (car_racer_id && car_racer_id.trim() !== "") {
            conditions.push('r.car_racer_id = ?');
            values.push(car_racer_id);
        }
        if (car_manufacturer_id && car_manufacturer_id.trim() !== "") {
            conditions.push('r.car_manufacturer_id = ?');
            values.push(car_manufacturer_id);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const [rows] = await pool.query(query, values);

        const resultsMap = {};
        rows.forEach(row => {
            if (!resultsMap[row.id]) {
                resultsMap[row.id] = {
                    id: row.id,
                    time: row.time,
                    pos_starter: row.pos_starter,
                    pos_finisher: row.pos_finisher,
                    racer: {
                        id: row.racer_id,
                        name: row.racer_name,
                        age: row.racer_age,
                        country: row.racer_country
                    },
                    manufacturer: {
                        id: row.manufacturer_id,
                        name: row.manufacturer_name,
                        country: row.manufacturer_country
                    },
                    race: {
                        id: row.race_id,
                        date_start: row.race_date_start,
                        track: {
                            id: row.track_id,
                            name: row.track_name,
                            country: row.track_country,
                            length: row.track_length
                        }
                    },
                    laps: []
                };
            }

            if (row.lap_id) {
                resultsMap[row.id].laps.push({
                    id: row.lap_id,
                    time: row.lap_time,
                    pos: row.lap_pos
                });
            }
        });

        res.json(Object.values(resultsMap));
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

router.post("/", async (req, res) => {
    const { race_id, car_racer_id, car_manufacturer_id, time, pos_starter, pos_finisher, laps } = req.body;

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const [result] = await conn.execute(
            `INSERT INTO results (race_id, car_racer_id, car_manufacturer_id, time, pos_starter, pos_finisher)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [race_id, car_racer_id, car_manufacturer_id, time, pos_starter, pos_finisher]
        );

        const resultId = result.insertId;

        if (laps && Array.isArray(laps)) {
            for (const lap of laps) {
                await conn.execute(
                    `INSERT INTO laps (result_id, time, pos) VALUES (?, ?, ?)`,
                    [resultId, lap.time, lap.pos]
                );
            }
        }

        await conn.commit();
        res.status(201).json({ id: resultId, message: "Result and laps created" });
    } catch (error) {
        await conn.rollback();
        console.error(error);
        res.status(500).send("Server error");
    } finally {
        conn.release();
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { race_id, car_racer_id, car_manufacturer_id, time, pos_starter, pos_finisher, laps } = req.body;

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        await conn.execute(
            `UPDATE results 
             SET race_id=?, car_racer_id=?, car_manufacturer_id=?, time=?, pos_starter=?, pos_finisher=? 
             WHERE id=?`,
            [race_id, car_racer_id, car_manufacturer_id, time, pos_starter, pos_finisher, id]
        );

        // delete old laps and reinsert
        await conn.execute(`DELETE FROM laps WHERE result_id=?`, [id]);

        if (laps && Array.isArray(laps)) {
            for (const lap of laps) {
                await conn.execute(
                    `INSERT INTO laps (result_id, time, pos) VALUES (?, ?, ?)`,
                    [id, lap.time, lap.pos]
                );
            }
        }

        await conn.commit();
        res.json({ message: "Result and laps updated" });
    } catch (error) {
        await conn.rollback();
        console.error(error);
        res.status(500).send("Server error");
    } finally {
        conn.release();
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        await conn.execute(`DELETE FROM laps WHERE result_id=?`, [id]);
        const [del] = await conn.execute(`DELETE FROM results WHERE id=?`, [id]);

        await conn.commit();

        if (del.affectedRows === 0) {
            return res.status(404).json({ message: "Result not found" });
        }

        res.json({ message: "Result and laps deleted" });
    } catch (error) {
        await conn.rollback();
        console.error(error);
        res.status(500).send("Server error");
    } finally {
        conn.release();
    }
});

export default router;
