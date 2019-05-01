import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "src/entities/user/models/user-role.enum";
import { InstanceType } from "typegoose";
import { User } from "src/entities/user/models/user.model";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this._reflector.get<UserRole[]>('roles', context.getHandler())

    if (!roles || roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user: InstanceType<User> = request.user; 
    const hasRole = () => roles.includes(user.role);

    if (user && user.role && hasRole()) {
      return true;
    }

    throw new HttpException('You don\'t have permission', HttpStatus.UNAUTHORIZED);
  }
}