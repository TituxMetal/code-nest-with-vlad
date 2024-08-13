import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthService {
  constructor() {}

  async signup() {
    return { status: 'success', message: 'Signup Successful.' }
  }

  async login() {
    return { status: 'success', message: 'Login Successful.' }
  }
}
