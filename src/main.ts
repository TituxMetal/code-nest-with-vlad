import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { type NestExpressApplication } from '@nestjs/platform-express'
import * as session from 'express-session'

import { AppModule } from '~/app.module'

const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const config = app.get(ConfigService)
  const sessionSecret = config.getOrThrow<string>('SESSION_SECRET')

  app.use(
    session({ secret: sessionSecret, resave: false, saveUninitialized: false })
  )

  await app.listen(3000)
  console.log(`Application is running on: http://localhost:3000`)
}
bootstrap()
