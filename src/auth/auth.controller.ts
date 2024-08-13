import { Controller, Post } from '@nestjs/common'

import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authSerivce: AuthService) {}

  @Post('signup')
  async signup() {
    return await this.authSerivce.signup()
  }

  @Post('login')
  async login() {
    return this.authSerivce.login()
  }
}
