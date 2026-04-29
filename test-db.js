const { neon } = require('@neondatabase/serverless');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
let dbUrl = '';
envFile.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_DRIZZLE_DATABASE_URL=')) {
    dbUrl = line.substring(line.indexOf('=') + 1).trim();
    // remove quotes if any
    if (dbUrl.startsWith('"') && dbUrl.endsWith('"')) dbUrl = dbUrl.substring(1, dbUrl.length - 1);
  }
});

const sql = neon(dbUrl);

async function run() {
  try {
    console.log("Testing insert into users...");
    const result = await sql`insert into "users" ("id", "email") values ('test-id', 'test@dummy.com') on conflict ("id") do nothing`;
    console.log("Success!");
  } catch (error) {
    console.error("RAW DB ERROR:", error);
  }
}
run();
