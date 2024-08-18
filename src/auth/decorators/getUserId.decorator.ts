import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import { type Request } from 'express'

import { type UserSession } from '../types'

export const GetUserId = createParamDecorator(
  (_data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest() as Request
    const session = request.session as UserSession

    return session.user?.id
  }
)
