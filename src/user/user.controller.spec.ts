import { UnauthorizedException } from '@nestjs/common'
import { Test, type TestingModule } from '@nestjs/testing'

import { UserEntity } from '~/auth'

import { UserController } from './user.controller'
import { UserService } from './user.service'

describe('UserController', () => {
  let userController: UserController
  let userService: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: { me: jest.fn() }
        }
      ]
    }).compile()

    userController = module.get<UserController>(UserController)
    userService = module.get<UserService>(UserService)
  })

  describe('me', () => {
    it('should return user entity for a valid userId', async () => {
      const userId = 'valid-user-id'
      const user = {
        id: userId,
        email: 'test@test.com',
        hash: 'hash',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      jest.spyOn(userService, 'me').mockResolvedValue(user)

      const result = await userController.me(userId)

      expect(result).toEqual(new UserEntity(user))
      expect(userService.me).toHaveBeenCalledWith(userId)
    })

    it('should throw an UnauthorizedException for an invalid userId', async () => {
      const userId = 'invalid-user-id'

      jest.spyOn(userService, 'me').mockResolvedValue(null)

      await expect(userController.me(userId)).rejects.toThrow(UnauthorizedException)
      expect(userService.me).toHaveBeenCalledWith(userId)
    })
  })
})
