import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCandidateDto {
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  @IsNotEmpty()
  fullName!: string;

  @IsString()
  @IsEmail()
  @MaxLength(160)
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(11)
  @MaxLength(160)
  @IsNotEmpty()
  phoneNumber!: string;
}