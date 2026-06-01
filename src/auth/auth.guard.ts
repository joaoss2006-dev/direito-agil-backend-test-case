import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authorizationHeader = request.headers.authorization;
    const expectedToken = this.authService.getAccessToken();

    if (!authorizationHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }
    if (!expectedToken) {
      throw new UnauthorizedException('Authentication is not configured');
    }

    const [type, token] = authorizationHeader.split(' ');

    if (type !== 'Bearer' || !token) throw new UnauthorizedException('Invalid authorization format. Use Bearer <token>',);

    if (token !== expectedToken) throw new UnauthorizedException('The token is invalid');

    return true;
  }
}
