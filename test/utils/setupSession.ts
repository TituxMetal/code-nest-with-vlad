import { type INestApplication } from '@nestjs/common'
import * as connectRedis from 'connect-redis'
import * as session from 'express-session'
import { createClient } from 'redis'

export const setupSession = async (app: INestApplication) => {
  const RedisStore = connectRedis(session)
  const redisClient = createClient({ url: 'redis://localhost:6379', legacyMode: true })

  app.use(
    session({
      secret: 'test-secret',
      resave: false,
      rolling: false,
      saveUninitialized: false,
      store: new RedisStore({
        client: redisClient,
        ttl: 60000,
        logErrors: true
      }),
      cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60000
      }
    })
  )

  await redisClient.connect().catch(error => {
    throw error
  })
}
