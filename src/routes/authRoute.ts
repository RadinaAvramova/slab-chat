import { argon2id, argon2Verify } from 'hash-wasm';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import { IUser, userSchema } from '../entity/user.js';
import { App } from '@tinyhttp/app';
import { Knex } from 'knex';
import { NotFound } from 'http-json-errors';

export const authRouter = async (app: App, database: Knex) => {
  app.post('/auth/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const salt = randomBytes(16);
    const hashedPassword = await argon2id({
      password,
      salt, // salt is a buffer containing random bytes
      parallelism: 1,
      iterations: 256,
      memorySize: 512, // use 512KB memory
      hashLength: 32, // output size = 32 bytes
      outputType: 'encoded' // return standard encoded string containing parameters needed to verify the key
    });

    await database<IUser>('users').insert(
      await userSchema.parseAsync({
        username,
        password: hashedPassword
      })
    );

    return res.status(201).json({
      message: 'Created user'
    });
  });

  app.post('/auth/login', async (req, res) => {
    // TODO: input validation
    const username = req.body.username;
    const password = req.body.password;

    const user = await database<IUser>('users')
      .select('*')
      .where({
        username
      })
      .first();
    if (user === undefined) throw new NotFound('User not found', username);

    const isValid = await argon2Verify({
      password: password,
      hash: user.password
    });

    if (!isValid) throw new Error('Invalid credentials.');

    return res.json({
      token: jwt.sign(
        {
          userId: user.id
        },
        process.env.JWT_SECRET
      )
    });
  });
};
