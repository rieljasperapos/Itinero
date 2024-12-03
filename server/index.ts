import express from "express";
import { config } from "./utils/config.utils";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
})

app.listen(config.PORT, () => {
  console.log(`Server is running in port ${config.PORT}`);
})
