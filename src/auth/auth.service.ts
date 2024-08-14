import { Injectable } from '@nestjs/common'

import { PrismaService } from '~/prisma'

import { AuthDto } from './dto'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup({ email, password }: AuthDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { email }
    })
    console.log({ userExists })
    return { status: 'success', message: 'Signup Successful.' }
  }

  async login() {
    return { status: 'success', message: 'Login Successful.' }
  }
}
