import { Controller, Get } from '@nestjs/common'

import { GetUserId, UserEntity } from '~/auth'

import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  async me(@GetUserId() userId: string) {
    const user = await this.userService.me(userId)

    return new UserEntity(user)
  }
}
