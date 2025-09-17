import express from "express";
import dotenv from "dotenv";

dotenv.config();

import results from "./routes/results.js"; 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/results", results);

app.get("/health", (req, res) => {
  res.send("OK");
  console.log(req.query);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
