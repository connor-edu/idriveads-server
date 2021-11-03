import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import auth from "./auth";
import ads from "./ads";

const app = express();

app.set("trust proxy", true);
app.set("x-powered-by", false);
app.set("etag", "strong");

app.use(express.json());

app.use(morgan("tiny"));

const corsOptions = {
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  preflightContinue: true,
  maxAge: 600,
};
app.use(cors(corsOptions));

app.use("/auth", auth);
app.use("/ads", ads);

app.listen(process.env.PORT || 3001);
