import {
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Gender } from '../../Common';

@ValidatorConstraint({ name: 'confirmationPassword', async: false })
class ConfirmationPasswordConstraint implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments) {
    return value === validationArguments?.object['password'];
  }
  defaultMessage(): string {
    return 'Password and confirmation password do not match';
  }
}

export class SignUpDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  firstName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @Validate(ConfirmationPasswordConstraint)
  cPassword: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  phoneNumber: string;
}

export class SignInDto {

  @IsEmail()
  email: string;

  @IsString()
  password: string;

}