import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from '../DB/Repositories';
import { SignInDto, SignUpDto } from './DTO/auth.dto';
import { TokenService, SecurityService } from './../Common/Services';
import { UserDocument } from '../Common';
import { ConfigService } from '@nestjs/config';
import { SignOptions } from 'jsonwebtoken';
import crypto from 'node:crypto'

@Injectable()
export class AuthService {
  private readonly jwtSecrets;
  constructor(
    private readonly userRepository: UserRepository,
    private securityService: SecurityService,
    private tokenService: TokenService,
    private configService: ConfigService,
  ) {
    this.jwtSecrets = this.configService.get('jwt');
  }

  async _checkDuplicates(email: string, phoneNumber: string) {
    const isEmailExists = await this.userRepository.findOneDocument({ email });
    if (isEmailExists) {
      throw new ConflictException('Email already exists');
    }

    const isPhoneExists = await this.userRepository.findOneDocument({
      phoneNumber,
    });
    if (isPhoneExists) {
      throw new ConflictException('Phone number already exists');
    }

    return { isEmailExists, isPhoneExists };
  }

   _buildTokens(data: Pick<UserDocument, '_id' | 'email' | 'role'>) {
    const tokenPayload = { _id: data._id, email: data.email, role: data.role };
    const { accessToken, refreshToken } =
      this.tokenService.createLoginCredentials({
        payload: tokenPayload,
        options: {
          access: {
            expiresIn: this.jwtSecrets[data.role]
              .accessExpiration as SignOptions['expiresIn'],
            jwtid: crypto.randomUUID(),
          },
          refresh: {
            expiresIn: this.jwtSecrets[data.role]
              .refreshExpiration as SignOptions['expiresIn'],
          },
        },
      });

    return { accessToken, refreshToken };
  }

  async signUp(body: SignUpDto) {
    const { firstName, lastName, password, gender, email, phoneNumber } = body;

    await this._checkDuplicates(email, phoneNumber);

      const hashedPassword = await this.securityService.hash(password);

    

    return this.userRepository.createDocument({
      firstName,
      lastName,
      password: hashedPassword,
      gender,
      email,
      phoneNumber,
    });
  }

  async signIn(body: SignInDto) {
    const { email, password } = body;

    const user = await this.userRepository.findOneDocument({ email });
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await this.securityService.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }
    return this._buildTokens(user);
  }
}





