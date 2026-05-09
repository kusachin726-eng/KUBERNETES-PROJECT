// Small test script to verify DB auth/SSL using .env.local
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

function makeConnectionString() {
  const user = process.env.PGUSER || '';
  const password = process.env.PGPASSWORD || '';
  const host = process.env.PGHOST || 'localhost';
  const port = process.env.PGPORT || '5432';
  const database = process.env.PGDATABASE || 'postgres';
  const userEnc = encodeURIComponent(user);
  const passEnc = encodeURIComponent(password);
  return process.env.DATABASE_URL || `postgres://${userEnc}:${passEnc}@${host}:${port}/${database}`;
}

const connectionString = makeConnectionString();
let useSsl = false;
if (process.env.PGSSL !== undefined) {
  useSsl = process.env.PGSSL.toLowerCase() === 'true';
}
if (connectionString.includes('.postgres.database.azure.com')) {
  useSsl = true;
}

const pool = new Pool({
  connectionString,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 10000,
});

(async () => {
  try {
    console.log('Testing connection with:', { connectionString: connectionString.replace(/:[^:@]+@/, ':*****@') });
    const res = await pool.query('SELECT 1');
    console.log('DB test OK:', res.rows);
  } catch (err) {
    console.error('DB test ERROR:');
    console.error(err);
  } finally {
    await pool.end();
  }
})();
