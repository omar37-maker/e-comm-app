import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { UserRepository } from '../../DB/Repositories';
import {
  ICreateCredentialsPayload,
  IDecodedTokenPayload,
  IDecodedTokenResult,
  IGenerateTokenPayload,
  IGetRolePayload,
  ISignatures,
  IVerifyTokenPayload,
  IUser,
} from '../interfaces';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TOKEN_TYPES, UserRole } from '../enum';
import { Types } from 'mongoose';
@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {}

  generateToken({ payload, secret, options }: IGenerateTokenPayload): string {
    return this.jwtService.sign(payload as object, {
      secret,
      ...(options as JwtSignOptions),
    });
  }

  verifyToken({
    token,
    secret,
    options,
  }: IVerifyTokenPayload): JwtPayload | string {
    return this.jwtService.verify(token, {
      secret,
      ...(options as JwtVerifyOptions),
    });
  }

  createLoginCredentials({
    payload,
    options,
    requiredToken,
  }: ICreateCredentialsPayload) {
    const signatures = this.getSignatureByTypeAndRole({
      role: (payload as { role: string }).role,
      both: true,
    }) as ISignatures;

    let accessToken: string | undefined;
    let refreshToken: string | undefined;

    switch (requiredToken) {
      case TOKEN_TYPES.ACCESS:
        accessToken = this.generateToken({
          payload,
          secret: signatures.accessSignature,
          options: options.access,
        });
        break;
      case TOKEN_TYPES.REFRESH:
        refreshToken = this.generateToken({
          payload,
          secret: signatures.refreshSignature,
          options: options.refresh,
        });
        break;
      default:
        accessToken = this.generateToken({
          payload,
          secret: signatures.accessSignature,
          options: options.access,
        });
        refreshToken = this.generateToken({
          payload,
          secret: signatures.refreshSignature,
          options: options.refresh,
        });
    }
    return {
      accessToken,
      refreshToken,
    };
  }
  async decodeToken({
    token,
    tokenType,
  }: IDecodedTokenPayload): Promise<IDecodedTokenResult> {
    // decode token to get user role
    const data = jwt.decode(token);
    const role = (data as { role: string })?.role;
    if (!role) throw new BadRequestException('invalid payload');

    const signature: string = this.getSignatureByTypeAndRole({
      role,
      tokenType,
    }) as string;

    // verify token
    const decodedData = this.verifyToken({ token, secret: signature });
    const _id = (decodedData as IUser)?._id;
    if (!_id) throw new BadRequestException('invalid payload');

    const userId = Types.ObjectId.isValid(_id) ? new Types.ObjectId(_id) : null;
    if (!userId) throw new BadRequestException('invalid user id');

    // check if jti is blacklisted
    // const isBlackListed = await get({
    //   key: `bl_${tokenType}_${decodedData.jti}`,
    // });
    // if (isBlackListed)
    //   throw new BadRequestException("Your session is ended . login again");

    const user: IUser | null =
      await this.userRepository.findDocumentById(userId);
    if (!user) throw new NotFoundException('user not found');
    return { user, decodedData };
  }

  detectSignatureByRole = ({ role }: { role: string }) => {
    const jwtConfig = this.configService.get<{
      admin: ISignatures;
      user: ISignatures;
    }>('jwt');

    if (!jwtConfig) {
      throw new BadRequestException('JWT configuration is not available');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    return role === UserRole.ADMIN ? jwtConfig.admin : jwtConfig.user;
  };

  getSignatureByTypeAndRole({
    role,
    tokenType,
    both = false,
  }: IGetRolePayload): string | ISignatures {
    const signatures = this.detectSignatureByRole({ role });

    if (both) return signatures;

    let tokenSignature;
    switch (tokenType) {
      case TOKEN_TYPES.ACCESS:
        tokenSignature = signatures.accessSignature;
        break;
      case TOKEN_TYPES.REFRESH:
        tokenSignature = signatures.refreshSignature;
        break;
      default:
        throw new BadRequestException('invalid token type');
    }
    return tokenSignature;
  }
}

export default TokenService;
