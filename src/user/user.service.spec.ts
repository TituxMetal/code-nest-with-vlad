import { Test, type TestingModule } from '@nestjs/testing'

import { PrismaService } from '~/prisma'

import { UserService } from './user.service'

describe('UserService', () => {
  let userService: UserService
  let prismaService: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: { user: { findUnique: jest.fn() } }
        }
      ]
    }).compile()

    userService = module.get<UserService>(UserService)
    prismaService = module.get<PrismaService>(PrismaService)
  })
  describe('me', () => {
    it('should return user data for a valid userId', async () => {
      const userId = 'validUserId'
      const expectedUser = {
        id: userId,
        email: 'test@test.com',
        hash: 'hash',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(expectedUser)

      const actualUser = await userService.me(userId)

      expect(actualUser).toEqual(expectedUser)
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId }
      })
    })
    it('should return null for an invalid userId', async () => {
      const userId = 'invalid-user-id'

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null)

      const actualUser = await userService.me(userId)

      expect(actualUser).toBeNull()
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId }
      })
    })
  })
})
