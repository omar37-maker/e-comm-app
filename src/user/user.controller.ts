import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard, RolesGuard } from '../Guards';
import { UserRole } from '../Common';
// import { AuthGuard } from '../Guards';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('health')
  health() {
    return this.userService.health();
  }

  @Get('profile')
  @UseGuards(AuthGuard, new RolesGuard([UserRole.ADMIN]))
  profile(@Req() request: any) {
    console.log({ user: request.user });

    return this.userService.profile(request.user);
  }
}
