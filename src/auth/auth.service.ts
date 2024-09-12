import { ForbiddenException, Injectable } from '@nestjs/common'
import { type User } from '@prisma/client'
import * as argon from 'argon2'

import { PrismaService } from '~/prisma'

import { type AuthDto } from './dto'

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signup({ email, password }: AuthDto): Promise<User> {
    const userExists = await this.prisma.user.findUnique({
      where: { email }
    })

    if (userExists) {
      throw new ForbiddenException('Invalid Credentials.')
    }

    const hash = await argon.hash(password)

    const newUser = await this.prisma.user.create({
      data: { email, hash }
    })

    return { ...newUser }
  }

  async login({ email, password }: AuthDto): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email }
    })

    if (!existingUser) {
      throw new ForbiddenException('Invalid Credentials.')
    }

    const passwordMatches = await argon.verify(existingUser.hash, password)

    if (!passwordMatches) {
      throw new ForbiddenException('Invalid Credentials.')
    }

    return { ...existingUser }
  }
}
