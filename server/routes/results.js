import express from "express";
import pool from "../helpers/db.js";

const router = express.Router();
const PAGINATION_SIZE = 5;

router.get("/", async (req, res) => {
    try {
        let query = 'select * from results r join laps l on r.id = l.result_id';
        const { id, race_id, car_racer_id, car_manufacturer_id, order, sort, page = 1 } = req.query;
        const conditions = [];
        const values = [];

        if (id && id != "") {
            conditions.push('r.id = ?');
            values.push(id)
        }

        if (race_id && race_id != "") {
            conditions.push('r.race_id = ?');
            values.push(race_id)
        }

        if (car_racer_id && car_racer_id != "") {
            conditions.push('r.car_racer_id = ?');
            values.push(car_racer_id)
        }

        if (car_manufacturer_id && car_manufacturer_id != "") {
            conditions.push('r.car_manufacturer_id = ?');
            values.push(car_manufacturer_id)
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ')
        }

        if (order) {
            if (order.toLowerCase() === 'time') {
                query += ' order by r.time'
            }
            if (order.toLowerCase() === 'id') {
                query += ' order by r.id'
            }
            if (sort === 'asc') {
                query += ' asc'
            } else query += ' desc'
        }

        query += ' limit ' + ((page - 1) * PAGINATION_SIZE) + ',' + PAGINATION_SIZE
        const [result] = await pool.query(query, values);
        res.json(result);
    }
    catch (error) {
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
