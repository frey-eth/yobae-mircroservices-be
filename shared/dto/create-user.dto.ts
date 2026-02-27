import { Field, InputType } from '@nestjs/graphql';
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

@InputType()
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  name!: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  @Transform(({ value }) => value?.toLowerCase())
  @IsEmail()
  @Field()
  email!: string;

  @IsString()
  @MinLength(6)
  @Field()
  password!: string;

  @IsEnum(GENDER)
  @Field()
  gender!: GENDER;
}
