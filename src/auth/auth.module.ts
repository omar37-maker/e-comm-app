import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from '../DB/Repositories';
import { userModel } from '../DB/Models/user.model';
import SecurityService from '../Common/Services/security.service';

@Module({
  imports: [userModel],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, SecurityService],
})
export class AuthModule {}
