import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    // Expect token in header 'x-auth-token'
    const token = req.headers['x-auth-token'] || req.headers['authorization'];
    if (!token) throw new ForbiddenException('No token provided');

    const tokenStr = Array.isArray(token) ? token[0] : token;
    // token is simple user id
    const userId = parseInt(String(tokenStr));
    if (isNaN(userId)) throw new ForbiddenException('Invalid token');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ForbiddenException('User not found');

    // user.role is e.g. 'ADMIN' or 'VOTER'
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Insufficient role');
    }

    // attach user to request for handlers
    req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    return true;
  }
}
