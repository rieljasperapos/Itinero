import express from "express";
import { config } from "./utils/config.utils";
import userRouter from "./routes/user.routes";
import cors from "cors"

const app = express();
app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE"],
}))
app.use(express.json());
app.use(userRouter);

app.listen(config.PORT, () => {
  console.log(`Server is running in port ${config.PORT}`);
})
