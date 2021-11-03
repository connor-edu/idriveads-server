import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./auth";
import db from "./db";

const getUser: RequestHandler = async (req, _, next) => {
  const header = req.get("Authorization");
  if (!header) {
    return next();
  }

  try {
    const token: any = jwt.verify(header, JWT_SECRET);
    const { rows } = await db.query("SELECT * FROM idriveads_accounts WHERE id = $1", [token.account_id]);
    if (rows.length > 0) {
      const [account] = rows;
      req.user = account;
    }
  } catch (_e) {
    console.error(_e);
  }

  return next();
};

export { getUser };
