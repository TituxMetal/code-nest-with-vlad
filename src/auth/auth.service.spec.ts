import { ForbiddenException } from '@nestjs/common'
import { Test, type TestingModule } from '@nestjs/testing'
import { type User } from '@prisma/client'
import * as argon from 'argon2'

import { PrismaService } from '~/prisma'

import { AuthService } from './auth.service'
import { type AuthDto } from './dto'

describe('AuthService', () => {
  let authService: AuthService
  let prismaService: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: { user: { findUnique: jest.fn(), create: jest.fn() } }
        }
      ]
    }).compile()

    authService = module.get<AuthService>(AuthService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  describe('signup', () => {
    it('should throw ForbiddenException if user already exists', async () => {
      const authDto: AuthDto = {
        email: 'test@test.com',
        password: 'password'
      }

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce({
        id: 'existing-user-id',
        email: 'test@example.com',
        hash: 'hashedPassword'
      } as User)

      await expect(authService.signup(authDto)).rejects.toThrow(
        new ForbiddenException('Invalid Credentials.')
      )
    })

    it('should create a new user and return it', async () => {
      const authDto: AuthDto = {
        email: 'test@test.com',
        password: 'password'
      }
      const newUser = {
        id: 'new-user-id',
        email: 'test@test.com',
        hash: 'hashedPassword'
      } as User

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(null)
      jest.spyOn(argon, 'hash').mockResolvedValueOnce('hashedPassword')
      jest.spyOn(prismaService.user, 'create').mockResolvedValueOnce(newUser)

      const result = await authService.signup(authDto)

      expect(result).toEqual(newUser)
    })
  })

  describe('login', () => {
    it('should throw ForbiddenException if user does not exist', async () => {
      const authDto: AuthDto = {
        email: 'nonexistant@test.com',
        password: 'password'
      }

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(null)

      await expect(authService.login(authDto)).rejects.toThrow(
        new ForbiddenException('Invalid Credentials.')
      )
    })

    it('should throw ForbiddenException if password does not match', async () => {
      const authDto: AuthDto = { email: 'test@test.com', password: 'wrongPassword' }

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce({
        id: 'userId',
        email: 'test@test.com',
        hash: 'hashedPassword'
      } as User)
      jest.spyOn(argon, 'verify').mockResolvedValueOnce(false)

      await expect(authService.login(authDto)).rejects.toThrow(
        new ForbiddenException('Invalid Credentials.')
      )
    })

    it('should return the user if login is successful', async () => {
      const authDto: AuthDto = {
        email: 'test@test.com',
        password: 'password'
      }
      const user = {
        id: 'userId',
        email: 'test@test.com',
        hash: 'hashedPassword'
      } as User

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(user)
      jest.spyOn(argon, 'verify').mockResolvedValueOnce(true)

      const result = await authService.login(authDto)

      expect(result).toEqual(user)
    })
  })
})
