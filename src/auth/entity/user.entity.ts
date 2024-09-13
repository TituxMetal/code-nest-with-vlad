import { Exclude } from 'class-transformer'
import { IsString } from 'class-validator'

export class UserEntity {
  id: string
  email: string

  @Exclude()
  hash: string

  @IsString()
  firstName: string

  @IsString()
  lastName: string

  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial)
  }
}
