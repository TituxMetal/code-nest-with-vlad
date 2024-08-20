import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { type NestExpressApplication } from '@nestjs/platform-express'
import * as connectRedis from 'connect-redis'
import * as session from 'express-session'
import { createClient } from 'redis'

import { AppModule } from '~/app.module'

const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const config = app.get(ConfigService)
  const sessionSecret = config.getOrThrow<string>('SESSION_SECRET')

  const RedisStore = connectRedis(session)
  const redisClient = createClient({
    url: config.getOrThrow<string>('REDIS_URL'),
    legacyMode: true
  })

  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: new RedisStore({ client: redisClient })
    })
  )

  await redisClient.connect().catch(error => {
    throw error
  })

  await app.listen(3000)
  console.log(`Application is running on: http://localhost:3000`)
}
bootstrap()
