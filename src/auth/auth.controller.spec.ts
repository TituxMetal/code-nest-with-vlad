import { ForbiddenException } from '@nestjs/common'
import { Test, type TestingModule } from '@nestjs/testing'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { type AuthDto } from './dto'
import { UserEntity } from './entity'
import { type UserSession } from './types'

describe('AuthController', () => {
  let authController: AuthController
  let authService: AuthService
  let session: UserSession

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: { signup: jest.fn(), login: jest.fn() } }]
    }).compile()

    authController = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
    session = { user: {} } as UserSession
  })

  describe('signup', () => {
    it('should return a user entity on successful signup', async () => {
      const authDto: AuthDto = { email: 'test@test.com', password: 'password' }
      const userEntity = new UserEntity({
        id: 'valid-user-id',
        email: 'test@test.com'
      })

      jest.spyOn(authService, 'signup').mockResolvedValueOnce(userEntity)

      const result = await authController.signup(authDto, session)

      expect(result).toEqual(userEntity)
      expect(authService.signup).toHaveBeenCalledWith(authDto)
    })
  })

  describe('login', () => {
    it('should return a user entity on successful login', async () => {
      const authDto: AuthDto = { email: 'test@test.com', password: 'password' }
      const userEntity = new UserEntity({ email: 'test@test.com', id: 'valid-user-id' })

      jest.spyOn(authService, 'login').mockResolvedValueOnce(userEntity)

      const result = await authController.login(authDto, session)

      expect(result).toEqual(userEntity)
      expect(authService.login).toHaveBeenCalledWith(authDto)
    })

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const authDto: AuthDto = { email: 'test@test.com', password: 'wrongPassword' }
      const error = new ForbiddenException('Invalid Credentials.')

      jest.spyOn(authService, 'login').mockRejectedValue(error)

      await expect(authController.login(authDto, session)).rejects.toThrow(error)
      expect(authService.login).toHaveBeenCalledWith(authDto)
    })
  })
})
