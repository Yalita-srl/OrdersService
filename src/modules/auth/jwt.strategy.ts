import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,

      // Debe ser exactamente el mismo secreto que usa UsersService
      secretOrKey: config.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // El payload es exactamente lo que recibes:
    // {
    //   "user_id": "1",
    //   "email": "sergioveloper@gmail.com",
    //   "role": "user",
    //   "exp": 1763041664,
    //   "orig_iat": 1763038064
    // }

    if (!payload.user_id) {
      throw new UnauthorizedException('Token inválido');
    }

    // Este return se asigna a request.user
    return {
      id: payload.user_id,
      email: payload.email,
      role: payload.role,
    };
  }
}
