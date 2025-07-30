import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User_Role } from 'src/interfaces/user.interface';
import { ROLES_KEY } from './roles.decorator';
import { DecoderService } from 'src/decoder/decoder.service';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(
    private reflector: Reflector,
    private readonly decoderService: DecoderService
  ) {}

  canActivate(context: ExecutionContext): boolean {

    const requiredRoles = this.reflector.getAllAndOverride<User_Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()], // Check both method and class level
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 2. Extract user from the request
    const request = context.switchToHttp().getRequest();
  
    const user = this.decoderService.decode(request);

    if (!user?.role) {
      this.logger.warn(`Unauthorized access attempt: No user/role found`);
      throw new ForbiddenException('Access denied: Invalid user permissions');
    }

    // 3. Check if user has at least one required role
    const hasRequiredRole = requiredRoles.includes(user.role);

    if (!hasRequiredRole) {
      this.logger.warn(
        `Forbidden access: User role "${user.role}" does not match required roles [${requiredRoles.join(', ')}]`,
      );
      throw new ForbiddenException(
        'Access denied: You do not have sufficient permissions',
      );
    }

    return true;
  }
}
