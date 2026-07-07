import { JwtSignOptions } from '@nestjs/jwt';
import { JwtPayload, SignOptions } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { TOKEN_TYPES } from './enum';

export interface IGenerateTokenPayload {
  payload: Record<string, any>;
  secret: string;
  options?: JwtSignOptions;
}

export interface IVerifyTokenPayload {
  token: string;
  secret: string;
  options?: JwtSignOptions;
}

export interface ICreateCredentialsPayload {
  payload: object;
  options: { access: SignOptions; refresh: SignOptions };
  requiredToken?: TOKEN_TYPES;
}

export interface ISignatures {
  accessSignature: string;
  accessExpiration: string | undefined;
  refreshSignature: string;
  refreshExpiration: string | undefined;
}

export interface IGetRolePayload {
  role: string;
  tokenType?: TOKEN_TYPES;
  both?: boolean;
}

export interface IDecodedTokenPayload {
  token: string;
  tokenType: TOKEN_TYPES;
}

export interface IUser {
  _id: string | Types.ObjectId;
  role: string;
  email?: string;
  [key: string]: any;
}

export interface IDecodedTokenResult {
  user: IUser;
  decodedData: JwtPayload | string;
}
