import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

const databaseUrl = process.env.DATABASE_URL;

console.log(databaseUrl);

export default defineConfig({
  schema: './src/db/schema/**.schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl!,
    ssl: {
        rejectUnauthorized: false,
    }
  },
});