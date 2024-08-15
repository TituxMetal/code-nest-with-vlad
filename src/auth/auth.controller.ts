import { Body, Controller, Post } from '@nestjs/common'

import { AuthService } from './auth.service'
import { AuthDto } from './dto'
import { UserEntity } from './entity'

@Controller('auth')
export class AuthController {
  constructor(private readonly authSerivce: AuthService) {}

  @Post('signup')
  async signup(@Body() authDto: AuthDto): Promise<UserEntity> {
    const { id, email } = await this.authSerivce.signup(authDto)

    return new UserEntity({ id, email })
  }

  @Post('login')
  async login(@Body() authDto: AuthDto): Promise<UserEntity> {
    const { id, email } = await this.authSerivce.login(authDto)

    return new UserEntity({ id, email })
  }
}
