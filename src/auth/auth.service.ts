import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from '../DB/Repositories';
import { SignInDto, SignUpDto } from './DTO/auth.dto';
import SecurityService from '../Common/Services/security.service';

@Injectable()
export class AuthService {

  constructor(
    private readonly userRepository: UserRepository,
    private securityService: SecurityService 
  ) {}

  async _checkDuplicates(email: string, phoneNumber: string) {
    const isEmailExists = await this.userRepository.findOneDocument({ email });
    if (isEmailExists) {
      throw new ConflictException('Email already exists');
      }

      const isPhoneExists = await this.userRepository.findOneDocument({ phoneNumber });
      if (isPhoneExists) { 
        throw new ConflictException('Phone number already exists');
      }

      return {isEmailExists, isPhoneExists};
    }

    async signUp(body: SignUpDto) { 
        const { firstName, lastName, password, gender, email, phoneNumber } = body;

        await this._checkDuplicates(email, phoneNumber);

        return this.userRepository.createDocument({
            firstName,
            lastName,
            password,
            gender,
            email,
            phoneNumber,
        })
  }

  async signIn(body: SignInDto) { 
    const { email, password } = body;

    const user = await this.userRepository.findOneDocument({ email });
    if (!user) { 
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await this.securityService.compare(password, user.password);
    if (!isPasswordValid) { 
      throw new BadRequestException('Invalid email or password');
    }
    return user;
  }
}





