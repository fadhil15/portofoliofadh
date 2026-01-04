import { config } from "dotenv";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

// Ensure environment variables are loaded
config({ path: ".env.local" });

const dbUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!dbUrl || !authToken) {
    throw new Error(
        "Missing database credentials. Check TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in .env.local"
    );
}

const client = createClient({
    url: dbUrl,
    authToken: authToken,
});

// Export Drizzle ORM instance for query builder
export const db = drizzle(client);

// Also export raw client if needed
export { client };

console.log("✅ Database connected to Turso Cloud");