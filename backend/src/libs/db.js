import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();
const globalForPrisma = globalThis;
export const db =
    globalForPrisma.prisma ||
    new PrismaClient({
        accelerateUrl: process.env.ACCELERATE_URL,
    });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
