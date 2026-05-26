// import { PrismaClient } from "@prisma/client";

import { Pool } from "pg";
import config from "../config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/client/client";

// const prisma = new PrismaClient({ errorFormat: 'minimal' });
// export default prisma;

const pool = new Pool({
  connectionString: config.dbUrl,
  max: 15,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  errorFormat: "minimal",
  // log: config.env === "development" ? ["query", "error", "warn"] : ["error"],
});

export default prisma;