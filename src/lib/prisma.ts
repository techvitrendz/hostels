import "dotenv/config";
import { PrismaClient } from "@prisma/client";

// explicitly load and sanitize the URL from env so prisma client doesn't
// fall back to any built-in default. trim surrounding quotes which sometimes
// appear in .env files, and log the host portion for debugging network issues.
let dbUrl = process.env.DATABASE_URL;
if (typeof dbUrl === "string") {
	// remove ' or " from start/end
	dbUrl = dbUrl.replace(/^['"]|['"]$/g, "");
}
if (!dbUrl) {
	console.warn(
		"WARNING: DATABASE_URL is not set. Prisma client may fail to connect.",
	);
} else {
	const host = dbUrl.split("@")[1]?.split("/")[0] ?? dbUrl;
	console.log(`Prisma will connect to ${host}`);
}

const prisma = new PrismaClient({
	datasources: {
		db: {
			url: dbUrl,
		},
	},
});

export { prisma };
