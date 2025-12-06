import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

// signup user
const signupUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;
  const hashedPass = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3,$4, $5) RETURNING id, name, email, phone, role`,
    [name, email, hashedPass, phone, role || "customer"]
  );
  return result;
};

// signin user
const userLogin = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (result.rows.length === 0) {
    return null;
  }

  const userInfo = result.rows[0];
  const { password: userPassword, ...user } = userInfo;
  const passwordMatch = await bcrypt.compare(password, userPassword);
  if (!passwordMatch) {
    return false;
  }
  const token = jwt.sign(
    { name: userInfo.email, email: userInfo.name, role: userInfo.role },
    config.jwt_secret as string,
    { expiresIn: "5d" }
  );

  return { token, user };
};

export const authServices = {
  signupUser,
  userLogin,
};
