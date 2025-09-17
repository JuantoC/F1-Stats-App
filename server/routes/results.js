import express from "express";
import mysql from "mysql2/promise";


const router = express.Router();

router.get("/", async (req, res) => {
    const connection = await mysql.createConnection(process.env.MYSQL_CONNECTION_STRING);
    let query = 'select * from results';
    const { id, race_id, car_racer_id, car_manufacturer } = req.query;
    const conditions = [];
    const values = [];

    if(id && id != ""){
        conditions.push('id = ?');
        values.push(id)
    }
    if(race_id && race_id != ""){
        conditions.push('race_id = ?');
        values.push(race_id)
    }
    if(car_racer_id && car_racer_id != ""){
        conditions.push('car_racer_id = ?');
        values.push(car_racer_id)
    }
    if(car_manufacturer_id && car_manufacturer_id != ""){
        conditions.push('car_manufacturer_id = ?');
        values.push(car_manufacturer_id)
    }

    if(conditions.length > 0){
        query += ' WHERE ' + conditions.join(' AND ')
    }
    const [result] = await connection.execute(query, values);
    await connection.end();
    console.log(query);
    res.send(result);
});

router.post("/", (req, res) => {
    res.send("Create a new lap");
});

export default router;
