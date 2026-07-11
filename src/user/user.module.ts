import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TokenService } from '../Common/Services';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../DB/Repositories';
import { userModel } from '../DB/Models';

@Module({
  imports: [userModel],
  controllers: [UserController],
  providers: [UserService, TokenService, JwtService, UserRepository],
})
export class UserModule {}
