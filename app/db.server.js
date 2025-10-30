import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

// Configure WebSocket for Neon serverless driver
neonConfig.webSocketConstructor = ws;
neonConfig.fetchConnectionString = () => process.env.DATABASE_URL;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ 
  adapter,
  errorFormat: "pretty"
});

export default prisma;