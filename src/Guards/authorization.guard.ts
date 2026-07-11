import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export default class RolesGuard implements CanActivate {

    constructor(private allowedRoles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const userRole = request.user?.role
      if (!this.allowedRoles.includes(userRole)) { 
        throw new UnauthorizedException('Unauthorized')
      }
      return true    
  }
}
