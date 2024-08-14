import { Body, Controller, Post } from '@nestjs/common'

import { AuthService } from './auth.service'
import { AuthDto } from './dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authSerivce: AuthService) {}

  @Post('signup')
  async signup(@Body() authDto: AuthDto) {
    return await this.authSerivce.signup(authDto)
  }

  @Post('login')
  async login(@Body() authDto: AuthDto) {
    return this.authSerivce.login(authDto)
  }
}
