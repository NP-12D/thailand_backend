import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class SignUpDto {
  @ApiProperty({ example: 'Giorgi', minLength: 1, maxLength: 20 })
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @ApiProperty({ example: 'giorgi@example.com' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'secret123', minLength: 6, maxLength: 20 })
  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  password!: string;
}
