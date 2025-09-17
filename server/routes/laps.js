import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Get all laps");
});

router.post("/", (req, res) => {
  res.send("Create a new lap");
});

export default router;
