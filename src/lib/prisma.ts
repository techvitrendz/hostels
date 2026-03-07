import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });

let prismaInstance: PrismaClient | null = null;

function getPrismaClient(): PrismaClient {
	if (!prismaInstance) {
		prismaInstance = new PrismaClient({ adapter });
	}
	return prismaInstance;
}

const prisma = getPrismaClient();

export { prisma };
