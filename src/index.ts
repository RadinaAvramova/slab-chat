import dotenv from 'dotenv';
import { App } from '@tinyhttp/app';
import { Logger } from 'tslog';
import knex, { Knex } from 'knex';
import { authRouter } from './routes/authRoute.js';
import { cors } from '@tinyhttp/cors';
import { json } from 'milliparsec';

dotenv.config();

export const logger = new Logger({
  name: 'SlabChat API',
  displayFunctionName: false
});

export const db: Knex = knex({
  client: 'pg',
  connection: process.env.DB_URI,
  searchPath: ['knex', 'public']
});

if (!(await db.schema.hasTable('users')))
  await db.schema.createTable('users', async (table) => {
    table.text('id').unique();
    table.text('username');
    table.integer('discriminator');
    table.text('password');
    table.datetime('createdAt');
    table.datetime('updatedAt');
  });

export const app = new App()
  .use(cors())
  .use(json())
  .use(async (req, _res, next) => {
    logger.info(`${req.method?.toUpperCase()} ${req.url}`);
    next();
  });

const api = app.route('/api/v1');

await authRouter(api, db);
