import { ClassSerializerInterceptor } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
import { type NestExpressApplication } from '@nestjs/platform-express'
import * as connectRedis from 'connect-redis'
import * as session from 'express-session'
import { createClient } from 'redis'

import { AppModule } from '~/app.module'

const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const config = app.get(ConfigService)
  const sessionSecret = config.getOrThrow<string>('SESSION_SECRET')
  const sessionTTL = Number(config.get('SESSION_TTL') || 60000)
  const redisUrl = config.getOrThrow<string>('REDIS_URL')

  const RedisStore = connectRedis(session)
  const redisClient = createClient({ url: redisUrl, legacyMode: true })

  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      rolling: false,
      saveUninitialized: false,
      store: new RedisStore({
        client: redisClient,
        ttl: sessionTTL,
        logErrors: true
      }),
      cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: sessionTTL
      }
    })
  )

  await redisClient.connect().catch(error => {
    throw error
  })

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

  await app.listen(3000)
  console.log(`Application is running on: http://localhost:3000`)
}
bootstrap()
