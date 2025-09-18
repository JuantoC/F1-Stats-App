import express from "express";
import dotenv from "dotenv";
import results from "./routes/results.js"; 
import races from "./routes/races.js"; 
import car_racers from "./routes/car_racers.js"; 
import car_manufacturers from "./routes/car_manufacturers.js"; 
import tracks from "./routes/tracks.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/results", results);
app.use("/races", races);
app.use("/car_racers", car_racers);
app.use("/car_manufacturers", car_manufacturers);
app.use("/tracks", tracks);

app.get("/health", (req, res) => {
  res.send("OK");
  console.log(req.query);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
