import { Injectable } from '@nestjs/common'

import { PrismaService } from '~/prisma'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async me(userId: string) {
    return await this.prisma.user.findUnique({
      where: { id: userId }
    })
  }
}
