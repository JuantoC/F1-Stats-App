import mysql from "mysql2/promise"
import dotenv from "dotenv"

dotenv.config();


const connection = await mysql.createConnection(process.env.MYSQL_CONNECTION_STRING);

const f1Data = {
  tracks: [
    { id: 1, country: "Mónaco", name: "Circuit de Monaco", length: 3.337 },
    { id: 2, country: "Italia", name: "Monza", length: 5.793 },
    { id: 3, country: "Reino Unido", name: "Silverstone", length: 5.891 }
  ],

  races: [
    { id: 1, track_id: 1, date_start: "2024-05-26" },
    { id: 2, track_id: 2, date_start: "2024-09-08" },
    { id: 3, track_id: 3, date_start: "2024-07-07" }
  ],

  car_racers: [
    { id: 1, name: "Max Verstappen", age: 26, country: "Países Bajos" },
    { id: 2, name: "Charles Leclerc", age: 27, country: "Mónaco" },
    { id: 3, name: "Lewis Hamilton", age: 39, country: "Reino Unido" },
    { id: 4, name: "Carlos Sainz", age: 30, country: "España" }
  ],

  car_manufacturer: [
    { id: 1, name: "Red Bull Racing", country: "Austria" },
    { id: 2, name: "Ferrari", country: "Italia" },
    { id: 3, name: "Mercedes", country: "Alemania" }
  ],

  results: [
    { id: 1, race_id: 1, car_racer_id: 2, car_manufacturer_id: 2, time: 6400, pos_starter: 1, pos_finisher: 1 },
    { id: 2, race_id: 1, car_racer_id: 1, car_manufacturer_id: 1, time: 6415, pos_starter: 2, pos_finisher: 2 },
    { id: 3, race_id: 1, car_racer_id: 3, car_manufacturer_id: 3, time: 6430, pos_starter: 3, pos_finisher: 3 },

    { id: 4, race_id: 2, car_racer_id: 1, car_manufacturer_id: 1, time: 5700, pos_starter: 1, pos_finisher: 1 },
    { id: 5, race_id: 2, car_racer_id: 4, car_manufacturer_id: 2, time: 5720, pos_starter: 2, pos_finisher: 2 },
    { id: 6, race_id: 2, car_racer_id: 3, car_manufacturer_id: 3, time: 5740, pos_starter: 3, pos_finisher: 3 },

    { id: 7, race_id: 3, car_racer_id: 3, car_manufacturer_id: 3, time: 7200, pos_starter: 2, pos_finisher: 1 },
    { id: 8, race_id: 3, car_racer_id: 1, car_manufacturer_id: 1, time: 7215, pos_starter: 1, pos_finisher: 2 },
    { id: 9, race_id: 3, car_racer_id: 2, car_manufacturer_id: 2, time: 7235, pos_starter: 3, pos_finisher: 3 }
  ],

  laps: [
    { id: 1, result_id: 1, time: 95, pos: 1 },
    { id: 2, result_id: 1, time: 96, pos: 1 },
    { id: 3, result_id: 1, time: 97, pos: 1 },

    { id: 4, result_id: 4, time: 88, pos: 1 },
    { id: 5, result_id: 4, time: 87, pos: 1 },
    { id: 6, result_id: 4, time: 89, pos: 1 },

    { id: 7, result_id: 7, time: 100, pos: 2 },
    { id: 8, result_id: 7, time: 99, pos: 1 },
    { id: 9, result_id: 7, time: 101, pos: 1 }
  ]
};

async function insterTrackData(tracks){
    for (const track of tracks){
        await connection.execute(`insert into tracks (id, country, name, length) values (${track.id},'${track.country}','${track.name}','${track.length}')`)
    }
}
async function insterRacesData(races){
    for (const race of races){
        await connection.execute(`insert into races (id, track_id, date_start ) values (${race.id},'${race.track_id}','${race.date_start}')`)
    }
}
async function insterCarRacersData(carRacers){
    for (const carRacer of carRacers){
        await connection.execute(`insert into car_racers (id, country, name, age) values (${carRacer.id},'${carRacer.country}','${carRacer.name}','${carRacer.age}')`)
    }
}
async function insterCarManufacturerData(carManufacturers){
    for (const carManufacturer of carManufacturers){
        await connection.execute(`insert into car_manufacturer (id, country, name) values (${carManufacturer.id},'${carManufacturer.country}','${carManufacturer.name}')`)
    }
}
async function insterResultData(results){
    for (const result of results){
        await connection.execute(`insert into results (id, race_id, car_racer_id, car_manufacturer_id, time, pos_starter, pos_finisher) 
            values (${result.id},'${result.race_id}','${result.car_racer_id}','${result.car_manufacturer_id}','${result.time}','${result.pos_starter}','${result.pos_finisher}')`)
    }
}
async function insterLapsData(laps){
    for (const lap of laps){
        await connection.execute(`insert into laps (id, result_id, time, pos) 
            values (${lap.id},'${lap.result_id}','${lap.time}','${lap.pos}')`)
    }
}

await insterTrackData(f1Data.tracks);
await insterRacesData(f1Data.races);
await insterCarRacersData(f1Data.car_racers);
await insterCarManufacturerData(f1Data.car_manufacturer);
await insterResultData(f1Data.results);
await insterLapsData(f1Data.laps);