import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

async function test() {
  const sql = neon(process.env.DATABASE_URL!);
  const result = await sql`SELECT NOW()`;
  console.log("Database time:", result);
}
test().catch(console.error);
