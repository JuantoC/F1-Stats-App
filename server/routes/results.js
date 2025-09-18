import express from "express";
import pool from "../helpers/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        let query = 'select * from results r';
        const { id, race_id, car_racer_id, car_manufacturer_id } = req.query;
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

        if(conditions.length > 0){
            query += ' WHERE ' + conditions.join(' AND ')
        }
        const [result] = await pool.query(query, values);
        res.json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

router.post("/", (req, res) => {
    res.send("Create a new lap");
});

export default router;
