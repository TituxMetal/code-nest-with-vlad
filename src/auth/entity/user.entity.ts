import { Exclude } from 'class-transformer'

export class UserEntity {
  id: string
  email: string

  @Exclude()
  hash: string

  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial)
  }
}
