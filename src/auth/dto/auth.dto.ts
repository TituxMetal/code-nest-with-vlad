import { Prisma } from '@prisma/client'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: Prisma.UserCreateInput['email']

  @IsString()
  @IsNotEmpty()
  password: string
}
