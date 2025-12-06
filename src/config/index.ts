import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  connecting_str: process.env.CONNECTING_STR,
  port: process.env.PORT,
  jwt_secret: process.env.JWT_SECRET,
};

export default config;
