import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Session,
  UseInterceptors
} from '@nestjs/common'

import { AuthService } from './auth.service'
import { PublicRoute } from './decorators'
import { type AuthDto } from './dto'
import { UserEntity } from './entity'
import { type UserSession, type UserSessionData } from './types'

@PublicRoute()
@Controller('auth')
export class AuthController {
  constructor(private readonly authSerivce: AuthService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheKey('tesst')
  @Get('test')
  test(): string {
    return 'Test from the auth module!'
  }

  @Post('signup')
  async signup(
    @Body() authDto: AuthDto,
    @Session() session: UserSession
  ): Promise<UserEntity> {
    const { id, email } = await this.authSerivce.signup(authDto)

    this.serializeSession({ id, email }, session)

    return new UserEntity({ id, email })
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() authDto: AuthDto,
    @Session() session: UserSession
  ): Promise<UserEntity> {
    const user = await this.authSerivce.login(authDto)

    this.serializeSession({ ...user }, session)

    return new UserEntity(user)
  }

  private serializeSession(
    userData: UserSessionData,
    session: UserSession
  ): void {
    session.user = { ...userData }
  }
}
