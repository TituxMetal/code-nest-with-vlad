import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import * as redisStore from 'cache-manager-redis-store'
import { RedisClientOptions } from 'redis'

import { AuthModule, SessionGuard } from '~/auth'
import { PrismaModule } from '~/prisma'
import { UserModule } from '~/user'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        store: redisStore,
        url: config.getOrThrow<string>('REDIS_URL'),
        ttl: 600 // 10 minutes in seconds
      })
    }),
    AuthModule,
    PrismaModule,
    UserModule
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: SessionGuard }]
})
export class AppModule {}
