import { Router } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import db from "./db";
import { getUser } from "./utils";

const app = Router();

export const JWT_SECRET = Buffer.from(process.env.JWT_SECRET! as string, "hex");

app.post("/login", async (req, res) => {
  const { rows } = await db.query("select * from idriveads_accounts where lower(email) = lower($1)", [req.body.email]);

  if (rows.length === 0) {
    return res.status(401).json({
      message: "Account not found.",
    });
  }

  const [account] = rows;

  if (!(await argon2.verify(account.password, req.body.password))) {
    return res.status(401).json({
      message: "Account not found.",
    });
  }

  const accessToken = jwt.sign(
    {
      account_id: account.id.toString(),
    },
    JWT_SECRET,
    {
      expiresIn: "12h",
    }
  );

  return res.json({ accessToken });
});

app.post("/register", async (req, res) => {
  const { rows } = await db.query("select * from idriveads_accounts where lower(email) = lower($1)", [req.body.email]);

  if (rows.length !== 0) {
    return res.status(401).json({
      message: "Email already in use.",
    });
  }

  if (!req.body.email || typeof req.body.email !== "string") {
    return res.status(400).json({
      message: "Missing or invalid email.",
    });
  }

  if (!req.body.name || typeof req.body.name !== "string") {
    return res.status(400).json({
      message: "Missing or invalid name.",
    });
  }

  if (!req.body.password || typeof req.body.password !== "string") {
    return res.status(400).json({
      message: "Missing or invalid password.",
    });
  }

  const passwordHash = await argon2.hash(req.body.password);

  const {
    rows: [account],
  } = await db.query("INSERT INTO idriveads_accounts (name, email, password) values ($1, $2, $3) RETURNING *", [
    req.body.name,
    req.body.email,
    passwordHash,
  ]);

  const accessToken = jwt.sign(
    {
      account_id: account.id.toString(),
    },
    JWT_SECRET,
    {
      expiresIn: "12h",
    }
  );

  return res.json({ accessToken });
});

app.get("/account", getUser, (req, res) => {
  if (req.user) {
    return res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  } else {
    return res.status(401).json({
      message: "Not logged in.",
    });
  }
});

export default app;
