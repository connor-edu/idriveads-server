import { Router } from "express";
import db from "./db";

const app = Router();

app.get("/", async (req, res) => {
  const { rows: ads } = await db.query("select * from idriveads_ads");

  return res.json(ads);
});

app.get("/:id", async (req, res) => {
  const { rows: ads } = await db.query("select * from idriveads_ads where id = $1", [req.params.id]);

  if (ads.length > 0) {
    return res.json(ads[0]);
  } else {
    return res.sendStatus(404);
  }
});

export default app;
