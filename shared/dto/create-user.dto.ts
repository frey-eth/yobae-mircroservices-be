import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsString,
  MinLength,
} from 'class-validator';

export enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  @Transform(({ value }) => value?.toLowerCase())
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(GENDER)
  gender: GENDER;
}
