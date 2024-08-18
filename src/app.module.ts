import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'

import { AuthModule, SessionGuard } from '~/auth'
import { PrismaModule } from '~/prisma'
import { UserModule } from '~/user'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    AuthModule,
    PrismaModule,
    UserModule
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: SessionGuard }]
})
export class AppModule {}
