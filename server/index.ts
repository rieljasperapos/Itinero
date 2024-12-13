import express from "express";
import { config } from "./utils/config.utils";
import cors from "cors"
import cookieParser from "cookie-parser";
import helmet from "helmet";

import userRouter from "./routes/user.routes";
import itineraryRouter from "./routes/itineraries.routes";
import activityRouter from "./routes/activities.routes";
import collabRouter from "./routes/collab.routes";

const app = express();
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}))
app.use(cookieParser());
app.use(express.json());
app.use(helmet());

// Routes setup
app.use(userRouter);
app.use(itineraryRouter);
app.use(activityRouter);
app.use(collabRouter);

app.listen(config.PORT, () => {
  console.log(`Server is running in port ${config.PORT}`);
})
