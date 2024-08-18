import {
  Injectable,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { type Request } from 'express'
import { type Observable } from 'rxjs'

import { IS_PUBLIC_ROUTE } from '~/auth/decorators'
import { type UserSession } from '~/auth/types'

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublicRoute = this.reflector.getAllAndOverride<string>(
      IS_PUBLIC_ROUTE,
      [context.getHandler(), context.getClass()]
    )

    if (isPublicRoute) {
      return true
    }

    const request = context.switchToHttp().getRequest() as Request
    const session = request.session as UserSession

    if (!session.user) {
      throw new UnauthorizedException('Session not provided')
    }

    return true
  }
}
