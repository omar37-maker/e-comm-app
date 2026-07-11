import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from '../DB/Repositories';
import { userModel } from '../DB/Models/user.model';
import { SecurityService, TokenService } from '../Common/Services';
import { JwtService } from '@nestjs/jwt';
// import { LoggerMiddleware } from '../Middlewares';

@Module({
  imports: [userModel],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, SecurityService, TokenService, JwtService],
})
export class AuthModule {
}
