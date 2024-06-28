import express from "express";

const shubh = express();
const port = 3000;

const data = [
  {
    id: 1,
    name: "Sankalp",
    age: 20,
  },
  {
    id: 2,
    name: "Muskan",
    age: 20,
  },
  {
    id: 3,
    name: "Erfan",
    age: 20,
  },
];

shubh.listen(port, () => {
  console.log("Server started");
});

shubh.get("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json(data);
});